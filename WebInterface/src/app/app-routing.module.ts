import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './gaurds/auth.guard';
import { AuthPageComponent } from './pages/auth-page/auth-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent, canActivate: [AuthGuard] },
  { path: 'list/:id', component: ListPageComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfilePageComponent, canActivate: [AuthGuard] },
  { path: 'login', component: AuthPageComponent },
  { path: 'register', component: AuthPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
