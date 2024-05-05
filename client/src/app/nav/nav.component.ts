import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {UtilisateurService} from "../utilisateur.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    RouterLink,
    NgIf
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {

  isLogged: boolean = false;

  constructor(private utilisateurService: UtilisateurService) { }

  ngOnInit() {

    this.utilisateurService.isLogedIn().subscribe({
      next: (response) => {
        console.log(response);
        this.isLogged = response;
      }
    });

  }

  logout() {
    this.utilisateurService.deconnexion();
  }

}
