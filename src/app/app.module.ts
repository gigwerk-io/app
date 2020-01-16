import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import {AuthModule} from './auth/auth.module';
import {FormsModule, FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {PusherServiceProvider} from './providers/pusher.service';
import {MomentModule} from 'ngx-moment';
import {Stripe} from '@ionic-native/stripe/ngx';
import { CreditCardDirectivesModule } from 'angular-cc-library';
import { IntercomModule } from 'ng-intercom';
import { Push } from '@ionic-native/push/ngx';
import { Contacts} from '@ionic-native/contacts/ngx';
import { Badge } from '@ionic-native/badge/ngx';
import {Keyboard} from '@ionic-native/keyboard/ngx';
import { Angulartics2Module } from 'angulartics2';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {RequestPageModule} from './pages/request/request.module';
import {SearchPageModule} from './pages/search/search.module';
import {CustomerTutorialPageModule} from './pages/customer-tutorial/customer-tutorial.module';
import {MarketplacePageModule} from './pages/marketplace/marketplace.module';

@NgModule({
  imports: [
    AuthModule,
    AppRoutingModule,
    Angulartics2Module.forRoot(),
    BrowserModule,
    CustomerTutorialPageModule,
    CreditCardDirectivesModule,
    FormsModule,
    HttpClientModule,
    IonicModule.forRoot({
      mode: 'ios'
    }),
    IntercomModule.forRoot({
      appId: 'yvoar9nd', // from your Intercom config
      updateOnRouterChange: true // will automatically run `update` on router event changes. Default: `false`
    }),
    RequestPageModule,
    SearchPageModule,
    IonicStorageModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production
    }),
    MomentModule,
    MarketplacePageModule,
    ReactiveFormsModule
  ],
  declarations: [AppComponent],
  providers: [
    InAppBrowser,
    SplashScreen,
    StatusBar,
    PusherServiceProvider,
    Stripe,
    Push,
    FormBuilder,
    Contacts,
    Badge,
    Keyboard,
    SocialSharing,
    Geolocation
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
