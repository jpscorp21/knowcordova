import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';

@Component({
  selector: 'jp-cargando',
  template: `
    <ion-slides [options]="sliderOpts">
      <ion-slide>
        <ion-grid fixed>
          <ion-row class="ion-text-center" style="margin: auto">

            <img src="/assets/know-intro.gif" alt="know intro"/>
          </ion-row>
          
        </ion-grid>
      </ion-slide>
    </ion-slides>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./cargando.component.scss'],
})
export class CargandoComponent implements OnInit {
  sliderOpts = {
    allowSlidePrev: false,
    allowSlideNext: false,
  };

  @Input() src = '/assets/blip-cargador.gif';

  constructor() {
  }

  ngOnInit() {
  }
}

