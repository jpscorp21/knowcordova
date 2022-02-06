import {
  AfterContentChecked, AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {TarjetasService} from '../../services/tarjetas.service';
import {ActivatedRoute, Router} from '@angular/router';
import {IonSlides, Platform} from '@ionic/angular';
import {AuthService} from 'src/app/services/auth.service';
import {Persona} from 'src/app/interfaces/interface';
import {PerfilService} from 'src/app/services/perfil.service';
import {PERFIL_KEY} from 'src/app/util/constants';
import {BehaviorSubject, Subscription} from 'rxjs';
import {SelectiveLoadingStrategy} from 'src/app/selective-loading-strategy';
import {SwiperComponent} from 'swiper/angular';
import {SwiperOptions} from 'swiper';
import SwiperCore, {EffectFlip, Pagination} from 'swiper/core';
import { BackgroundMode } from '@awesome-cordova-plugins/background-mode/ngx';
import {ModalPageService} from "../../services/modal-page.service";

SwiperCore.use([Pagination, EffectFlip]);

@Component({
  selector: 'app-cards',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cards.page.html',
  styleUrls: ['./cards.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CardsPage implements OnInit, AfterContentChecked, OnDestroy, AfterViewInit {

  @ViewChild('swiper') swiper: SwiperComponent;
  @ViewChild('slides') slides: IonSlides;


  subscription = new Subscription();
  slideIndex = new BehaviorSubject(0);

  isDrag = new BehaviorSubject(false);

  initialSlideAction = new BehaviorSubject(0);

  subscriptionExit = new Subscription();

  constructor(
    public readonly tarjetas: TarjetasService,
    public readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly modalPage: ModalPageService,
    public readonly auth: AuthService,
    public readonly platform: Platform,
    public readonly perfil: PerfilService,
    private loader: SelectiveLoadingStrategy,
    private readonly cdr: ChangeDetectorRef,
    private bm: BackgroundMode
  ) {
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  newConfig: SwiperOptions = this.platform.is('ios') ? {
    slidesPerView: 'auto',
  } : {
    slidesPerView: 'auto',
    effect: 'flip',
  };

  get loading$() {
    return this.tarjetas.loading$;
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  tarjetas$ = this.tarjetas.getTarjetas();

  get id() {
    // this.tarjetasServicio.successByPersona | async
    return Number(this.route.snapshot.params.id);
  }


  ngOnInit() {
    setTimeout(() => {
      this.loader.preLoadRoute('cards');
      this.loader.preLoadRoute('amigos');
      this.loader.preLoadRoute('perfil');
      this.loader.preLoadRoute('qr');
      this.loader.preLoadRoute('crear-tarjeta');
      this.loader.preLoadRoute('compartir');
    }, 100);
    this.router.initialNavigation();
  }

  ionViewDidEnter() {
    const preloadArea: HTMLElement = document.getElementById('preload-cards');
    preloadArea.appendChild(document.createElement('ion-input'));
    preloadArea.appendChild(document.createElement('ion-searchbar'));
    preloadArea.appendChild(document.createElement('ion-popover'));
    preloadArea.appendChild(document.createElement('ion-backdrop'));
    preloadArea.appendChild(document.createElement('ion-card'));
    preloadArea.appendChild(document.createElement('ion-img'));

    console.log(this.router.url);


    this.subscriptionExit = this.platform.backButton.subscribe(() => {
      if (this.router.url.indexOf('cards') > -1 && !this.modalPage.onModal) {
        this.bm.moveToBackground();
      } else {
        console.log('No cierres')
      }
    });
  }

  ngAfterViewInit() {

    this.isDrag.subscribe((value) => {
      if (this.swiper && this.swiper.swiperRef) {
        this.swiper.swiperRef.allowTouchMove = !value;
      }
    });

    if (this.perfil.perfil && this.perfil.perfil.idtarjetaselected) {
      this.subscription = this.tarjetas.tarjetasByPersona$.subscribe((tarjetas) => {
        if (tarjetas && Object.keys(tarjetas).length) {
          const index = Object.values(tarjetas).findIndex(x => x.id === this.perfil.perfil.idtarjetaselected);
          if (this.swiper && this.swiper.swiperRef) {
            this.swiper.swiperRef.slideTo(index);
            this.slideIndex.next(index);
          }
        }
      });
    }
  }

  ngAfterContentChecked() {

    if (this.swiper) {
      this.swiper.updateSwiper({});
    }
  }

  slideleft() {
    // this.slides.slidePrev();
    this.swiper.swiperRef.slidePrev();
  }

  slideright() {
    this.swiper.swiperRef.slideNext();
    // this.slides.slideNext();
  }

  async changeSlide() {

    // const res = await this.slides.getActiveIndex();
    const res = this.swiper.swiperRef.realIndex;

    this.slideIndex.next(res);
    this.cdr.detectChanges();


    if (!Object.values(this.tarjetas.tarjetasByPersona)[res]) {
      return;
    }

    const data: Persona = {
      ...this.perfil.perfil,
      idtarjetaselected: Object.values(this.tarjetas.tarjetasByPersona)[res].id,
      isChange: true,
    };

    localStorage.setItem(PERFIL_KEY, JSON.stringify(data));
    this.perfil.setPerfil(data);


    // try {
    //   await this.auth.updatePersona(this.perfil.perfil.id, data);
    // } catch(e) {
    //   localStorage.setItem(PERFIL_KEY, JSON.stringify({...data, idtarjetaselected: idtarjeta}));
    //   this.perfil.setPerfil({...data, idtarjetaselected: idtarjeta});

    // }

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscriptionExit.unsubscribe();
  }


  handleSlideChange(event: any) {
    console.log('slide right', event);
  }
}
