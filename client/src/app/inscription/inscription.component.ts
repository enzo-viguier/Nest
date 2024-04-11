import { Component } from '@angular/core';
import {NavComponent} from "../nav/nav.component";
import {FooterComponent} from "../footer/footer.component";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [
    NavComponent,
    FooterComponent,
    RouterLink
  ],
  templateUrl: './inscription.component.html',
  styleUrl: './inscription.component.css'
})
export class InscriptionComponent {

}
