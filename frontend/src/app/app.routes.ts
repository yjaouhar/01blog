import { RouterModule, Routes } from '@angular/router';
import { Login } from './page/login/login';
import { Home } from './page/home/home';
import { Regester } from './page/regester/regester';
import { NgModule } from '@angular/core';
import { Discover } from './page/discover/discover';
import { ProfileComponent } from './component/profile-component/profile-component';

export const routes: Routes = [
    { path: "", component: Home },
    { path: "login", component: Login },
    { path: "regester", component: Regester },
    { path: "discover", component: Discover },
    { path: "profile", component: ProfileComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutes {

}