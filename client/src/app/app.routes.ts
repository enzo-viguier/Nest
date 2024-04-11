import { Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {ConnexionComponent} from "./connexion/connexion.component";

export const routes: Routes = [

  {
    path: '',
    component: HomeComponent,
    title: 'NEST - Accueil'
  },
  {
    path: 'connexion',
    component: ConnexionComponent,
    title: 'NEST - Connexion'
  }

];
