import { Component } from '@angular/core';
import {NavComponent} from "../nav/nav.component";
import {FooterComponent} from "../footer/footer.component";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-cree-annonce',
  standalone: true,
  imports: [
    NavComponent,
    FooterComponent,
    RouterLink
  ],
  templateUrl: './cree-annonce.component.html',
  styleUrl: './cree-annonce.component.css'
})
export class CreeAnnonceComponent {

}
