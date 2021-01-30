import { InternalServerErrorException, Logger } from '@nestjs/common';
import { TASK_LOG } from 'src/constants/task-log.constant';
import { TaskStatus } from 'src/enums/task-status.enum';
import { CreateTaskDto } from 'src/tasks/dtos/create-task.dto';
import { GetTasksFilteredDto } from 'src/tasks/dtos/get-tasks-filtered';
import { EntityRepository, Repository } from 'typeorm';
import { Task } from '../entities/task.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger(TASK_LOG.TasksController);

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;

    try {
      await task.save();
    } catch (error) {
      this.logger.error(`Failed to create a task ${createTaskDto}`);
      throw new InternalServerErrorException();
    }

    return task;
  }

  async getTasks(taskFilteredDto: GetTasksFilteredDto): Promise<Task[]> {
    const { status, search } = taskFilteredDto;

    const query = this.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      // using andWhere instead of where because 'where' will replace all the previous query 'where'
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    try {
      const tasks = query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks with DTO: ${JSON.stringify(taskFilteredDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
