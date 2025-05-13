import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialdecomprasComponent } from './historialdecompras.component';

describe('HistorialdecomprasComponent', () => {
  let component: HistorialdecomprasComponent;
  let fixture: ComponentFixture<HistorialdecomprasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialdecomprasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistorialdecomprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
