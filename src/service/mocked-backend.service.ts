import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { delay, tap } from "rxjs/operators";
import { IBeAssignee, IBeTask } from "src/interface/be-model.interface";

/**
 * This service acts as a mock backend.
 *
 * You are free to modify it as you see.
 */


function randomDelay() {
  return Math.random() * 1000;
}

@Injectable()
export class BackendService {
  storedTasks: IBeTask[] = [
    {
      id: 0,
      description: "Install a monitor arm",
      assigneeId: 111,
      completed: false
    },
    {
      id: 1,
      description: "Move the desk to the new location",
      assigneeId: 222,
      completed: false
    }
  ];

  storedUsers: IBeAssignee[] = [
    { id: 111, name: "Mike" },
    { id: 222, name: "James" }
  ];

  lastId = 1;

  private findTaskById = id =>
    this.storedTasks.find(task => task.id === +id);

  private findUserById = id => this.storedUsers.find(user => user.id === +id);

  tasks() {
    return of(this.storedTasks).pipe(delay(randomDelay()));
  }

  task(id: number): Observable<IBeTask> {
    return of(this.findTaskById(id)).pipe(delay(randomDelay()));
  }

  users() {
    return of(this.storedUsers).pipe(delay(randomDelay()));
  }

  user(id: number) {
    return of(this.findUserById(id)).pipe(delay(randomDelay()));
  }

  newTask(payload: IBeTask) {
    const newTask: IBeTask = {
      id: ++this.lastId,
      description: payload.description,
      assigneeId: null,
      completed: false
    };

    this.storedTasks = this.storedTasks.concat(newTask);

    return of(newTask).pipe(delay(randomDelay()));
  }

  assign(taskId: number, userId: number) {
    return this.update(taskId, { assigneeId: userId });
  }

  complete(taskId: number, completed: boolean) {
    return this.update(taskId, { completed });
  }

  update(taskId: number, updates: Partial<Omit<IBeTask, "id">>) {

    const foundTask = this.findTaskById(taskId);

    if (!foundTask) {
      return throwError(new Error("task not found"));
    }

    const updatedTask = { ...foundTask, ...updates };

    this.storedTasks = this.storedTasks.map(t =>
      t.id === taskId ? updatedTask : t
    );

    return of(updatedTask).pipe(delay(randomDelay()));
  }
}
