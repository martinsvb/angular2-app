import { Routes } from '@angular/router';

import { HomeRoutes } from './+home/index';
import { DocsRoutes } from './+docs/index';
import { NewsRoutes } from './+news/index';
import { LoginRoutes } from './+login/index';
import { RegisterRoutes } from './+register/index';
import { ProfileRoutes } from './+profile/index';
import { CompaniesRoutes } from './+companies/index';
import { ModulesRoutes } from './+modules/index';
import { UsersRoutes } from './+users/index';
import { RolesRoutes } from './+roles/index';

export const routes: Routes = [
  ...HomeRoutes,
  ...DocsRoutes,
  ...NewsRoutes,
  ...LoginRoutes,
  ...RegisterRoutes,
  ...ProfileRoutes,
  ...CompaniesRoutes,
  ...ModulesRoutes,
  ...UsersRoutes,
  ...RolesRoutes
];
