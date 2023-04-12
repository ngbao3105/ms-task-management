import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { BackendService } from './mocked-backend.service';
import { catchError, finalize, tap, throwError } from 'rxjs';

@Injectable()
export class UserService extends BaseService {

  constructor(private _beService: BackendService) {
    super()
  }

  public getUserById(userId: number) {
    return this._beService.user(userId).pipe(
      tap(() => this.setSpinnerLoading(true)),
      finalize(() => this.setSpinnerLoading(false)),
      catchError(err => throwError(err))

    )
  }

  public getUsers() {
    return this._beService.users().pipe(
      tap(() => this.setSpinnerLoading(true)),
      finalize(() => this.setSpinnerLoading(false)),
      catchError(err => throwError(err))
    )
  }
}
