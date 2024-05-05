import { Component } from '@angular/core';
import {NavComponent} from "../nav/nav.component";
import {FooterComponent} from "../footer/footer.component";
import {Router, RouterLink} from "@angular/router";
import {UtilisateurService} from "../utilisateur.service";

@Component({
  selector: 'app-compte',
  standalone: true,
  imports: [
    NavComponent,
    FooterComponent,
    RouterLink
  ],
  templateUrl: './compte.component.html',
  styleUrl: './compte.component.css'
})
export class CompteComponent {

  utilisateur: any;

  constructor(
    private utilisateurService: UtilisateurService,
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

}
