import { Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {ConnexionComponent} from "./connexion/connexion.component";
import {InscriptionComponent} from "./inscription/inscription.component";
import {NotfoundComponent} from "./notfound/notfound.component";

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
  },
  {
    path: 'inscription',
    component: InscriptionComponent,
    title: 'NEST - Inscription'
  },
  {
    path: '**',
    component: NotfoundComponent,
    title: 'NEST - Page non trouvée'
  },

];
