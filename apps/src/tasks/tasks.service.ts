import { Injectable } from '@nestjs/common';
import { Utils } from 'src/lib/utils';
import { CreateTaskDto } from './dtos/create-task.dto';
import { ITask, Task, TaskStatus } from './models/task.model';

@Injectable()
export class TasksService {
  private tasks: ITask[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskById(id: string): Task {
    return this.tasks.find((task) => task.id === id);
  }

  updateTaskStatusById(id: string, newStatus: TaskStatus): Task {
    const task: Task = this.getTaskById(id);
    task.status = newStatus;

    return task;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: ITask = {
      id: Utils.createUUID(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);

    return task;
  }

  deleteTaskById(id: string): void {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }
}
