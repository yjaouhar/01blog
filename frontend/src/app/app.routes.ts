import { RouterModule, Routes } from '@angular/router';
import { HomPage } from './pages/hom.page/hom.page';
import { NgModule } from '@angular/core';
import { Discover } from './pages/discover/discover';
import { Profile } from './pages/profile/profile';
import { AdminPanel } from './pages/admin-panel/admin-panel';
import { Register } from './pages/register/register';
import { Login } from './pages/login/login';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    { path: 'register', component: Register, canActivate: [authGuard], data: { roles: ['GUEST'] } },
    { path: 'login', component: Login },
    { path: '', component: HomPage, canActivate: [authGuard], data: { roles: ['USER', 'ADMIN'] } },
    { path: 'discover', component: Discover, canActivate: [authGuard], data: { roles: ['USER', 'ADMIN'] } },
    { path: 'profile', component: Profile, canActivate: [authGuard], data: { roles: ['USER', 'ADMIN'] } },
    { path: 'profile/:username', component: Profile, canActivate: [authGuard], data: { roles: ['USER', 'ADMIN'] } },
    { path: 'admin-panel', component: AdminPanel, canActivate: [authGuard], data: { roles: ['ADMIN'] } },

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutes {

}
