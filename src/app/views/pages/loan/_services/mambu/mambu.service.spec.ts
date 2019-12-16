import { TestBed } from '@angular/core/testing';

import { MambuService } from './mambu.service';

describe('MambuService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MambuService = TestBed.get(MambuService);
    expect(service).toBeTruthy();
  });
});
