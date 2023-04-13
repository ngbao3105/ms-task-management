import { Pipe, PipeTransform } from '@angular/core';
import { TaskStatusEnum } from 'src/enum/task-list.enum';
import { IBeAssignee } from 'src/interface/be-model.interface';
import { IFilterMenuOption } from 'src/interface/filter.interface';

@Pipe({
  name: 'getAssigneeOptions'
})
export class GetAssigneeOptions implements PipeTransform {
  transform(assignees: IBeAssignee[]): IFilterMenuOption[] {
    return assignees?.map(assignee => ({ value: assignee?.id, label: assignee?.name }));
  }

}
