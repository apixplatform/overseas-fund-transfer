import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversionWidgetComponent } from './conversion-widget.component';

describe('ConversionWidgetComponent', () => {
  let component: ConversionWidgetComponent;
  let fixture: ComponentFixture<ConversionWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversionWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversionWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
