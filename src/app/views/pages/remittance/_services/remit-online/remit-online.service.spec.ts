import { TestBed } from '@angular/core/testing';

import { RemitOnlineService } from './remit-online.service';

describe('RemitOnlineService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RemitOnlineService = TestBed.get(RemitOnlineService);
    expect(service).toBeTruthy();
  });
});
