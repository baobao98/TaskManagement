import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from '../repositories/task.repository';
import { GetTasksFilteredDto } from './dtos/get-tasks-filtered';
import { TaskStatus } from '../enums/task-status.enum';
import { NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dtos/create-task.dto';
import { Task } from '../entities/task.entity';

const mockTask = {
  id: 1,
  title: 'title',
  description: 'desc',
  status: TaskStatus.OPEN,
};

const mockTaskRepository = () => ({
  getTasks: jest.fn().mockReturnValue('someTasks'),
  findOne: jest.fn().mockResolvedValue(mockTask),
  createTask: jest.fn().mockReturnValue('newCreatedTask'),
});

/**
 * OPEN CMD AND TYPE "yarn test --watch"
 */

// TEST CASES FOR TASK SERVICE
describe('TasksService', () => {
  let tasksService: TasksService;
  let taskRepository: TaskRepository;

  // Before each test, re-initialize service and repository
  beforeEach(async () => {
    // Initialize a mock module
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository },
      ],
    }).compile();

    // Retrieve the instance of repository and service from the initialized module
    tasksService = await module.get<TasksService>(TasksService);
    taskRepository = await module.get<TaskRepository>(TaskRepository);
  });

  // TEST CASES FOR GET TASKS METHOD
  describe('getTasks', () => {
    it('Validate get all tasks from the repository', async () => {
      // We don't execute the get all task => getTasks from task repository should not be called
      expect(taskRepository.getTasks).not.toHaveBeenCalled();

      const taskFilteredDto: GetTasksFilteredDto = {
        search: 'search query',
        status: TaskStatus.OPEN,
      };
      // call the get task service
      const result = await tasksService.getTasks(taskFilteredDto);

      expect(taskRepository.getTasks).toHaveBeenCalled();

      expect(result).toEqual('someTasks');
    });
  });

  // TEST CASES FOR GET TASK BY ID METHOD
  describe('getTaskById', () => {
    it('Validate taskRepository.findOne() return the task', async () => {
      const taskId = 2482;
      const result = await tasksService.getTaskById(taskId);

      expect(result).toEqual(mockTask);
    });

    it('Validate throw an error when given id is not found', async () => {
      // By default at line 16, we've already set the return value for taskRepository.findOne
      taskRepository.findOne = jest.fn().mockResolvedValue(null);
      const taskId = 2482;

      expect(tasksService.getTaskById(taskId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // TEST CASES FOR CREATE TASK
  describe('createTask', () => {
    let createTaskDto: CreateTaskDto;

    beforeEach(() => {
      createTaskDto = {
        title: 'new task',
        description: 'new task description',
      };
    });

    it('Validate taskRepository.create() function is invoked properly', async () => {
      // Check the taskRepository.create() is invoked
      expect(taskRepository.createTask).not.toHaveBeenCalled();

      await tasksService.createTask(createTaskDto);

      expect(taskRepository.createTask).toHaveBeenCalled();

      expect(taskRepository.createTask).toHaveBeenCalledWith(createTaskDto);
    });

    it('Validate taskRepository.create() return the result', async () => {
      const createdTask = await tasksService.createTask(createTaskDto);

      expect(createdTask).toEqual('newCreatedTask');
    });
  });

  // TEST CASES FOR DELETE TASK
  describe('deleteTask', () => {
    it('Validate taskRepository.delete(id) function is invoked properly', async () => {
      const taskId = 1;
      taskRepository.delete = jest.fn().mockResolvedValue({ affected: 1 });

      expect(taskRepository.delete).not.toHaveBeenCalled();

      await tasksService.deleteTaskById(taskId);

      expect(taskRepository.delete).toHaveBeenCalled();
      expect(taskRepository.delete).toHaveBeenCalledWith(taskId);
    });

    it('Validate the deleteTaskById throw NotFoundException', async () => {
      const taskId = 1;
      taskRepository.delete = jest.fn().mockResolvedValue({ affected: 0 });

      expect(tasksService.deleteTaskById(taskId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // TEST CASES FOR UPDATE TASK'S STATUS BY ID
  describe('updateTaskStatusById', () => {
    const existedTask = new Task();
    existedTask.id = 1;
    existedTask.title = 'title';
    existedTask.description = 'desc';
    existedTask.status = TaskStatus.OPEN;

    const updatedTask = new Task();
    updatedTask.id = 1;
    updatedTask.title = 'title';
    updatedTask.description = 'desc';
    updatedTask.status = TaskStatus.IN_PROGRESS;

    it('Validate getTaskById and save function is invoked properly', async () => {
      tasksService.getTaskById = jest.fn().mockResolvedValue(existedTask);
      existedTask.save = jest.fn().mockResolvedValue(updatedTask);

      expect(tasksService.getTaskById).not.toHaveBeenCalled();
      expect(existedTask.save).not.toHaveBeenCalled();

      await tasksService.updateTaskStatusById(
        existedTask.id,
        TaskStatus.IN_PROGRESS,
      );

      expect(tasksService.getTaskById).toHaveBeenCalled();
      expect(tasksService.getTaskById).toHaveBeenCalledWith(1);
      expect(existedTask.save).toHaveBeenCalled();
    });

    it('Validate save result', async () => {
      tasksService.getTaskById = jest.fn().mockResolvedValue(existedTask);
      existedTask.save = jest.fn().mockResolvedValue(updatedTask);

      const result = await tasksService.updateTaskStatusById(
        existedTask.id,
        TaskStatus.IN_PROGRESS,
      );

      expect(result.status).toEqual(TaskStatus.IN_PROGRESS);
    });
  });
});
