import { Task } from "./task.model";

export interface TaskList {
  title: string;
  status: string;
  tasks: Task[];
}
