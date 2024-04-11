import { Component } from '@angular/core';
import {NavComponent} from "../nav/nav.component";
import {FooterComponent} from "../footer/footer.component";

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [NavComponent, FooterComponent],
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.css'
})
export class ConnexionComponent {

}
