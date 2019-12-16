import { TestBed } from '@angular/core/testing';

import { ApixService } from './apix.service';

describe('ApixService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApixService = TestBed.get(ApixService);
    expect(service).toBeTruthy();
  });
});
