import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/extractor',
    pathMatch: 'full'
  },
  {
    path: 'extractor',
    loadComponent: () => import('./components/text-extractor-parent/text-extractor-parent.component').then(m => m.TextExtractorParentComponent),
    title: 'Text Extractor'
  },
  {
    path: 'about',
    loadComponent: () => import('./components/about/about.component').then(m => m.AboutComponent),
    title: 'About'
  },
  {
    path: '**',
    redirectTo: '/extractor'
  }
];

