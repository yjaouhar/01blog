import { RouterModule, Routes } from '@angular/router';
import { Login } from './page/login/login';
import { Home } from './page/home/home';
import { Regester } from './page/regester/regester';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    { path: "", component: Home },
    { path: "login", component: Login },
    { path: "regester", component: Regester },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutes{

}