import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreeAnnonceComponent } from './cree-annonce.component';

describe('CreeAnnonceComponent', () => {
  let component: CreeAnnonceComponent;
  let fixture: ComponentFixture<CreeAnnonceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreeAnnonceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreeAnnonceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
