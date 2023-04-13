import { getStringWithSensitiveCase } from "src/app/utils/filter.util";
import { TASK_STATUS } from "src/constant/task-list.const";
import { IBeAssignee, IBeTask } from "src/interface/be-model.interface";
import { IFilterMap } from "src/interface/task-list.interface";

export function getAssigneeMapBySearchString(assignees: IBeAssignee[], filterMap: IFilterMap) {
    return assignees?.reduce((acc, user, idx) => {
        if (
            !acc?.has(user) &&
            (filterMap?.searchString && getStringWithSensitiveCase(user?.name)?.includes(getStringWithSensitiveCase(filterMap?.searchString))
                || filterMap?.assigneeIds?.includes(user?.id))
        ) {
            acc.set(user?.id, user);
        }
        return acc;
    }, new Map())
}

export function getTaskStatusBySearchString(filterMap: IFilterMap): boolean {
    let statusOption = TASK_STATUS?.find(status => status?.label?.toLowerCase()?.includes(filterMap?.searchString?.toLowerCase()));
    return filterMap?.completed?.includes(statusOption?.value)
}