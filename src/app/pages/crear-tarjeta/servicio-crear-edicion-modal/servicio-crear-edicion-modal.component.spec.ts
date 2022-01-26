import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ServicioCrearEdicionModalComponent } from './servicio-crear-edicion-modal.component';

describe('ServicioCrearEdicionModalComponent', () => {
  let component: ServicioCrearEdicionModalComponent;
  let fixture: ComponentFixture<ServicioCrearEdicionModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicioCrearEdicionModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ServicioCrearEdicionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
