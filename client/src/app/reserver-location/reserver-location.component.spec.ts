import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReserverLocationComponent } from './reserver-location.component';

describe('ReserverLocationComponent', () => {
  let component: ReserverLocationComponent;
  let fixture: ComponentFixture<ReserverLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReserverLocationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReserverLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
