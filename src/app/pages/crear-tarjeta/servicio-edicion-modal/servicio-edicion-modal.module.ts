import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServicioEdicionModalComponent } from './servicio-edicion-modal.component';

@NgModule({  
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule    
  ],
  declarations: [ServicioEdicionModalComponent],
  exports: [ServicioEdicionModalComponent]
})
export class ServicioEdicionModalModule { }
