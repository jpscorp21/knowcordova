import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {UtilService} from "../../services/shared/util.service";

@Component({
  selector: 'app-tutorial',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tutorial.page.html',
  styleUrls: ['./tutorial.page.scss'],
})
export class TutorialPage implements OnInit {

  preguntas: Preguntas[] = [
    {
      id: 1,
      text: '¿Cómo edito mi información de perfil?'
    },
    {
      id: 2,
      text: '¿Cómo agrego amigos y/o contactos?'
    },
    {
      id: 3,
      text: '¿Qué son los tags y cómo funcionan?'
    },
    {
      id: 4,
      text: '¿Cómo edito mi privacidad?'
    },
  ]

  constructor(
    private readonly router: Router,
    private readonly util: UtilService
  ) {
  }

  styleImg(url: string) {
    return this.util.styleImg2(url);
  }

  ngOnInit() {
  }

  showDetail(id: number) {
    this.router.navigateByUrl('tabs/tutorial-detalle/' + id);
  }

}

export interface Preguntas {
  id: number;
  text: string;
}
