import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nfc',
  templateUrl: './nfc.component.html',
  styleUrls: ['./nfc.component.scss'],
})
export class NfcComponent implements OnInit {

  sliderOpts = {
    allowSlidePrev: false,
    allowSlideNext: false,
  };

  constructor() { }

  ngOnInit() {}

}
