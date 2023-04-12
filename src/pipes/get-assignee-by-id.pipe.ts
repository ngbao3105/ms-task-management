import { Pipe, PipeTransform } from '@angular/core';
import { IBeAssignee } from 'src/interface/be-model.interface';

@Pipe({
  name: 'getAssigneeById'
})
export class GetAssigneeByIdPipe implements PipeTransform {
  transform(assigneeId: number, assignees: IBeAssignee[]): IBeAssignee {
    return assignees?.find(assignee => assignee?.id === assigneeId);
  }

}
