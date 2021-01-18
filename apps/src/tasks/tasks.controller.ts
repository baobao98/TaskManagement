import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateTaskRequestDto } from './dtos/create-task-request.dto';
import { Task } from './models/task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTasks(): Task[] {
    return this.tasksService.getAllTasks();
  }

  @Post()
  // we can extract specific value in body by using @Body('key'). Ex: @Body('title')
  createTask(@Body() createTaskRequestDto: CreateTaskRequestDto): Task {
    return this.tasksService.createTask(
      createTaskRequestDto.title,
      createTaskRequestDto.description,
    );
  }
}
