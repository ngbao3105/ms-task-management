import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskListComponent } from './task-list.component';
import { BackendService } from 'src/service/mocked-backend.service';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { UserService } from 'src/service/user.service';
import { TaskService } from 'src/service/task.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { AddTaskModule } from '../add-task/add-task.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { FilterModule } from '../filter/filter.module';
import { GetAssigneeOptions } from 'src/pipes/get-assignee-options.pipe';
@NgModule({
  declarations: [
    TaskListComponent,
    GetAssigneeOptions

  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatInputModule,
    MatIconModule,
    AddTaskModule,
    MatDialogModule,
    FilterModule
  ],
  providers: [BackendService, UserService, TaskService]
})
export class TaskListModule { }
