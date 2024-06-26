import {Component, OnInit} from '@angular/core';
import {BiensService} from "../biens.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {NavComponent} from "../nav/nav.component";
import {FooterComponent} from "../footer/footer.component";
import {JsonPipe, NgIf} from "@angular/common";
import {UtilisateurService} from "../utilisateur.service";

@Component({
  selector: 'app-fiche-annonce',
  standalone: true,
  imports: [
    NavComponent,
    FooterComponent,
    JsonPipe,
    RouterLink,
    NgIf
  ],
  templateUrl: './fiche-annonce.component.html',
  styleUrl: './fiche-annonce.component.css'
})
export class FicheAnnonceComponent implements OnInit {

  locationId: string | null | undefined;
  locationData: any;
  userData: any;
  avis: any;
  isLogged: boolean | undefined;

  constructor(
    private route: ActivatedRoute,
    private biensService: BiensService,
    private utilisateurService: UtilisateurService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.locationId = params.get('id');
      if (this.locationId) {
        this.loadLocationDetails(this.locationId);
      }
    });

    this.utilisateurService.isLogedIn().subscribe({
      next: (response) => {
        console.log(response);
        this.isLogged = response;
      }
    });

  }

  private loadLocationDetails(id: string) {
    this.biensService.getBien(id).subscribe(
      data => {
        this.locationData = data;
        this.loadUserData(this.locationData.mailProprio)
        this.loadAvisBien(this.locationData.idBien)
      },
      error => {
        console.error('Erreur lors de la récupération des détails de la location', error);
      }
    );
  }

  private loadUserData(mail: string) {
    this.biensService.getUserByMail(mail).subscribe(
      data => {
        this.userData = data;
      },
      error => {
        console.error('Erreur lors de la récupération des détails de l\'utilisateur', error);
      }
    );
  }

  private loadAvisBien(id: string) {
    this.biensService.getAvisBienById(id).subscribe(
      data => {
        this.avis = data;
      },
      error => {
        console.error('Erreur lors de la récupération des avis de la location', error);
      }
    );
  }



}
