import { Routes, RouterModule } from '@angular/router';
import { TokenCreateComponent } from './token-create/token-create.component';
import { TokenEditComponent } from './token-edit/token-edit.component';
import { TokenListComponent } from './token-list/token-list.component';
import { TokenViewComponent } from './token-view/token-view.component';

const routes: Routes = [
  {
    path: 'token-list',
    component:TokenListComponent,
  },
  {
    path: 'token-view/:id',
    component: TokenViewComponent,
  },
  { path: 'token-edit/:id', component: TokenEditComponent },
  { path: 'token-create', component: TokenCreateComponent },
  {
    path: "**",
    redirectTo: "/pages/miscellaneous/error", //Error 404 - Page not found
  }
];

export const TokenManagementRoutes = RouterModule.forChild(routes);
