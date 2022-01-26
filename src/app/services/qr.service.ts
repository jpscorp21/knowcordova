import { Injectable } from '@angular/core';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { ToastService } from './shared/toast.service';

@Injectable({providedIn: 'root'})
export class QRService {

    constructor(
        private readonly barcodeScanner: BarcodeScanner,
        private readonly toast: ToastService
    ) { }

    openQrScanner() {
         
        return this.barcodeScanner.scan().then(text => {            
            console.log('Barcode data', text);
            console.log(text);
            return text;
           }).catch(err => {               
               console.log('Error', err);
               this.toast.create('No se puede realizar el escaneo')
           });      
      }
    
}