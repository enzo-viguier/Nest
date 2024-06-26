import { Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {ConnexionComponent} from "./connexion/connexion.component";
import {InscriptionComponent} from "./inscription/inscription.component";
import {NotfoundComponent} from "./notfound/notfound.component";
import {FicheAnnonceComponent} from "./fiche-annonce/fiche-annonce.component";
import {CompteComponent} from "./compte/compte.component";
import {CreeAnnonceComponent} from "./cree-annonce/cree-annonce.component";
import {ReserverLocationComponent} from "./reserver-location/reserver-location.component";
import {ModifierAnnonceComponent} from "./modifier-annonce/modifier-annonce.component";
import {ModifierLocationComponent} from "./modifier-location/modifier-location.component";

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
    path: 'location/:id',
    component: FicheAnnonceComponent,
    title: 'NEST - Fiche Annonce'
  },
  {
    path: 'reservation/:id',
    component: ReserverLocationComponent,
    title: 'NEST - Réserver une location'
  },
  {
    path: 'compte',
    component: CompteComponent,
    title: 'NEST - Mon Compte'
  },
  {
    path: 'compte/cree-annonce',
    component: CreeAnnonceComponent,
    title: 'NEST - Créer une annonce'
  },
  {
    path: 'compte/modifier-annonce/:id',
    component: ModifierAnnonceComponent,
    title: 'NEST - Modifier une annonce'
  },
  {
    path: 'compte/modifier-location/:id',
    component: ModifierLocationComponent,
    title: 'NEST - Modifier une location'
  },

  //Page NotFound -> A mettre en dernier !
  {
    path: '**',
    component: NotfoundComponent,
    title: 'NEST - Page non trouvée'
  },

];
