import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ModalPageService {

  private onModalSubject = new BehaviorSubject(false);

  get onModal() {
    return this.onModalSubject.getValue();
  }

  setOnModal(value: boolean) {
    this.onModalSubject.next(value);
  }

}
