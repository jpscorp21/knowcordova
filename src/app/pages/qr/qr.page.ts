import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-qr',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './qr.page.html',
  styleUrls: ['./qr.page.scss'],
})
export class QrPage implements OnInit {

  shareSocials = 'https://www.facebook.com/jean.saucedo.923'

  constructor() {
  }

  ngOnInit() {
  }

}
