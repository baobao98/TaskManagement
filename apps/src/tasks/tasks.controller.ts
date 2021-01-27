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
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateTaskDto } from './dtos/create-task.dto';
import { Task, TaskStatus } from './models/task.model';
import { TasksService } from './tasks.service';
import { GetTasksFilteredDto } from './dtos/get-tasks-filtered';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(
    @Query(ValidationPipe) taskFilteredDto: GetTasksFilteredDto,
  ): Task[] {
    return this.tasksService.getTasks(taskFilteredDto);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Task {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskRequestDto: CreateTaskDto): Task {
    return this.tasksService.createTask(createTaskRequestDto);
  }

  @Patch('/:id/status')
  updateTaskById(
    @Param('id') id: string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
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
