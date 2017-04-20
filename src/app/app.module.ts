import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { CompCore } from '../components/core';
import { PickupPubSubService } from '../providers/core'

declare var google;
@NgModule({
  declarations: [
    MyApp, HomePage, CompCore,// MapComponent, PickupComponent, AvailableCarsComponent, PickupCarComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, PickupPubSubService]
})
export class AppModule { }
