import { TestBed } from '@angular/core/testing';

import { ErrorePopService } from './errore-pop-service';

describe('ErrorePopService', () => {
  let service: ErrorePopService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorePopService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
