import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class QRSampleService {
    constructor() { }
    
    openQrScanner() {
        return new Promise((resolve) => resolve({
            cancelled: false,
            format: "QR_CODE",
            text: "http://knownfc.com/profile/3648151.1"
        }))
    }
}