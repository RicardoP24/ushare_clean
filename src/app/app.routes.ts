  import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './autenticacao/login/login.component';
import { RegistroComponent } from './autenticacao/registro/registro.component';
import { LocationSelectionComponent } from './autenticacao/location-selection/location-selection.component';
import { UserInfoRegistrationComponent } from './autenticacao/user-info-registration/user-info-registration.component';
import { LocationPermissionComponent } from './autenticacao/location-permission/location-permission.component';
import { NgModule } from '@angular/core';
import { FeedComponent } from './feed/feed.component';
import { FormsModule } from '@angular/forms';
import { AboutUsComponent } from './about-us/about-us.component';
import { ComentariosComponent } from './feed/comentarios/comentarios.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' }, // Default route
    { path: 'login', component: LoginComponent },
    { path:'registro', component: RegistroComponent},
    { path:'registro/UserInfoRegistration', component: UserInfoRegistrationComponent},
    {path: 'LocationSelection', component:  LocationSelectionComponent},
    {path: 'locationpermision',component:LocationPermissionComponent},
    {path: 'feed', component:FeedComponent},
    {path: 'aboutUs', component:AboutUsComponent},

  ];

  @NgModule({

    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }