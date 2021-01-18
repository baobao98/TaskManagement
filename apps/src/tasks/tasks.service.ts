import { Injectable } from '@nestjs/common';
import { Utils } from 'src/lib/utils';
import { ITask, Task, TaskStatus } from './models/task.model';

@Injectable()
export class TasksService {
  private tasks: ITask[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  createTask(title: string, description: string): Task {
    const task: ITask = {
      id: Utils.createUUID(),
      title: title,
      description: description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);

    return task;
  }
}
