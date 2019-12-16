import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferStatusComponent } from './transfer-status.component';

describe('TransferStatusComponent', () => {
  let component: TransferStatusComponent;
  let fixture: ComponentFixture<TransferStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
