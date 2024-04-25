import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  searchForm = new FormGroup({
    destination: new FormControl(''),
    arrival: new FormControl(''),
    departure: new FormControl(''),
    travelers: new FormControl('')
  });

  onSubmit() {
    console.log(this.searchForm.value);
  }
}
