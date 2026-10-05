import { Injectable, computed, signal } from '@angular/core';

const STORAGE_KEY = 'recipe-quota';
const DAILY_LIMIT = 3;
const DATE_LENGTH = 10;

/** How many generations were used on which day (UTC date, e.g. "2026-10-05"). */
interface QuotaState {
  date: string;
  used: number;
}

/**
 * Counts the recipe generations of this browser per day. It only gives early feedback: the
 * binding limit per IP address and day is enforced by the generator workflow, whose answer
 * overrides the local count.
 */
@Injectable({ providedIn: 'root' })
export class RecipeQuota {
  private readonly state = signal<QuotaState>(this.readState());

  readonly limit = DAILY_LIMIT;
  readonly remaining = computed<number>(() => Math.max(0, DAILY_LIMIT - this.usedToday()));
  readonly hasRemaining = computed<boolean>(() => this.remaining() > 0);

  /** Counts one successful generation. */
  recordUse(): void {
    this.setUsed(this.usedToday() + 1);
  }

  /** Takes over the number of generations left that the workflow reported. */
  syncRemaining(remaining: number): void {
    this.setUsed(DAILY_LIMIT - Math.min(Math.max(remaining, 0), DAILY_LIMIT));
  }

  /** Marks today's generations as used up, e.g. after the workflow refused a request. */
  markExhausted(): void {
    this.setUsed(DAILY_LIMIT);
  }

  /** Returns the generations used today; a count from an earlier day no longer applies. */
  private usedToday(): number {
    const state = this.state();
    return state.date === today() ? state.used : 0;
  }

  /** Stores the count for today. */
  private setUsed(used: number): void {
    const state: QuotaState = { date: today(), used };
    this.state.set(state);
    this.writeState(state);
  }

  /** Reads the stored count; a missing, broken or blocked storage starts at zero. */
  private readState(): QuotaState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : { date: today(), used: 0 };
    } catch {
      return { date: today(), used: 0 };
    }
  }

  /** Stores the count; a blocked storage only means the early check is skipped. */
  private writeState(state: QuotaState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Nothing to do: the workflow still enforces the limit.
    }
  }
}

/** Returns today's date in UTC, the day the workflow counts in. */
function today(): string {
  return new Date().toISOString().slice(0, DATE_LENGTH);
}
