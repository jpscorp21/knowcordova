import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-know-header-modal',
  templateUrl: './know-header-modal.component.html',
  styleUrls: ['./know-header-modal.component.scss'],
})
export class KnowHeaderModalComponent implements OnInit {

  @Input() title = 'Know'

  constructor(public modal: ModalController) {
  }

  ngOnInit() {
  }

}
