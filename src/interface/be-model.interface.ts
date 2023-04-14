export interface IBeTask {
  id?: number;
  index?: number;
  assigneeId?: number;
  description?: string;
  completed?: boolean;
}

export interface IBeAssignee {
  id?: number;
  name?: string;
}
