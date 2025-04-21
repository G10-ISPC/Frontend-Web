import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmountAdjusterComponent } from './amount-adjuster.component';

describe('AmountAdjusterComponent', () => {
  let component: AmountAdjusterComponent;
  let fixture: ComponentFixture<AmountAdjusterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmountAdjusterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AmountAdjusterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});