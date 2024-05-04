import { Component } from '@angular/core';
import {NavComponent} from "../nav/nav.component";
import {FooterComponent} from "../footer/footer.component";
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {UtilisateurService} from "../utilisateur.service";

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [NavComponent, FooterComponent, FormsModule],
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.css'

})
export class ConnexionComponent {

  email: any;
  password: any;

  constructor(
    private router: Router,
    private utilisateurService: UtilisateurService
  ) { }

  connexion() {
    console.log("Connexion de l'utilisateur avec le mail " + this.email + " et le mot de passe " + this.password);

    this.utilisateurService.connexion(this.email, this.password);

    // this.router.navigate(['/']);
  }

}
