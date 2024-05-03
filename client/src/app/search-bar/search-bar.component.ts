import {Component, EventEmitter, Output} from '@angular/core';
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
  @Output() onSearch = new EventEmitter<any>();

  searchForm = new FormGroup({
    commune: new FormControl(''),
    dateDébut: new FormControl(''),
    dateFin: new FormControl(''),
    nbCouchages: new FormControl(''),
    prix: new FormControl(''),
    nbChambres: new FormControl(''),
    distance: new FormControl(''),

  });

  onSubmit() {
    this.onSearch.emit(this.searchForm.value);
  }
}
