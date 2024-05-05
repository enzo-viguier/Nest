import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierLocationComponent } from './modifier-location.component';

describe('ModifierLocationComponent', () => {
  let component: ModifierLocationComponent;
  let fixture: ComponentFixture<ModifierLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifierLocationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifierLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
