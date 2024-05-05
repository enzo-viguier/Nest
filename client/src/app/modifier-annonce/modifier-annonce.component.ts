import { Component } from '@angular/core';
import {NavComponent} from "../nav/nav.component";
import {FooterComponent} from "../footer/footer.component";
import {Router, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {BiensService} from "../biens.service";
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
  templateUrl: './modifier-annonce.component.html',
  styleUrl: './modifier-annonce.component.css'
})
export class ModifierAnnonceComponent {

  bienId: any;
  annonceForm = new FormGroup({
    commune: new FormControl(''),
    rue: new FormControl(''),
    cp: new FormControl(''),
    nbCouchages: new FormControl(''),
    nbChambres: new FormControl(''),
    distance: new FormControl(''),
    prix: new FormControl('')
  });


  constructor(
    private route: ActivatedRoute,
    private biensService: BiensService,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz :");

    this.route.paramMap.subscribe(params => {
      this.bienId = params.get('id');
      if (this.bienId) {
        this.loadBien(this.bienId);
      }
    });
  }

  loadBien(id: string): void {
    this.biensService.getBien(id).subscribe(data  => {
      console.log("annonce :",data);
      this.annonceForm.patchValue({
        commune: data.commune || '',
        rue: data.rue || '',
        cp: data.cp || '',
        nbCouchages: data.nbCouchages || 0,
        nbChambres: data.nbChambres || 0,
        distance: data.distance || 0,
        prix: data.prix || 0
      });
    });
  }

  updateBien(): void {
    if (this.annonceForm.valid) {
      this.biensService.updateBien(this.bienId, this.annonceForm.value).subscribe({
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
}
