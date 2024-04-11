import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeAnnonceComponent } from './liste-annonce.component';

describe('ListeAnnonceComponent', () => {
  let component: ListeAnnonceComponent;
  let fixture: ComponentFixture<ListeAnnonceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeAnnonceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListeAnnonceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
