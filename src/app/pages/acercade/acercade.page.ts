import { Component, OnInit } from '@angular/core';
import { UtilService } from '../../services/shared/util.service';

@Component({
  selector: 'app-acercade',
  templateUrl: './acercade.page.html',
  styleUrls: ['./acercade.page.scss'],
})
export class AcercadePage implements OnInit {

  constructor(
    private readonly util: UtilService
  ) { }

  ngOnInit() {
  }

  styleImg(url: string) {
    return this.util.styleImg2(url);
  }
}
