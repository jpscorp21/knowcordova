import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Preguntas} from "../tutorial/tutorial.page";
import {ActivatedRoute} from "@angular/router";
import {map} from "rxjs/operators";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-tutorial-detalle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tutorial-detalle.page.html',
  styleUrls: ['./tutorial-detalle.page.scss'],
})
export class TutorialDetallePage implements OnInit {

  preguntas: Preguntas[] = [
    {
      id: 1,
      text: '¿Cómo edito mi información de perfil?',
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
    private readonly route: ActivatedRoute
  ) {
  }

  pregunta$ = this.route.params.pipe(
    map(({id}) => this.preguntas.find(pre => pre.id === Number(id)))
  )

  comentario = new FormControl();

  ngOnInit() {

  }

}
