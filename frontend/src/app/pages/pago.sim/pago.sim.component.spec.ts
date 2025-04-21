import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoSimComponent } from './pago.sim.component';

describe('PagoSimComponent', () => {
  let component: PagoSimComponent;
  let fixture: ComponentFixture<PagoSimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagoSimComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PagoSimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
