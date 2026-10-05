import { IngredientUnit } from '../models/ingredient-entry';

const UNIT_SYMBOLS: Record<IngredientUnit, string> = {
  gram: 'g',
  kg: 'kg',
  ml: 'ml',
  l: 'l',
  piece: ' piece',
};

/** Returns an amount with its unit, e.g. "100g" or "2 pieces". */
export function formatAmount(amount: number, unit: IngredientUnit): string {
  const isPlural = unit === 'piece' && amount !== 1;
  return `${amount}${UNIT_SYMBOLS[unit]}${isPlural ? 's' : ''}`;
}
