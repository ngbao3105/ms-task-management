import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListComponent } from './task-list.component';
import { CommonModule } from '@angular/common';
import { AddTaskModule } from '../add-task/add-task.module';
import { MatDialogModule } from '@angular/material/dialog';
import { FilterModule } from '../filter/filter.module';
import { BackendService } from 'src/service/mocked-backend.service';
import { UserService } from 'src/service/user.service';
import { TaskService } from 'src/service/task.service';
import { Observable, of } from 'rxjs';
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
import { MatPaginatorModule } from '@angular/material/paginator';
import { DebugElement } from '@angular/core';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let debugElement: DebugElement;
  let taskService: TaskService;
  let userService: UserService;
  let spyTask: jasmine.Spy;
  let spyUser: jasmine.Spy
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
        MatPaginatorModule,
        FilterModule
      ],
      providers: [BackendService, UserService, TaskService]
    })
      .compileComponents();
    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    taskService = debugElement.injector.get(TaskService);
    spyTask = spyOn(taskService, 'getTasks').and.returnValues(of([
      {
        id: 0,
        index: 0,
        description: "Install a monitor arm",
        assigneeId: 111,
        completed: false
      },
      {
        id: 1,
        index: 1,
        description: "Move the desk to the new location",
        assigneeId: 222,
        completed: false
      }]))
    userService = debugElement.injector.get(UserService);
    spyUser = spyOn(userService, 'getUsers').and.returnValues(of([
      { id: 111, name: "Mike" },
      { id: 222, name: "James" }
    ]))
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getTasks and on time', () => {
    expect(spyTask).toHaveBeenCalled();
    expect(component.tasks$.value).toEqual([{
      id: 0,
      index: 0,
      description: "Install a monitor arm",
      assigneeId: 111,
      completed: false
    },
    {
      id: 1,
      index: 1,
      description: "Move the desk to the new location",
      assigneeId: 222,
      completed: false
    }])
  })

  it('should call getUsers and on time', () => {
    expect(spyUser).toHaveBeenCalled();
    expect(component.assignees$.value).toEqual([
      { id: 111, name: "Mike" },
      { id: 222, name: "James" }]
    )
  })

});
