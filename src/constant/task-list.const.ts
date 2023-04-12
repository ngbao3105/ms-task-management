import { TaskStatusEnum } from "src/enum/task-list.enum";

export const TASK_STATUS = [
  {
    value: true,
    label: TaskStatusEnum.COMPLETED
  },
  {
    value: false,
    label: TaskStatusEnum.WIP
  }
]
