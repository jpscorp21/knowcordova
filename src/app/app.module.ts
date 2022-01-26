import { NgModule } from '@angular/core';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { SortablejsModule} from 'ngx-sortablejs';
import { IonicStorageModule} from '@ionic/storage-angular';
import { Drivers} from '@ionic/storage';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { SwiperModule} from "swiper/angular";
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { Ndef, NFC, NfcUtil } from '@awesome-cordova-plugins/nfc/ngx';
import {SelectiveLoadingStrategy} from './selective-loading-strategy';
import { CallNumber } from "@awesome-cordova-plugins/call-number/ngx";
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import {ImageCropperModule} from 'ngx-image-cropper';
import {TarjetaAmigoConectarModalModule} from "./components/tarjeta-amigo-conectar-modal/tarjeta-amigo-conectar-modal.module";
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { Deeplinks } from '@awesome-cordova-plugins/deeplinks/ngx';
import { Camera } from '@awesome-cordova-plugins/camera/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { Keyboard } from '@awesome-cordova-plugins/keyboard/ngx';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { BackgroundMode } from '@awesome-cordova-plugins/background-mode/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    HammerModule,
    SortablejsModule.forRoot({animation: 150}),
    IonicStorageModule.forRoot({
      name: 'knowdb',
      driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
    }),
    HttpClientModule,
    ReactiveFormsModule,
    SwiperModule,
    NgxQRCodeModule,
    TarjetaAmigoConectarModalModule,
    ImageCropperModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    SelectiveLoadingStrategy,
    AndroidPermissions,
    StatusBar,
    SplashScreen,
    NFC,
    NfcUtil,
    Camera,
    Keyboard,
    CallNumber,
    Deeplinks,
    BarcodeScanner,
    InAppBrowser,
    BackgroundMode,
    Ndef,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
