import { Component, computed, input, model } from '@angular/core';

/** A page number, or null for the gap between page numbers that are far apart. */
export type PaginationItem = number | null;

const FIRST_PAGE = 1;
// Pages shown on each side of the current page.
const NEIGHBOUR_PAGES = 1;
// At the edges, this many pages stay visible, so the row keeps its length.
const EDGE_PAGES = 3;

/** Returns the page numbers to show, with null where pages are left out. */
export function buildPaginationItems(currentPage: number, totalPages: number): PaginationItem[] {
  const lastEdgeStart = totalPages - EDGE_PAGES + 1;
  const start = Math.max(FIRST_PAGE, Math.min(currentPage - NEIGHBOUR_PAGES, lastEdgeStart));
  const end = Math.min(totalPages, Math.max(currentPage + NEIGHBOUR_PAGES, EDGE_PAGES));
  const pages = new Set<number>([FIRST_PAGE, totalPages]);
  for (let page = start; page <= end; page++) {
    pages.add(page);
  }
  return [...pages]
    .sort((a, b) => a - b)
    .flatMap((page, index, sorted) => {
      const hasGap = index > 0 && page - sorted[index - 1] > 1;
      return hasGap ? [null, page] : [page];
    });
}

@Component({
  selector: 'app-pagination',
  styleUrl: './pagination.scss',
  templateUrl: './pagination.html',
})
export class Pagination {
  readonly totalPages = input.required<number>();
  readonly currentPage = model<number>(FIRST_PAGE);
  readonly ariaLabel = input<string>('Pagination');

  protected readonly items = computed<PaginationItem[]>(() =>
    buildPaginationItems(this.currentPage(), this.totalPages()),
  );
  protected readonly isFirstPage = computed<boolean>(() => this.currentPage() <= FIRST_PAGE);
  protected readonly isLastPage = computed<boolean>(() => this.currentPage() >= this.totalPages());

  /** Switches to the given page. */
  protected goToPage(page: number): void {
    this.currentPage.set(page);
  }

  /** Switches to the previous or next page. */
  protected step(direction: -1 | 1): void {
    this.goToPage(this.currentPage() + direction);
  }
}
