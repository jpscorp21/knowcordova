import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CompartirModalComponent} from "./compartir-modal.component";
import {IonicModule} from "@ionic/angular";
import {NgxVcardModule} from "ngx-vcard";
import {PipesModule} from "../../pipes/pipes.module";
import {ComponentsModule} from "../components.module";


@NgModule({
  declarations: [CompartirModalComponent],
  imports: [
    CommonModule,
    IonicModule,
    NgxVcardModule,
    PipesModule,
    ComponentsModule,
    NgxVcardModule
  ] 
})
export class CompartirModalModule {
}
