import { Injectable } from '@angular/core';
import { BackendService } from './mocked-backend.service';
import { BaseService } from './base.service';
import { catchError, finalize, tap, throwError } from 'rxjs';
import { IBeTask } from 'src/interface/be-model.interface';

@Injectable()
export class TaskService extends BaseService {
  private _taskList: IBeTask[];

  constructor(private _beService: BackendService) {
    super()
  }

  public get taskList() {
    return this._taskList;
  }

  public set taskList(taskList: IBeTask[]) {
    this._taskList = taskList;
  }

  public getTaskById(id: number) {
    this.setSpinnerLoading(true);
    return this._beService?.task(id).pipe(
      catchError(err => throwError(err)),
      finalize(() => this.setSpinnerLoading(false))
    )
  }

  public getTasks() {
    this.setSpinnerLoading(true);
    return this._beService?.tasks().pipe(
      tap((tasks) => { this.taskList = tasks }),
      catchError(err => throwError(err)),
      finalize(() => this.setSpinnerLoading(false))
    )
  }

  public createTask(payload: IBeTask) {
    this.setSpinnerLoading(true);
    return this._beService.newTask(payload).pipe(
      catchError(err => throwError(err)),
      finalize(() => this.setSpinnerLoading(false))
    )
  }

  public assignToTask(taskId: number, userId: number) {
    this.setSpinnerLoading(true);
    return this._beService.assign(taskId, userId).pipe(
      catchError(err => throwError(err)),
      finalize(() => this.setSpinnerLoading(false))
    )
  }

  public completeTask(taskId: number, isCompleted: boolean) {
    this.setSpinnerLoading(true);
    return this._beService.complete(taskId, isCompleted).pipe(
      catchError(err => throwError(err)),
      finalize(() => this.setSpinnerLoading(false))
    )
  }

  public updateTask(taskId: number, partialUpdated: Partial<Omit<IBeTask, "id">>) {
    this.setSpinnerLoading(true);
    return this._beService.update(taskId, partialUpdated).pipe(
      catchError(err => throwError(err)),
      finalize(() => this.setSpinnerLoading(false))
    )
  }
}
