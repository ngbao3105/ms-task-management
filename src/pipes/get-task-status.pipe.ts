import { Pipe, PipeTransform } from '@angular/core';
import { TaskStatusEnum } from 'src/enum/task-list.enum';

@Pipe({
  name: 'getTaskStatus'
})
export class GetTaskStatusPipe implements PipeTransform {

  transform(taskStatus: boolean): unknown {
    if (taskStatus) {
      return TaskStatusEnum?.COMPLETED;
    }
    return TaskStatusEnum?.WIP;
  }

}
