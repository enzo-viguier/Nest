import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FicheAnnonceComponent } from './fiche-annonce.component';

describe('FicheAnnonceComponent', () => {
  let component: FicheAnnonceComponent;
  let fixture: ComponentFixture<FicheAnnonceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FicheAnnonceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FicheAnnonceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
