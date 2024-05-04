import { Component } from '@angular/core';
import {NavComponent} from "../nav/nav.component";
import {FooterComponent} from "../footer/footer.component";
import {RouterLink} from "@angular/router";
import {UtilisateurService} from "../utilisateur.service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [
    NavComponent,
    FooterComponent,
    RouterLink,
    FormsModule
  ],
  templateUrl: './inscription.component.html',
  styleUrl: './inscription.component.css'
})
export class InscriptionComponent {

  prenom: any;
  nom: any;
  email: any;
  password: any;
  phone: any;

  constructor(private utilisateurService: UtilisateurService) {}

  inscription() {

    this.utilisateurService.inscription(this.nom, this.prenom, this.email, this.phone, this.password);

  }

}
