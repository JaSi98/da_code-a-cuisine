import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'liked-recipes';

/** Remembers in this browser which recipes the user has liked, so each one counts only once. */
@Injectable({ providedIn: 'root' })
export class LikedRecipes {
  private readonly likedIds = signal<ReadonlySet<string>>(this.readIds());

  /** Tells whether the recipe with this id is liked in this browser. */
  isLiked(id: string): boolean {
    return this.likedIds().has(id);
  }

  /** Marks the recipe as liked or not liked. */
  setLiked(id: string, isLiked: boolean): void {
    const ids = new Set(this.likedIds());
    if (isLiked) {
      ids.add(id);
    } else {
      ids.delete(id);
    }
    this.likedIds.set(ids);
    this.writeIds(ids);
  }

  /** Reads the liked ids; a missing, broken or blocked storage starts empty. */
  private readIds(): ReadonlySet<string> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return new Set<string>(stored ? JSON.parse(stored) : []);
    } catch {
      return new Set();
    }
  }

  /** Stores the liked ids; a blocked storage only means they are forgotten on reload. */
  private writeIds(ids: ReadonlySet<string>): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
    } catch {
      // Nothing to do: likes still work until the page is reloaded.
    }
  }
}
