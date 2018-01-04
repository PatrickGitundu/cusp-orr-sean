import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ResultsComponent } from './results/results.component';
import { MapsComponent } from './maps/maps.component';

const routes: Routes = [
 {
   path: '',
   redirectTo: 'login',
   pathMatch: 'full'
 },
 {
   path: 'login',
   component: LoginComponent
 },
 {
   path: 'home',
   component: HomeComponent
 },
 {
   path: 'maps',
   component: MapsComponent
 },
 {
   path: 'results',
   component: ResultsComponent
 }
 ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
