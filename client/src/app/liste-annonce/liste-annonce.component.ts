import {Component, OnInit} from '@angular/core';
import { BiensService } from "../biens.service";
import { HttpClientModule } from "@angular/common/http";
import {error} from "@angular/compiler-cli/src/transformers/util";

@Component({
  selector: 'app-liste-annonce',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './liste-annonce.component.html',
  styleUrl: './liste-annonce.component.css'
})
export class ListeAnnonceComponent implements OnInit {

  biens: any[] = []

  constructor(private biensService: BiensService) {}

  ngOnInit(): void {

    this.biensService.getBiens().subscribe({
      next: (data) => {
        this.biens = data;
      },
      error: (error) => {
        console.log("Erreur lors de la récupération des biens:", error)
      }
    })

  }

}
