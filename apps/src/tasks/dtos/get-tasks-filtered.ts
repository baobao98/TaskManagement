import { TaskStatus } from '../models/task.model';

export class GetTasksFilteredDto {
  status: TaskStatus;
  search: string;
}
