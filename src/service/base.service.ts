import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BackendService } from './mocked-backend.service';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  private _isSpinnerLoading$ = new Subject()
  constructor() { }

  public get isSpinnerLoading() {
    return this._isSpinnerLoading$;
  }

  public setSpinnerLoading(isSpinnerLoading: boolean) {
    this._isSpinnerLoading$.next(isSpinnerLoading);
  }
}
