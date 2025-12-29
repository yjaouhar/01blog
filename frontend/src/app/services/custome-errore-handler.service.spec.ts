import { TestBed } from '@angular/core/testing';

import { CustomeErroreHandlerService } from './custome-errore-handler.service';

describe('CustomeErroreHandlerService', () => {
  let service: CustomeErroreHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomeErroreHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
