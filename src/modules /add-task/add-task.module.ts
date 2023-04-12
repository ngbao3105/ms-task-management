import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTaskComponent } from './add-task.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from 'src/service/user.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    AddTaskComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
  providers: [UserService],
  exports: [AddTaskComponent]
})
export class AddTaskModule { }
