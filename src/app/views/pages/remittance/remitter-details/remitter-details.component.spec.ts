import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemitterDetailsComponent } from './remitter-details.component';

describe('RemitterDetailsComponent', () => {
  let component: RemitterDetailsComponent;
  let fixture: ComponentFixture<RemitterDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemitterDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemitterDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
