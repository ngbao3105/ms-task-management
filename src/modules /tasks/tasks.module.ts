import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TasksRoutingModule } from './tasks-routing.module';
import { TasksComponent } from './tasks.component';
import { RouterModule } from '@angular/router';
import { TaskListModule } from '../task-list/task-list.module';
import { TaskDetailModule } from '../task-detail/task-detail.module';


@NgModule({
  declarations: [
    TasksComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([]),
    TasksRoutingModule,
    TaskListModule,
    TaskDetailModule
  ]
})
export class TasksModule { }
