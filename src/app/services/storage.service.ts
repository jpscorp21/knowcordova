import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage = new BehaviorSubject<Storage>(null);


  constructor(private storage: Storage) {
    this.init();
  }

  async init() {    
    const storage = await this.storage.create();
    this._storage.next(storage);
  }

  async getStorage(): Promise<Storage> {
    return await new Promise((resolve) => {
      if (this._storage.getValue()) {
        resolve(this._storage.getValue());
      } else {
        this._storage.subscribe((storage) => {
          if (storage) {
            resolve(storage);
          }
        })
      }
    })
  }
  
  public async set(key: string, value: any) {
    (await this.getStorage()).set(key, value);
  }

  public async get(key: string) {
    return (await this.getStorage()).get(key);
  }

}