import { IBeTask } from "./be-model.interface";

export interface IFilterMap {
    assigneeIds?: number[];
    completed?: boolean[];
    searchString?: string;
}