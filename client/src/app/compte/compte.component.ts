import { Component } from '@angular/core';
import {NavComponent} from "../nav/nav.component";
import {FooterComponent} from "../footer/footer.component";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-compte',
  standalone: true,
  imports: [
    NavComponent,
    FooterComponent,
    RouterLink
  ],
  templateUrl: './compte.component.html',
  styleUrl: './compte.component.css'
})
export class CompteComponent {

}
