import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { ListItemComponent } from './components/list-item/list-item.component';
import { AuthPageComponent } from './pages/auth-page/auth-page.component';
import { AddComponent } from './components/add/add.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    NavBarComponent,
    ListPageComponent,
    TodoItemComponent,
    ListItemComponent,
    AuthPageComponent,
    AddComponent,
    ProfilePageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
