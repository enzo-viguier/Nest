import {Component, OnInit} from '@angular/core';
import {BiensService} from "../biens.service";
import {ActivatedRoute} from "@angular/router";
import {NavComponent} from "../nav/nav.component";
import {FooterComponent} from "../footer/footer.component";
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-fiche-annonce',
  standalone: true,
  imports: [
    NavComponent,
    FooterComponent,
    JsonPipe
  ],
  templateUrl: './fiche-annonce.component.html',
  styleUrl: './fiche-annonce.component.css'
})
export class FicheAnnonceComponent implements OnInit {

  locationId: string | null | undefined;
  locationData: any;
  userData: any;

  constructor(
    private route: ActivatedRoute,
    private biensService: BiensService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.locationId = params.get('id');
      if (this.locationId) {
        this.loadLocationDetails(this.locationId);
      }
    });

  }

  private loadLocationDetails(id: string) {
    this.biensService.getBien(id).subscribe(
      data => {
        this.locationData = data;
        this.loadUserData(this.locationData.mailProprio)
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

}
