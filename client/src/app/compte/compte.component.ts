import { Component } from '@angular/core';
import {NavComponent} from "../nav/nav.component";
import {FooterComponent} from "../footer/footer.component";

@Component({
  selector: 'app-compte',
  standalone: true,
  imports: [
    NavComponent,
    FooterComponent
  ],
  templateUrl: './compte.component.html',
  styleUrl: './compte.component.css'
})
export class CompteComponent {

}
