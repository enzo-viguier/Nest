import { Component } from '@angular/core';
import {NavComponent} from "../nav/nav.component";
import {FooterComponent} from "../footer/footer.component";
import { LocationService } from '../location.service';
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from '@angular/router';
import { UtilisateurService } from '../utilisateur.service';


@Component({
  selector: 'app-reserver-location',
  standalone: true,
  imports: [
    FormsModule,
    NavComponent,
    FooterComponent
  ],
  templateUrl: './reserver-location.component.html',
  styleUrl: './reserver-location.component.css'
})
export class ReserverLocationComponent {

  bienId: string | null | undefined;
  startDate: string | null | undefined;
  endDate: string | null | undefined;
  userMail: string | null | undefined;

  constructor(
    private utilisateurService: UtilisateurService,
    private locationService: LocationService,
    private route: ActivatedRoute  // Inject ActivatedRoute here

  ) {}

  onSubmit() {
      let formattedStartDate: string | null = null;
      let formattedEndDate: string | null = null;

      if (this.startDate && this.endDate) { // Ensure both dates are neither null nor undefined
          formattedStartDate = this.formatDate(this.startDate);
          formattedEndDate = this.formatDate(this.endDate);
          // Now you can safely use formattedStartDate and formattedEndDate
      } else {
          console.error('Start date or end date is missing!');
          return;
      }
    const reservation = {
        idBien: this.bienId,
        mailLoueur: this.userMail,

        dateDébut: formattedStartDate,
      dateFin: formattedEndDate,
      avis: null
    };
      console.log('Reservation:', reservation);

      this.locationService.addLocation(reservation).subscribe({
      next: (response) => console.log('Reservation added', response),
      error: (err) => console.error('Error adding reservation', err)
    });
  }

  ngOnInit() {
      const token = this.utilisateurService.getToken();
      console.log('Token:', token);
      if (token) {
          this.utilisateurService.infoToken(token).subscribe({
              next: (response: any) => {
                  // Assuming the response has a userId property
                  this.userMail = response.mail;
              },
              error: (error) => {
                  console.error('Error retrieving user information', error);
              }
          });
      }

      this.route.paramMap.subscribe(params => {
      this.bienId = params.get('id');  // Accessing the idLocation from the URL
    });
  }

    private formatDate(date: string): string {
        const parts = date.split('-');
        return parts[2] + parts[1] + parts[0]; // Assuming input format is DD-MM-YYYY
    }
}
