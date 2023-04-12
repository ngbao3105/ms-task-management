import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { IBeAssignee, IBeTask } from 'src/interface/be-model.interface';
import { TaskService } from 'src/service/task.service';
import { UserService } from 'src/service/user.service';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent {
  public taskId: number;
  public user$ = new BehaviorSubject<IBeAssignee[]>([]);
  public taskDetail$ = new BehaviorSubject<IBeTask>({});
  constructor(private _route: ActivatedRoute, private _taskService: TaskService, private _userService: UserService) {
    this._route.paramMap.
      pipe(
        switchMap((params: ParamMap) => {
          return this._taskService.getTaskById(Number(params.get('id')));
        }),
        tap(task => this.taskDetail$.next(task)),
        switchMap(() => this._userService.getUsers()),
        tap(users => this.user$.next(users))
      )?.subscribe(console.log)
  }
}
