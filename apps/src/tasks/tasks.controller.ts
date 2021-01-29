import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateTaskDto } from './dtos/create-task.dto';
import { TasksService } from './tasks.service';
import { GetTasksFilteredDto } from './dtos/get-tasks-filtered';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from 'src/enums/task-status.enum';
import { Task } from 'src/entities/task.entity';
import { TASK_LOG } from 'src/constants/task-log.constant';

@Controller('tasks')
export class TasksController {
  private logger = new Logger(TASK_LOG.TasksController);

  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(
    @Query(ValidationPipe) taskFilteredDto: GetTasksFilteredDto,
  ): Promise<Task[]> {
    this.logger.verbose(
      `Get tasks with filters "${JSON.stringify(taskFilteredDto)}"`,
    );

    return this.tasksService.getTasks(taskFilteredDto);
  }

  @Get('/:id')
  getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskRequestDto: CreateTaskDto): Promise<Task> {
    this.logger.verbose(
      `Create a task: ${JSON.stringify(createTaskRequestDto)}`,
    );
    return this.tasksService.createTask(createTaskRequestDto);
  }

  @Patch('/:id/status')
  updateTaskById(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  ): Promise<Task> {
    return this.tasksService.updateTaskStatusById(id, status);
  }

  @Delete('/:id')
  deleteTaskById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.tasksService.deleteTaskById(id);
  }
}
