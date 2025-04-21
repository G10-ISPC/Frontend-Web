import { TestBed } from '@angular/core/testing';

import { CompraGralService } from './compra-gral.service';

describe('CompraGralService', () => {
  let service: CompraGralService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompraGralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
