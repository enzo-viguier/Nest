import { Component } from '@angular/core';
import {NavComponent} from "../nav/nav.component";
import {FooterComponent} from "../footer/footer.component";

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [
    NavComponent,
    FooterComponent
  ],
  templateUrl: './inscription.component.html',
  styleUrl: './inscription.component.css'
})
export class InscriptionComponent {

}
