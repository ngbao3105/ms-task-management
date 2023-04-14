import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListComponent } from './task-list.component';
import { CommonModule } from '@angular/common';
import { AddTaskModule } from '../add-task/add-task.module';
import { MatDialogModule } from '@angular/material/dialog';
import { FilterModule } from '../filter/filter.module';
import { BackendService } from 'src/service/mocked-backend.service';
import { UserService } from 'src/service/user.service';
import { TaskService } from 'src/service/task.service';
import { Observable } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { GetAssigneeOptions } from 'src/pipes/get-assignee-options.pipe';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskService: TaskService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        TaskListComponent,
        GetAssigneeOptions
      ],
      imports: [
        CommonModule,
        MatTableModule,
        BrowserModule,
        BrowserAnimationsModule,
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
      .compileComponents();
    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    taskService = TestBed.get(TaskService)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have tasks', async (done: DoneFn) => {
    const expected = [{
      id: 0,
      description: "Install a monitor arm",
      assigneeId: 111,
      completed: false
    },
    {
      id: 1,
      description: "Move the desk to the new location",
      assigneeId: 222,
      completed: false
    }]
    await expectAsync(taskService.getTasks).toBeResolvedTo(new Observable(observer => observer?.next(expected))).then(() => done())
  })
});
