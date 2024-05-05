import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavComponent } from "../nav/nav.component";
import { FooterComponent } from "../footer/footer.component";
import { UtilisateurService } from "../utilisateur.service";
import { LocationService } from "../location.service";
import { BiensService } from "../biens.service";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-compte',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    NavComponent,
    FooterComponent
  ],
  templateUrl: './compte.component.html',
  styleUrls: ['./compte.component.css']
})
export class CompteComponent implements OnInit {

  utilisateur: any;
  biens: any[] = [];
  locations: any[] = [];

  constructor(
      private utilisateurService: UtilisateurService,
      private biensService: BiensService,
      private locationService: LocationService,
      private router: Router
  ) {}

  ngOnInit() {
    this.verifyUserLoggedIn();
  }

  verifyUserLoggedIn() {
    this.utilisateurService.isLogedIn().subscribe({
      next: (isLoggedIn) => {
        if (isLoggedIn) {
          this.fetchUserInfo();
        } else {
          console.log("Utilisateur non connecté");
          this.router.navigate(['/connexion']);
        }
      },
      error: (err) => console.error("Erreur lors de la vérification du login", err)
    });
  }

  fetchUserInfo() {
    const token = this.utilisateurService.getToken();
    if (token) {
      this.utilisateurService.infoToken(token).subscribe({
        next: (userInfo) => {
          this.utilisateur = userInfo;
          this.fetchLocations();
          this.fetchBiensByProprio();
        },
        error: (err) => {
          console.error("Erreur lors de la récupération des informations utilisateur", err);

          this.router.navigate(['/connexion']);
        }
      });
    } else {
      console.error("Token non trouvé");
      this.router.navigate(['/connexion']);
    }
  }

  fetchLocations() {
    if (!this.utilisateur || !this.utilisateur.mail) {
      return;
    }

    this.locationService.getLocationsByLocataireId(this.utilisateur.mail).subscribe({
      next: (locations) => {
        this.locations = locations;
        this.locations.forEach(location => {
          this.fetchBienDetails(location);
        });
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des locations", err);
        this.locations = [];
      }
    });
  }

  fetchBiensByProprio() {
    if (!this.utilisateur || !this.utilisateur.mail) {
      return;
    }

    this.biensService.getBiensByProprio(this.utilisateur.mail).subscribe({
      next: (biens) => {
        this.biens = biens;
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des biens", err);
        this.biens = [];
      }
    });
  }

  fetchBienDetails(location : any) {
    this.biensService.getBien(location.idBien).subscribe({
      next: (bien) => {
        location.bienDetails = bien;
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des détails du bien", err);
      }
    });
  }

  deleteBien(bienId: string) {
    if (confirm('Êtes vous sur de vouloir supprimer ce bien ?')) {
      this.biensService.deleteBien(bienId).subscribe(() => {
        this.verifyUserLoggedIn();
      });
    }
  }

  deleteLocation(locationId: string) {
    if (confirm('Êtes vous sur de vouloir supprimer cette location ?')) {
      this.locationService.deleteLocationById(locationId).subscribe(() => {
        this.verifyUserLoggedIn();
      });
    }
  }
}
