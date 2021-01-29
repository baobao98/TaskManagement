import { TaskStatus } from 'src/enums/task-status.enum';
import { CreateTaskDto } from 'src/tasks/dtos/create-task.dto';
import { GetTasksFilteredDto } from 'src/tasks/dtos/get-tasks-filtered';
import { EntityRepository, Repository } from 'typeorm';
import { Task } from '../entities/task.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;

    await task.save();

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

    const tasks = query.getMany();

    return tasks;
  }
}
