import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskDetailComponent } from './task-detail.component';
import { GetTaskStatusPipe } from 'src/pipes/get-task-status.pipe';
import { TaskService } from 'src/service/task.service';
import { UserService } from 'src/service/user.service';
import { TaskDetailRoutingModule } from './task-detail-routing.module';
import { GetAssigneeByIdPipe } from 'src/pipes/get-assignee-by-id.pipe';



@NgModule({
  declarations: [
    GetTaskStatusPipe,
    GetAssigneeByIdPipe,
    TaskDetailComponent,
  ],
  imports: [
    CommonModule,
    TaskDetailRoutingModule
  ],
  providers: [TaskService, UserService]
})
export class TaskDetailModule { }
