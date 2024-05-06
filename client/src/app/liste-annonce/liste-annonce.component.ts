import {Component, OnInit} from '@angular/core';
import { BiensService } from "../biens.service";
import { HttpClientModule } from "@angular/common/http";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {JsonPipe} from "@angular/common";
import {RouterLink} from "@angular/router";
import {SearchBarComponent} from "../search-bar/search-bar.component";

@Component({
  selector: 'app-liste-annonce',
  standalone: true,
  imports: [HttpClientModule, JsonPipe, RouterLink, SearchBarComponent],
  templateUrl: './liste-annonce.component.html',
  styleUrl: './liste-annonce.component.css'
})
export class ListeAnnonceComponent implements OnInit {

  biens: any[] = [];
  listeImages: any;

  constructor(private biensService: BiensService) {}

  ngOnInit(): void {

    this.biensService.getListeImage().subscribe({
      next: (response: any) => {
        this.listeImages = response.images;
        this.fetchBiens();
      },
      error: (error) => {
        console.error("Erreur lors de la récupération des images", error);
        this.listeImages = [];
      }
    });

    this.biensService.getBiens().subscribe({
      next: (biens) => {
        this.biens = biens;
        this.addProperties(this.biens);
      },
      error: (error) => {
        console.error("Erreur lors de la récupération des biens:", error);
        this.biens = []; // Set biens to an empty array on error
      }
    });

  }

  private addProperties(biens: any[]): void {
    biens.forEach(bien => {

      this.biensService.getAvisBienById(bien.idBien).subscribe({
        next: (avis) => {
          bien.avis = avis;
        },
        error: (error) => {
          console.error("Erreur lors de la récupération des avis pour bien ID:", bien.idBien, error);
          bien.avis = [];
        }
      });

      this.biensService.getUserByIdBien(bien.idBien).subscribe({
        next: (user) => {
          bien.user = user;
        },
        error: (error) => {
          console.error("Erreur lors de la récupération de l'utilisateur d'un bien", bien.idBien, error);
          bien.user = {};
        }
      });

    });
  }

  onFiltersChange(filters: any) {
    this.biensService.getBiensFiltered(filters).subscribe(
      biens => {
        this.biens = biens;
        this.addProperties(this.biens);
        this.assignImagesToBiens();
      },
      error => console.error('Error fetching filtered biens:', error)
    );
  }

  private fetchBiens(): void {
    this.biensService.getBiens().subscribe({
      next: (biens) => {
        this.biens = biens;
        this.addProperties(this.biens);
        this.assignImagesToBiens();
      },
      error: (error) => {
        console.error("Erreur lors de la récupération des biens:", error);
        this.biens = []; // Set biens to an empty array on error
      }
    });
  }

  private assignImagesToBiens(): void {
    if (this.biens.length && this.listeImages.length) {
      this.biens.forEach((bien, index) => {
        // Assigner une image de manière cyclique
        bien.image = this.listeImages[index % this.listeImages.length];
      });
    }
  }

}
