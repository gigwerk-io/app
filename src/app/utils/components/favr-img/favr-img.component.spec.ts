import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FavrImgComponent } from './favr-img.component';

describe('FavrImgComponent', () => {
  let component: FavrImgComponent;
  let fixture: ComponentFixture<FavrImgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavrImgComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FavrImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
