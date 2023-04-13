import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { BehaviorSubject, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { IBeAssignee, IBeTask } from 'src/interface/be-model.interface';
import { TaskService } from 'src/service/task.service';
import { UserService } from 'src/service/user.service';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit, OnDestroy {
  public taskId: number;
  public user$ = new BehaviorSubject<IBeAssignee[]>([]);
  public taskDetail$ = new BehaviorSubject<IBeTask>({});
  public isSpinnerLoading$ = new BehaviorSubject<boolean>(true);
  private unSubscription$ = new Subject();
  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private _taskService: TaskService,
    private _userService: UserService) {

  }

  ngOnInit(): void {
    this._asyncActions();
    this._route.paramMap.
      pipe(

        switchMap((params: ParamMap) => {
          return this._taskService.getTaskById(Number(params.get('id')));
        }),
        tap(task => {
          if (!task) { this._router.navigate(['/tasks']) }
          this.taskDetail$.next(task)
        }),
        switchMap(() => this._userService.getUsers()),
        tap(users => this.user$.next(users))
      )?.subscribe()
  }

  private _asyncActions() {
    this._taskService.isSpinnerLoading.asObservable().pipe(takeUntil(this.unSubscription$),
      tap((isSpinnerLoading: boolean) => this.isSpinnerLoading$.next(isSpinnerLoading)))
      .subscribe()
  }

  ngOnDestroy(): void {
    this.unSubscription$.next('');
    this.unSubscription$.complete();
  }
}
