import { TestBed } from '@angular/core/testing';

import { GlobalErrorHandelingService } from './global-error-handeling.service';

describe('GlobalErrorHandelingService', () => {
  let service: GlobalErrorHandelingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalErrorHandelingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
