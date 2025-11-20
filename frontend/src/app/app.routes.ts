import { RouterModule, Routes } from '@angular/router';
import { HomPage } from './pages/hom.page/hom.page';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    { path: '', component: HomPage }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutes {

}
