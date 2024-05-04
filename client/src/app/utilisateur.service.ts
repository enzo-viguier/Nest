import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Router} from "@angular/router";

export interface ApiResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  connexion(mail: string, password: string) {
    console.log("Connexion de l'utilisateur avec le mail " + mail + " et le mot de passe " + password);
    return this.http.post<ApiResponse>('http://localhost:8888/connexion', {mail: mail, motDePasse: password})
      .subscribe({
        next: (response ) => {
          // Si la connexion est réussie
          if (response && response.message === "Authentification réussie") {
            console.log("RESPONSE : " + response)
            this.router.navigate(['/compte']);  // Rediriger vers la page compte
          } else {
            console.log("ERROR CONNEXION : " + response.message)
            // this.router.navigate(['/connexion']);  // Rediriger vers la page de connexion en cas d'échec
          }
        },
        error: (error) => {
          console.error('Erreur lors de la connexion', error);
          this.router.navigate(['/connexion']);  // Rediriger vers la page de connexion en cas d'erreur
        }
      });

  }

}
