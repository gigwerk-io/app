import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SignupPage } from './signup';
import { SignupPageRoutingModule } from './signup-routing.module';
import {CommonComponentsModule} from '../../utils/components/common-components.module';
import {PhonePipe} from '../../utils/pipes/phone.pipe';

@NgModule({
  imports: [
    CommonComponentsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    SignupPageRoutingModule
  ],
  declarations: [
    SignupPage,
    PhonePipe
  ],
  providers: [
    PhonePipe
  ]
})
export class SignUpModule { }
