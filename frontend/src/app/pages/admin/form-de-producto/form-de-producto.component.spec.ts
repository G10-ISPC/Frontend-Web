import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDeProductoComponent } from './form-de-producto.component';

describe('FormDeProductoComponent', () => {
  let component: FormDeProductoComponent;
  let fixture: ComponentFixture<FormDeProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormDeProductoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormDeProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
