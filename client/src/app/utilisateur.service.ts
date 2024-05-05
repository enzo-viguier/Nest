import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import { CookieService } from 'ngx-cookie-service';
import {BehaviorSubject} from "rxjs";

export interface ApiResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  private loggedIn: BehaviorSubject<boolean>
  private token: string | undefined;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) {
    this.loggedIn = new BehaviorSubject(cookieService.check('nest'));
  }

  inscription(nom: string, prenom: string, mail: string, téléphone: string, password: string) {
    console.log("Inscription de l'utilisateur avec le nom " + nom + ", le prénom " + prenom + ", le mail " + mail + " et le mot de passe " + password);
    return this.http.post<ApiResponse>('http://localhost:8888/utilisateurs/ajouter', {mail: mail, prénom: prenom, nom: nom, téléphone: téléphone, motDePasse: password})
      .subscribe({
        next: (response) => {
          // Si l'inscription est réussie
          if (response) {
            this.router.navigate(['/connexion']);  // Rediriger vers la page de connexion
          } else {
            console.log("ERROR INSCRIPTION")
            this.router.navigate(['/inscription']);  // Rediriger vers la page d'inscription en cas d'échec
          }
        },
        error: (error) => {
          console.error('Erreur lors de l\'inscription', error);
          this.router.navigate(['/inscription']);  // Rediriger vers la page d'inscription en cas d'erreur
        }
      });
  }

  connexion(mail: string, password: string) {
    console.log("Connexion de l'utilisateur avec le mail " + mail + " et le mot de passe " + password);
    return this.http.post<ApiResponse>('http://localhost:8888/connexion', {mail: mail, motDePasse: password})
      .subscribe({
        next: (response ) => {
          // Si la connexion est réussie
          if (response) {

            let token = JSON.parse(JSON.stringify(response.token));

            this.token = token;

            this.setSession(token);

            this.getToken();

            this.router.navigate(['/compte']);  // Rediriger vers la page compte

          } else {
            console.log("ERROR CONNEXION")
            this.router.navigate(['/connexion']);  // Rediriger vers la page de connexion en cas d'échec
          }
        },
        error: (error) => {
          console.error('Erreur lors de la connexion', error);
          this.router.navigate(['/connexion']);  // Rediriger vers la page de connexion en cas d'erreur
        }
      });

  }

  deconnexion() {
    this.cookieService.delete('nest');
    this.loggedIn.next(false);
  }

  private setSession(token: string) {
    this.cookieService.set('nest', token);
    this.loggedIn.next(true);
  }

  infoToken(token: string) {
    return  this.http.post("http://localhost:8888/token", {token: token});
  }

   isLogedIn() {
    return this.loggedIn;
  }

  getToken() {
    this.cookieService.check('nest') ? this.token = this.cookieService.get('nest') : this.token = undefined;
    return this.token;
  }

}
