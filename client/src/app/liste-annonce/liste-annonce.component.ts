import {Component, OnInit} from '@angular/core';
import { BiensService } from "../biens.service";
import { HttpClientModule } from "@angular/common/http";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {JsonPipe} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-liste-annonce',
  standalone: true,
  imports: [HttpClientModule, JsonPipe, RouterLink],
  templateUrl: './liste-annonce.component.html',
  styleUrl: './liste-annonce.component.css'
})
export class ListeAnnonceComponent implements OnInit {

  biens: any[] = []

  constructor(private biensService: BiensService) {}

  ngOnInit(): void {
    this.biensService.getBiens().subscribe({
      next: (biens) => {
        this.biens = biens; // Assuming 'biens' is an array of properties

        // Iterate over each property to fetch its reviews
        this.biens.forEach(bien => {

          this.biensService.getAvisBienById(bien.idBien).subscribe({
            next: (avis) => {
              bien.avis = avis; // Assign avis to each bien
            },
            error: (error) => {
              console.error("Erreur lors de la récupération des avis pour bien ID:", bien.idBien, error);
              bien.avis = []; // Assign empty array on error
            }
          });

          this.biensService.getUserByIdBien(bien.idBien).subscribe({
            next: (user) => {
              bien.user = user;
            },
            error: (error) => {
              console.log("Erreur lors de la récupération de l'utilisateur d'un bien", bien.idBien, error);
              bien.user = [];
            }
          })

        });
      },
      error: (error) => {
        console.error("Erreur lors de la récupération des biens:", error);
        this.biens = []; // Set biens to an empty array on error
      }
    });
  }
}
