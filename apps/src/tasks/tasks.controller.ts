import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { CreateTaskDto } from './dtos/create-task.dto';
import { Task, TaskStatus } from './models/task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTasks(): Task[] {
    return this.tasksService.getAllTasks();
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Task {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  // we can extract specific value in body by using @Body('key'). Ex: @Body('title')
  createTask(@Body() createTaskRequestDto: CreateTaskDto): Task {
    return this.tasksService.createTask(createTaskRequestDto);
  }

  @Patch('/:id/status')
  updateTaskById(
    @Param('id') id: string,
    @Body('status') status: TaskStatus,
  ): Task {
    return this.tasksService.updateTaskStatusById(id, status);
  }

  @Delete('/:id')
  deleteTaskById(@Param('id') id: string) {
    try {
      this.tasksService.deleteTaskById(id);
    } catch {
      throw new HttpException('try again', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
