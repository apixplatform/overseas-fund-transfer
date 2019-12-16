import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendOtpComponent } from './send-otp.component';

describe('SendOtpComponent', () => {
  let component: SendOtpComponent;
  let fixture: ComponentFixture<SendOtpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendOtpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
