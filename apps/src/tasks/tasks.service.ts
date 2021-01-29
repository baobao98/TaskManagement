import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dtos/create-task.dto';
import { GetTasksFilteredDto } from './dtos/get-tasks-filtered';
import { TaskRepository } from '../repositories/task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from 'src/entities/task.entity';
import { TaskStatus } from 'src/enums/task-status.enum';
import { DeleteResult } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository,
  ) {}

  getAllTasks(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  getTasks(taskFilteredDto: GetTasksFilteredDto): Promise<Task[]> {
    return this.taskRepository.getTasks(taskFilteredDto);
  }

  async getTaskById(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne(id);

    if (!task) {
      throw new NotFoundException(`Task with ${id} not found`);
    }

    return task;
  }

  async updateTaskStatusById(id: number, newStatus: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);

    task.status = newStatus;

    await task.save();

    return task;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  async deleteTaskById(id: number): Promise<void> {
    const deleteResult: DeleteResult = await this.taskRepository.delete(id);
    if (!deleteResult.affected) {
      throw new NotFoundException(`Task with Id ${id} not found`);
    }
  }
}
