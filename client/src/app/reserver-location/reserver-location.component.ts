import { Component } from '@angular/core';
import {NavComponent} from "../nav/nav.component";
import {FooterComponent} from "../footer/footer.component";

@Component({
  selector: 'app-reserver-location',
  standalone: true,
  imports: [
    NavComponent,
    FooterComponent
  ],
  templateUrl: './reserver-location.component.html',
  styleUrl: './reserver-location.component.css'
})
export class ReserverLocationComponent {

}
