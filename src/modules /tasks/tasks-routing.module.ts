import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasksComponent } from './tasks.component';
import { TaskListComponent } from '../task-list/task-list.component';

const routes: Routes = [
  {
    path: '',
    component: TaskListComponent
  },
  {
    path: ':id',
    loadChildren: () => import('../task-detail/task-detail.module').then(m => m?.TaskDetailModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasksRoutingModule { }
