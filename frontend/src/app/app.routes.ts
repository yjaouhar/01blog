import { RouterModule, Routes } from '@angular/router';
import { Discover } from './pages/discover/discover';
import { Profile } from './pages/profile/profile';
import { AdminPanel } from './pages/admin-panel/admin-panel';
import { Register } from './pages/register/register';
import { Login } from './pages/login/login';
import { authGuard } from './guards/auth-guard';
import { Layout } from './pages/layout/layout';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    { path: 'register', component: Register },
    { path: 'login', component: Login },
    {
        path: '', component: Layout,
        children: [
            { path: 'discover', component: Discover, canActivate: [authGuard], data: { roles: ['USER', 'ADMIN'] } },
            { path: 'profile/:username', component: Profile },
            // { path: 'profile/:username', component: Profile, canActivate: [authGuard], data: { roles: ['USER', 'ADMIN'] } },
            { path: 'admin-panel', component: AdminPanel, canActivate: [authGuard], data: { roles: ['ADMIN'] } },

        ]
    },

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutes {

}
