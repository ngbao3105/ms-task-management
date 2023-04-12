import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, Subject, catchError, throwError } from 'rxjs';
import { IBeAssignee, IBeTask } from 'src/interface/be-model.interface';
import { UserService } from 'src/service/user.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit {
  public formGroup: FormGroup;
  public users$ = new BehaviorSubject<IBeAssignee[]>([]);
  constructor(
    private _fb: FormBuilder, private _userService: UserService,
    private _dialogRef: MatDialogRef<AddTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }
  ngOnInit(): void {
    this._userService.getUsers().pipe(
      catchError(err => {
        return throwError(err)
      })
    ).subscribe(users => this.users$.next(users));
    this._initFormGroup();
  }

  public submitNewTask() {
    if (this.formGroup?.invalid) {
      this.formGroup?.markAllAsTouched()
      return;
    }
    this._dialogRef.close(this.formGroup.getRawValue())
  }

  private _initFormGroup() {
    this.formGroup = this._fb.group({
      description: new FormControl('', [Validators.required]),
      assigneeId: new FormControl('')
    }
    )
  }
}
