import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, catchError, debounceTime, filter, fromEvent, map, of, startWith, switchMap, takeUntil, tap, throwError } from 'rxjs';
import { SNACK_BAR_CONFIG } from 'src/constant/snackbar.const';
import { TASK_STATUS } from 'src/constant/task-list.const';
import { SnackBarMessageEnum } from 'src/enum/snackbar.enum';
import { IBeAssignee, IBeTask } from 'src/interface/be-model.interface';
import { TaskService } from 'src/service/task.service';
import { UserService } from 'src/service/user.service';
import { openSnackBar } from 'src/utils/common.util';
import { AddTaskComponent } from '../add-task/add-task.component';
import { IFilterMap } from 'src/interface/task-list.interface';
import { getAssigneeMapBySearchString } from './task-list.util';
import { FormControl } from '@angular/forms';
import { INPUT_DEBOUNCE_TIME, TASK_LIST_PAGE_SIZE } from 'src/constant/common.const';
import { getStringWithSensitiveCase } from 'src/app/utils/filter.util';
import { IFilterChange } from 'src/interface/filter.interface';
import { FilterFieldNameEnum } from 'src/enum/filter.enum';
import { PageEvent } from '@angular/material/paginator';

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
  public searchControl = new FormControl('');
  public filterMap: IFilterMap = {};
  public pageSize = TASK_LIST_PAGE_SIZE;
  public totalTasks = 0;
  public pageIndex = 0;
  private unSubscription$ = new Subject();
  displayedColumns: string[] = ['index', 'description', 'completed', 'assigneeId'];
  constructor(private _taskService: TaskService,
    private _userService: UserService,
    private _matSnackBar: MatSnackBar,
    private _matDialog: MatDialog,
    private _router: Router,) {
  }

  ngOnInit(): void {
    this.asyncActions();
    this._getTasks().pipe(
      tap((tasks) => this.tasks$.next(tasks)),
      switchMap(() => this._userService.getUsers()),
      tap(users => this.assignees$.next(users)),
      catchError(err => {
        openSnackBar(this._matSnackBar, SNACK_BAR_CONFIG[SnackBarMessageEnum.FAILED])
        return throwError(err)
      })
    ).subscribe();
  }
  private asyncActions() {
    this._taskService.isSpinnerLoading.asObservable().pipe(takeUntil(this.unSubscription$)).subscribe(
      (isLoading: boolean) => this.isSpinnerLoading$.next(isLoading));

    this.searchControl?.valueChanges?.pipe(
      tap(() => this.isSpinnerLoading$.next(true)),
      startWith(''),
      debounceTime(INPUT_DEBOUNCE_TIME),
      takeUntil(this.unSubscription$),
      map((searchValue: string) => this.getFilterTask({ searchString: searchValue })),
      tap(() => this.isSpinnerLoading$.next(false))
    ).subscribe((filteredTasks: IBeTask[]) => {
      this.tasks$.next(filteredTasks);
    })

  }
  onRowClick(taskId: number) {
    this._router.navigateByUrl(`tasks/${taskId}`);
  }

  assignUser(event: MatSelectChange, selectedTask: IBeTask) {
    let id = event?.value;
    let taskId = selectedTask?.id;
    if (!id || id === selectedTask?.assigneeId) { return; }
    this._taskService.updateTask(taskId, { assigneeId: id }).pipe(
      catchError(err => {
        openSnackBar(this._matSnackBar, SNACK_BAR_CONFIG[SnackBarMessageEnum.FAILED]);
        this._refreshDataSource();
        return throwError(err);
      }),
      switchMap(() => this._getTasks()),
    ).subscribe(() => {
      this.tasks$.next(this.getFilterTask(this.filterMap));
      openSnackBar(this._matSnackBar, SNACK_BAR_CONFIG[SnackBarMessageEnum.SUCCESS])

    })
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
      switchMap(() => this._getTasks()),
    ).subscribe((tasks: IBeTask[]) => {
      this.tasks$.next(this.getFilterTask(this.filterMap));
    })
  }

  addNewTask() {
    let newTaskDialog = this._matDialog.open(AddTaskComponent, {
      panelClass: 'add-new-task-dialog',
      width: '500px',
      autoFocus: false,
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

  statusFilterChange(filterChange: IFilterChange) {
    this._filterChange(filterChange, FilterFieldNameEnum.COMPLETED);

  }

  assigneeFilterChange(filterChange: IFilterChange) {
    this._filterChange(filterChange, FilterFieldNameEnum.ASSIGNEE_IDS);
  }

  onPageChanged(event: PageEvent) {
    this.pageIndex = event?.pageIndex ?? this.pageIndex;
    this._getTasks().pipe(tap(tasks => {
      this.tasks$.next(tasks);
    })).subscribe()
  }

  private _filterChange(filterChange: IFilterChange, filterFieldName: string) {
    if (!filterChange?.checked) {
      this.filterMap[filterFieldName] = this.filterMap[filterFieldName]?.filter(value => value !== filterChange?.option?.value);
    } else {
      this.filterMap[filterFieldName] = Array.from(new Set([...(this.filterMap[filterFieldName] || []), filterChange?.option?.value])?.values());
    }
    this.tasks$.next(this.getFilterTask(this.filterMap));
  }

  private getFilterTask(filterMap: IFilterMap): IBeTask[] {
    this.filterMap = { ...this.filterMap, ...filterMap };

    let filteredTasks = this._taskService?.taskList;
    // assigneeId filter section
    if (!!this.filterMap?.assigneeIds && this.filterMap?.assigneeIds?.length > 0) {
      filteredTasks = filteredTasks?.filter(task =>
        this.filterMap?.assigneeIds?.includes(task?.assigneeId))
    }
    // status filter section
    if (!!this.filterMap?.completed && this.filterMap?.completed?.length > 0) {
      filteredTasks = filteredTasks?.filter(task => this.filterMap?.completed?.includes(task?.completed));
    }
    // everything filter section
    if (!!this.filterMap?.searchString) {
      let searchString = getStringWithSensitiveCase(this.filterMap?.searchString);
      let filteredAssigneeMap = getAssigneeMapBySearchString(this._userService?.users, this.filterMap) || undefined;
      filteredTasks = filteredTasks?.filter(task => getStringWithSensitiveCase(task?.description)?.includes(searchString)
        || filteredAssigneeMap?.has(task?.assigneeId)
        || this.filterMap?.completed?.includes(task?.completed)
      );
    }
    this.pageIndex = 0;
    this.totalTasks = filteredTasks?.length;
    return filteredTasks?.slice(
      this.pageIndex * this.pageSize,
      (this.pageIndex + 1) * this.pageSize);
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
      switchMap(() => this._getTasks()),
      tap((tasks) => {
        this.tasks$.next(tasks);
        openSnackBar(this._matSnackBar, SNACK_BAR_CONFIG[SnackBarMessageEnum.SUCCESS])
      }),
    )
  }

  private _getTasks() {
    return this._taskService.getTasks().pipe(
      tap((tasks: IBeTask[]) => this.totalTasks = tasks?.length),
      map(tasks => tasks?.slice(
        this.pageIndex * this.pageSize,
        (this.pageIndex + 1) * this.pageSize)),
    )
  }

  private _refreshDataSource() {
    this.tasks$.next(structuredClone(this._taskService.taskList));
  }


  ngOnDestroy(): void {
    this.unSubscription$.next('');
    this.unSubscription$.complete();
  }
}
