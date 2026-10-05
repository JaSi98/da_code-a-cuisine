import { Routes } from '@angular/router';

const APP_NAME = 'Code à Cuisine';

export const routes: Routes = [
  {
    path: '',
    title: APP_NAME,
    loadComponent: () => import('./pages/home/home').then((page) => page.Home),
  },
  {
    path: 'generate',
    title: `Generate recipe – ${APP_NAME}`,
    loadComponent: () =>
      import('./pages/generate-recipe/generate-recipe').then((page) => page.GenerateRecipe),
  },
  {
    path: 'generate/preferences',
    title: `Preferences – ${APP_NAME}`,
    loadComponent: () => import('./pages/preferences/preferences').then((page) => page.Preferences),
  },
  {
    path: 'results',
    title: `Your recipes – ${APP_NAME}`,
    loadComponent: () => import('./pages/results/results').then((page) => page.Results),
  },
  {
    path: 'recipe/:id',
    title: `Recipe – ${APP_NAME}`,
    loadComponent: () => import('./pages/recipe/recipe').then((page) => page.Recipe),
  },
  {
    path: 'cookbook',
    title: `Cookbook – ${APP_NAME}`,
    loadComponent: () => import('./pages/cookbook/cookbook').then((page) => page.Cookbook),
  },
  {
    path: 'cookbook/recipe/:id',
    title: `Recipe – ${APP_NAME}`,
    data: { origin: 'cookbook' },
    loadComponent: () => import('./pages/recipe/recipe').then((page) => page.Recipe),
  },
  {
    path: 'cookbook/:cuisine',
    title: `Cookbook – ${APP_NAME}`,
    loadComponent: () =>
      import('./pages/cuisine-recipes/cuisine-recipes').then((page) => page.CuisineRecipes),
  },
  { path: '**', redirectTo: '' },
];
