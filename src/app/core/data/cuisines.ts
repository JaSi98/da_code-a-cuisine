import { CUISINE_OPTIONS, Cuisine } from '../../shared/models/recipe-preferences';

/** How a cuisine is presented in the cookbook. */
export interface CuisineInfo {
  value: Cuisine;
  name: string;
  emoji: string;
  image: string;
  banner: string;
  bannerMobile: string;
}

const CUISINE_EMOJIS: Record<Cuisine, string> = {
  german: '🥨',
  italian: '🤌',
  indian: '🍛',
  japanese: '🥢',
  gourmet: '✨',
  fusion: '🍢',
  arabic: '🧆',
};

// The Arabic banner is drawn as a vector graphic, all others are photos.
const BANNER_EXTENSIONS: Partial<Record<Cuisine, string>> = { arabic: 'svg' };
const DEFAULT_BANNER_EXTENSION = 'webp';

/** All cuisines in the order of the cookbook overview. */
export const CUISINES: readonly CuisineInfo[] = [
  'italian',
  'german',
  'japanese',
  'gourmet',
  'indian',
  'fusion',
  'arabic',
].map((value) => createCuisineInfo(value as Cuisine));

/** Returns the presentation of a cuisine, or undefined for an unknown value. */
export function findCuisine(value: string): CuisineInfo | undefined {
  return CUISINES.find((cuisine) => cuisine.value === value);
}

/** Builds the names and image paths of a cuisine from its value. */
function createCuisineInfo(value: Cuisine): CuisineInfo {
  const label = CUISINE_OPTIONS.find((option) => option.value === value)?.label ?? value;
  const extension = BANNER_EXTENSIONS[value] ?? DEFAULT_BANNER_EXTENSION;
  return {
    value,
    name: `${label} cuisine`,
    emoji: CUISINE_EMOJIS[value],
    image: `assets/cuisines/${value}.webp`,
    banner: `assets/banners/${value}.${extension}`,
    bannerMobile: `assets/banners/${value}-mobile.${extension}`,
  };
}
