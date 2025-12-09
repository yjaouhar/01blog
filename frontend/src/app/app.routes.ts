import { RouterModule, Routes } from '@angular/router';
import { HomPage } from './pages/hom.page/hom.page';
import { NgModule } from '@angular/core';
import { Discover } from './pages/discover/discover';
import { Profile } from './pages/profile/profile';
import { AdminPanel } from './pages/admin-panel/admin-panel';
import { Register } from './pages/register/register';
import { Login } from './pages/login/login';

export const routes: Routes = [
    { path: 'register', component: Register   },
    { path: 'login', component: Login },
    { path: '', component: HomPage },
    { path: 'discover', component: Discover },
    { path: 'profile', component: Profile },
    { path: 'profile/:username', component: Profile },
    { path: 'admin-panel', component: AdminPanel },

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutes {

}
