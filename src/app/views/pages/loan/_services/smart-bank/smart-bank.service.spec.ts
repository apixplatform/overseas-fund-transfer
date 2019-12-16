import { TestBed } from '@angular/core/testing';

import { SmartBankService } from './smart-bank.service';

describe('SmartBankService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SmartBankService = TestBed.get(SmartBankService);
    expect(service).toBeTruthy();
  });
});
