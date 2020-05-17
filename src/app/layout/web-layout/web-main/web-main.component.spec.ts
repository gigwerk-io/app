import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WebMainComponent } from './web-main.component';

describe('WebMainComponent', () => {
  let component: WebMainComponent;
  let fixture: ComponentFixture<WebMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebMainComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WebMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
