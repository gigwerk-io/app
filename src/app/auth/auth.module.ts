import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {IonicStorageModule} from '@ionic/storage';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    IonicStorageModule.forRoot()
  ]
})
export class AuthModule { }
