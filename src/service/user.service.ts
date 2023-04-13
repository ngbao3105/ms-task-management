import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { BackendService } from './mocked-backend.service';
import { catchError, finalize, tap, throwError } from 'rxjs';
import { IBeAssignee } from 'src/interface/be-model.interface';

@Injectable()
export class UserService extends BaseService {
  private _users: IBeAssignee[];
  constructor(private _beService: BackendService) {
    super()
  }

  public get users() {
    return this._users;
  }

  public set users(users: IBeAssignee[]) {
    this._users = users;
  }

  public getUserById(userId: number) {
    this.setSpinnerLoading(true);
    return this._beService.user(userId).pipe(
      tap(() => this.setSpinnerLoading(true)),
      finalize(() => this.setSpinnerLoading(false)),
      catchError(err => throwError(err))

    )
  }

  public getUsers() {
    this.setSpinnerLoading(true)
    this.setSpinnerLoading(true);
    return this._beService.users().pipe(
      tap((users: IBeAssignee[]) => {
        this.users = users;
      }),
      finalize(() => this.setSpinnerLoading(false)),
      catchError(err => throwError(err))
    )
  }
}
