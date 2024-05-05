import { Component } from '@angular/core';
import {NavComponent} from "../nav/nav.component";
import {FooterComponent} from "../footer/footer.component";
import {Router, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {UtilisateurService} from "../utilisateur.service";
import {BiensService} from "../biens.service";

@Component({
  selector: 'app-cree-annonce',
  standalone: true,
  imports: [
    NavComponent,
    FooterComponent,
    RouterLink,
    FormsModule
  ],
  templateUrl: './cree-annonce.component.html',
  styleUrl: './cree-annonce.component.css'
})
export class CreeAnnonceComponent {

  commune: any;
  rue: any;
  cp: any;
  nbCouchage: any;
  nbChambre: any;
  distance: any;
  prix: any;
  utilisateur: any;


  constructor(
    private utilisateurService: UtilisateurService,
    private biensService: BiensService,
    private router: Router
  ) { }

  ngOnInit() {
    this.utilisateurService.isLogedIn().subscribe({
      next: (response) => {
        console.log(response);
        this.utilisateur = response;

        if (!response) {
          console.log("Utilisateur non connecté");
          this.router.navigate(['/connexion']);
        }
        else {
          let token = this.utilisateurService.getToken();

          console.log("Token : " + token);

          if (token != null || token != undefined) {

            this.utilisateur = this.utilisateurService.infoToken(token).subscribe({
              next: (response) => {
                this.utilisateur = response;
                console.log(this.utilisateur);
              }
            });
          }

        }

      }
    });
  }

  creeBien() {

    console.log("Affichage des informations saisies : ");
    console.log("Commune : " + this.commune);
    console.log("Rue : " + this.rue);
    console.log("Code postal : " + this.cp);
    console.log("Nombre de couchage : " + this.nbCouchage);
    console.log("Nombre de chambre : " + this.nbChambre);
    console.log("Distance : " + this.distance);
    console.log("Prix : " + this.prix);
    console.log("--------------------------------------");
    console.log("Utilisateur : ");
    console.log(this.utilisateur);

    this.biensService.addBien(this.utilisateur.mail, this.commune, this.rue, this.cp, this.nbCouchage, this.nbChambre, this.distance, this.prix).subscribe({
      next: (response) => {
        console.log(response);
        this.router.navigate(['/location/', response.idBien]);
      }
    });
  }

}
