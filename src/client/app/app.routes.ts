import { Routes } from '@angular/router';

import { HomeRoutes } from './+home/index';
import { DocsRoutes } from './+docs/index';

export const routes: Routes = [
  ...HomeRoutes,
  ...DocsRoutes
];
