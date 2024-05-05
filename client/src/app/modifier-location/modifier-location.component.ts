import { Component } from '@angular/core';
import {NavComponent} from "../nav/nav.component";
import {FooterComponent} from "../footer/footer.component";
import {Router, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {LocationService} from "../location.service";
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-cree-annonce',
  standalone: true,
  imports: [
    NavComponent,
    FooterComponent,
    RouterLink,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './modifier-location.component.html',
  styleUrl: './modifier-location.component.css'
})
export class ModifierLocationComponent {

  idLocation: any;
  annonceForm = new FormGroup({
    dateDébut: new FormControl(''),
    dateFin: new FormControl(''),
    avis: new FormControl(''),
  });


  constructor(
    private route: ActivatedRoute,
    private locationService: LocationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.idLocation = params.get('id');
      if (this.idLocation) {
        this.loadLocation(this.idLocation);
      }
    });
  }

  loadLocation(id: string): void {

    this.locationService.getLocationById(id).subscribe(data  => {
      console.log("annonce :",data);
      this.annonceForm.patchValue({
          dateDébut: data.dateDébut ? this.unformatDate(data.dateDébut) : '',
          dateFin: data.dateFin ? this.unformatDate(data.dateFin) : '',
          avis: data.avis || 0
      });
    });
  }

  updateLocation(): void {
    if (this.annonceForm.valid) {
        const formValue = {
            ...this.annonceForm.value,
            dateDébut: this.formatDate(this.annonceForm.value.dateDébut),
            dateFin: this.formatDate(this.annonceForm.value.dateFin),
            avis : this.annonceForm.value.avis
        }
      this.locationService.updateLocationById(this.idLocation, formValue).subscribe({
        next: (response) => {
          console.log('Annonce updated successfully:', response);
          this.router.navigate(['/compte']);
        },
        error: (error) => {
          console.error('Failed to update annonce:', error);
        }
      });
    }
  }

    private formatDate(date: string | null | undefined): string {
        if (!date) return '';
        const parts = date.split('-');
        return parts[0] + parts[1] + parts[2];
    }

    private unformatDate(date: string | null | undefined): string {
        if (!date) return '';
        if (date.length === 8) {
            const year = date.substring(0, 4);
            const month = date.substring(4, 6);
            const day = date.substring(6, 8);
            return `${year}-${month}-${day}`;
        } else {
            throw new Error("Invalid date format");
        }
    }
}
