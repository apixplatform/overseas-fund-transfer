import { TestBed } from '@angular/core/testing';

import { EmailVerificationService } from './email-verification.service';

describe('EmailVerificationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EmailVerificationService = TestBed.get(
      EmailVerificationService
    );
    expect(service).toBeTruthy();
  });
});
