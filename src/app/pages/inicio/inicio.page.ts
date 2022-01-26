import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {SelectiveLoadingStrategy} from 'src/app/selective-loading-strategy';
import {PERFIL_KEY} from 'src/app/util/constants';
import {Subscription} from "rxjs";
import {Platform} from "@ionic/angular";
import {AlertService} from "../../services/shared/alert.service";
Navigator

@Component({
  selector: 'app-inicio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit, OnDestroy {

  subscriptionExit = new Subscription();

  constructor(private loader: SelectiveLoadingStrategy, private platform: Platform, private alert: AlertService) {
  }

  ngOnInit() {
    localStorage.removeItem(PERFIL_KEY);
    setTimeout(() => {
      this.loader.preLoadRoute('login');
      this.loader.preLoadRoute('registro');
    }, 0)
  }

  ionViewDidEnter() {
    const preloadArea: HTMLElement = document.getElementById('preload');
    preloadArea.appendChild(document.createElement('ion-input'));
    preloadArea.appendChild(document.createElement('ion-avatar'));
    preloadArea.appendChild(document.createElement('ion-label'));
    console.log(navigator['app']);
        
    this.subscriptionExit = this.platform.backButton.subscribe(() => {
      this.alert.alertOk('Deseas cerrar la aplicación?').then((value) => {
        if (value) {
          // tslint:disable-next-line:no-string-literal
          navigator['app'].exitApp();
        }
      });
    });
  }

  ionViewDidLeave() {
    this.subscriptionExit.unsubscribe();
  }

  ngOnDestroy() {
    this.subscriptionExit.unsubscribe();
  }
}
