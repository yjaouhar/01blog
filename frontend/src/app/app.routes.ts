import { RouterModule, Routes } from '@angular/router';
import { Discover } from './pages/discover/discover';
import { Profile } from './pages/profile/profile';
import { AdminPanel } from './pages/admin-panel/admin-panel';
import { Register } from './pages/register/register';
import { Login } from './pages/login/login';
import { authGuard } from './guards/auth-guard';
import { Layout } from './pages/layout/layout';
import { NgModule } from '@angular/core';
import { Forbiden } from './pages/forbiden/forbiden';
import { NotFound } from './pages/not-found/not-found';
import { Poste } from './pages/poste/poste';

export const routes: Routes = [
    { path: 'register', component: Register, canActivate: [authGuard], data: { roles: ['USER', 'ADMIN'] } },
    { path: 'login', component: Login },
    {
        path: '', component: Layout, canActivate: [authGuard], data: { roles: ['USER', 'ADMIN'] },
        children: [
            { path: 'discover', component: Discover, canActivate: [authGuard], data: { roles: ['USER', 'ADMIN'] } },
            { path: 'poste/:postId', component: Poste, canActivate: [authGuard], data: { roles: ['USER', 'ADMIN'] } },
            { path: 'profile/:username', component: Profile, canActivate: [authGuard], data: { roles: ['USER', 'ADMIN'] } },
            { path: 'admin-panel', component: AdminPanel, canActivate: [authGuard], data: { roles: ['ADMIN'] } },

        ]
    },
    { path: "forbidden", component: Forbiden },
    { path: "**", component: NotFound },
    { path: "not-found", component: NotFound },

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutes {

}
