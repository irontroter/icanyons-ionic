import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { hasCustomClaim, redirectUnauthorizedTo, redirectLoggedInTo, canActivate } from '@angular/fire/auth-guard';

const adminOnly = hasCustomClaim('admin');
const redirectUnauthorizedToLogin = redirectUnauthorizedTo(['login']);
const redirectLoggedInToItems = redirectLoggedInTo(['home']);
const belongsToAccount = (next) => hasCustomClaim(`account-${next.params.id}`);

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),
   ...canActivate(redirectUnauthorizedToLogin)},
  { path: 'list', loadChildren: () => import('./pages/list/list.module').then(m => m.ListPageModule)},
  { path: 'login', loadChildren: './auth/login/login.module#LoginPageModule', ...canActivate(redirectLoggedInToItems)},
  { path: 'forgot', loadChildren: './auth/forgot/forgot.module#ForgotPageModule' },
  { path: 'profile/:uid', loadChildren: './auth/profile/profile.module#ProfilePageModule' },
  { path: 'register', loadChildren: './auth/register/register.module#RegisterPageModule' },
  { path: 'admin', loadChildren: './auth/admin/admin.module#AdminPageModule' },
  { path: 'change-profile/:uid', loadChildren: './auth/change-profile/change-profile.module#ChangeProfilePageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
