import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, catchError, fromEvent, of, switchMap, takeUntil, tap, throwError } from 'rxjs';
import { SNACK_BAR_CONFIG } from 'src/constant/snackbar.const';
import { TASK_STATUS } from 'src/constant/task-list.const';
import { SnackBarMessageEnum } from 'src/enum/snackbar.enum';
import { IBeAssignee, IBeTask } from 'src/interface/be-model.interface';
import { BackendService } from 'src/service/mocked-backend.service';
import { TaskService } from 'src/service/task.service';
import { UserService } from 'src/service/user.service';
import { openSnackBar } from 'src/utils/common.util';
import { AddTaskComponent } from '../add-task/add-task.component';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, OnDestroy {
  public tasks$ = new BehaviorSubject<IBeTask[]>([]);
  public assignees$ = new BehaviorSubject<IBeAssignee[]>([]);
  public isSpinnerLoading$ = new BehaviorSubject(true);
  public taskStatus$ = new BehaviorSubject(TASK_STATUS);
  private unSubscription$ = new Subject();
  displayedColumns: string[] = ['description', 'completed', 'assigneeId'];
  constructor(private _taskService: TaskService,
    private _userService: UserService,
    private _matSnackBar: MatSnackBar,
    private _matDialog: MatDialog,
    private _router: Router,) {
  }

  ngOnInit(): void {
    this.asyncActions();
    this._taskService.getTasks().pipe(
      catchError(err => {
        openSnackBar(this._matSnackBar, SNACK_BAR_CONFIG[SnackBarMessageEnum.FAILED])
        return throwError(err)
      })
    ).subscribe(tasks => this.tasks$.next(tasks));
    this._userService.getUsers().pipe(
      catchError(err => {
        openSnackBar(this._matSnackBar, SNACK_BAR_CONFIG[SnackBarMessageEnum.FAILED])
        return throwError(err)
      })
    ).subscribe(users => this.assignees$.next(users));
  }
  private asyncActions() {
    this._taskService.isSpinnerLoading.asObservable().pipe(takeUntil(this.unSubscription$)).subscribe(
      (isLoading: boolean) => this.isSpinnerLoading$.next(isLoading));
  }
  onRowClick(taskId: number) {
    this._router.navigateByUrl(`tasks/${taskId}`);
  }

  assignUser(event: MatSelectChange, selectedTask: IBeTask) {
    let id = event?.value;
    let taskId = selectedTask?.id;
    // {value:222}
    if (!id || id === selectedTask?.assigneeId) { return; }
    this._taskService.updateTask(taskId, { assigneeId: id }).pipe(
      catchError(err => {
        openSnackBar(this._matSnackBar, SNACK_BAR_CONFIG[SnackBarMessageEnum.FAILED]);
        this._refreshDataSource();
        return throwError(err);
      }),
      tap(() => {
        openSnackBar(this._matSnackBar, SNACK_BAR_CONFIG[SnackBarMessageEnum.SUCCESS])
      }),
    ).subscribe()
  }

  completeTask(event: MatSelectChange, taskId: number) {
    let isCompleted = event?.value;
    this._taskService.updateTask(taskId, { completed: isCompleted }).pipe(
      catchError(err => {
        openSnackBar(this._matSnackBar, SNACK_BAR_CONFIG[SnackBarMessageEnum.FAILED]);
        this._refreshDataSource();
        return throwError(err);
      }),
      tap(() => {
        openSnackBar(this._matSnackBar, SNACK_BAR_CONFIG[SnackBarMessageEnum.SUCCESS])
      }),
      switchMap(() => this._taskService.getTasks()),
    ).subscribe((tasks: IBeTask[]) => {
      this.tasks$.next(tasks)
    })
  }

  addNewTask() {
    let newTaskDialog = this._matDialog.open(AddTaskComponent, {
      panelClass: 'add-new-task-dialog',
      data: {
        title: 'Add new task'
      }
    });
    newTaskDialog.afterClosed().pipe(
      switchMap(formValue => {
        if (!formValue) { return of(null); }
        return this._addTaskPipe(formValue)
      }),
      takeUntil(this.unSubscription$),
      catchError(err => {
        openSnackBar(this._matSnackBar, SNACK_BAR_CONFIG[SnackBarMessageEnum.FAILED])
        return throwError(err)
      }
      ),
    ).subscribe()
  }

  private _addTaskPipe(formValue: any) {
    let assigneeId = formValue?.assigneeId;
    return this._taskService.createTask({ ...formValue, completed: false }).pipe(
      switchMap((task) => {
        if (!!assigneeId) {
          return this._taskService.updateTask(task?.id, { assigneeId });
        }
        return of(task);
      }),
      switchMap(() => this._taskService.getTasks()),
      tap((tasks) => {
        this.tasks$.next(tasks);
        openSnackBar(this._matSnackBar, SNACK_BAR_CONFIG[SnackBarMessageEnum.SUCCESS])
      }),
    )
  }

  private _refreshDataSource() {
    this.tasks$.next(structuredClone(this.tasks$?.value));
  }

  ngOnDestroy(): void {
    this.unSubscription$.next('');
    this.unSubscription$.complete();
  }
}
