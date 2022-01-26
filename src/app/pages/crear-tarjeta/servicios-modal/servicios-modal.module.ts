import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ServiciosModalComponent } from './servicios-modal.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,    
  ],
  declarations: [ServiciosModalComponent],
  exports: [ServiciosModalComponent]
})
export class ServiciosModalModule { }
