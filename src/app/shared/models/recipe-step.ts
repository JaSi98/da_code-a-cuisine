/** The cooks who share the work; one recipe has 1 to 3, the labels support up to 4. */
export type ChefNumber = 1 | 2 | 3 | 4;

/** One step of the directions, assigned to one cook. */
export interface RecipeStep {
  /** Text, so parallel steps can share a number, e.g. "2a" and "2b". */
  number: string;
  title: string;
  description: string;
  chef: ChefNumber;
}
