import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterComponent } from './filter.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
@NgModule({
  declarations: [
    FilterComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatMenuModule,
    MatCheckboxModule
  ],
  exports: [FilterComponent]
})
export class FilterModule { }
