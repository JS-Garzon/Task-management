import { MessagesInfoService } from './../shared/services/messages-info.service';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../auth/auth.service';
import { Task } from '../shared/models/task.model';
import { TaskList } from '../shared/models/taskList.model';
import { TasksService } from './tasks.service';
import { DeleteButtonComponent } from '../shared/components/delete-button/delete-button.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    ToastModule,
    TableModule,
    ReactiveFormsModule,
    DragDropModule,
    NgIf,
    DeleteButtonComponent
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export default class TasksComponent {
  taskList: TaskList[] = [
    { title: 'To Do', status: 'OPEN', tasks: [] },
    { title: 'In Progress', status: 'IN_PROGRESS', tasks: [] },
    { title: 'Done', status: 'DONE', tasks: [] },
  ];
  hidden: boolean = true;
  taskForm: FormGroup;
  indexListSelectedTask!: number;
  selectedTask: any | null = null;
  userInfo!: any;
  popupIsHidden: boolean = false;
  deleteTaskSelected!: any;

  constructor(
    private tasksService: TasksService,
    private fb: FormBuilder,
    private authService: AuthService,
    private messagesInfoService: MessagesInfoService
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.getTasks();
    this.getUserInfo();
  }

  ngOnDestroy() {
    this.taskList = [];
  }

  getUserInfo() {
    this.userInfo = this.authService.getUserIdFromToken();
  }

  getTasks() {
    this.tasksService.getTasks().subscribe((tasks) => {
      this.organizeTasks(tasks);
    });
  }

  organizeTasks(tasks: Task[]) {
    this.taskList.map((list) => {
      for (let i = 0; i < tasks.length; i++) {
        if (list.status === tasks[i].status) {
          list.tasks.push(tasks[i]);
        }
      }
    });
  }

  showModalEdit(task: Task) {
    this.selectedTask = task || null;
    if (this.selectedTask) {
      this.taskForm.patchValue({
        title: this.selectedTask.title,
        description: this.selectedTask.description,
      });
    }
    this.hidden = false;
  }

  showModalCreate(i: number) {
    this.indexListSelectedTask = i;
    this.selectedTask = null;
    this.taskForm.reset();
    this.hidden = false;
  }

  findTaskIndex(tasks: Task[]) {
    return tasks.findIndex((task) => task._id === this.selectedTask._id);
  }

  findTaskAndListIndex() {
    for (let i = 0; i < this.taskList.length; i++) {
      if (this.taskList[i].status === this.selectedTask.status) {
        const taskIndex = this.findTaskIndex(this.taskList[i].tasks);
        if (taskIndex !== -1) {
          return { taskIndex, listIndex: i };
        }
      }
    }
    return { taskIndex: -1, listIndex: -1 };
  }

  closeModal() {
    this.hidden = true;
  }

  submitForm() {
    if (this.taskForm.valid) {
      if (this.selectedTask) {
        this.updateTask();
      } else {
        this.createTask();
      }
      this.closeModal();
    }
    this.selectedTask = null;
  }

  updateTask() {
    this.tasksService
      .updateTask(this.selectedTask._id, this.taskForm.value)
      .subscribe(
        (response) => {
          this.tasksService.messageSuccess('Task updated successfully');
        },
        (error) => {
          console.error('Update error:', error);
        }
      );
    this.updateTaskInList();
  }

  updateDragAndDrop(id: string, status: string, payload: Task) {
    this.tasksService.updateTask(id, { status }).subscribe(
      (response) => {
        this.tasksService.messageSuccess('Task updated successfully');
      },
      (error) => {
        console.error('Update error:', error);
      }
    );
  }

  createTask() {
    const newTask = this.taskForm.value;
    Object.assign(newTask, {
      user: this.userInfo.sub,
      status: this.taskList[this.indexListSelectedTask].status,
    });
    this.tasksService.createTask(newTask).subscribe(
      (dataCreate) => {
        this.tasksService.messageSuccess('Task created successfully');
        this.addTaskInList(dataCreate);
      },
      (error) => {
        console.error('Update error:', error);
      }
    );
  }

  addTaskInList(dataCreate: any) {
    this.taskList[this.indexListSelectedTask].tasks.push(dataCreate);
  }

  updateTaskInList(): void {
    const { taskIndex, listIndex } = this.findTaskAndListIndex();
    if (taskIndex !== -1 && listIndex !== -1) {
      Object.assign(this.selectedTask, this.taskForm.value);
      this.taskList[listIndex].tasks[taskIndex] = this.selectedTask;
    } else {
      console.log('Task no encontrado');
    }
  }

  deleteTask(id: string, indexTask: number, indexList: number) {
    this.tasksService.delete(id).subscribe(
      (config) => {
        this.tasksService.messageSuccess('Task deleted successfully');
        this.taskList[indexList].tasks.splice(indexTask, 1);
      },
      (error) => {
        console.error('Update error:', error);
      }
    );
    this.messagesInfoService.messageInfo('You have accepted');
    this.closePopup();
  }

  drop(i: number, event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.updateDragAndDrop(
        event.container.data[event.currentIndex]._id,
        this.taskList[i].status,
        event.container.data[event.currentIndex]
      );
    }
  }

  showPopup(id: string, indexTask: number, indexList: number) {
    this.popupIsHidden = true;
    document.body.style.overflow = 'hidden';
    this.deleteTaskSelected = { id, indexTask, indexList };
  }



  closePopup() {
    this.popupIsHidden = false;
    document.body.style.overflow = '';
  }
}
