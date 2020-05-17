import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavrInputComponent } from './favr-input.component';

describe('FavrInputComponent', () => {
  let component: FavrInputComponent;
  let fixture: ComponentFixture<FavrInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavrInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavrInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
