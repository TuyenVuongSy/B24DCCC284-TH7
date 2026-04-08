import { useState, useEffect } from 'react';

export interface Task {
  id: string;
  name: string;
  assignee: string;
  priority: 'Thấp' | 'Trung bình' | 'Cao';
  deadline: string; // ISO string
  status: 'Chưa làm' | 'Đang làm' | 'Đã xong';
}

const LOCAL_STORAGE_KEY = 'taskData';

export default () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const storedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedTasks) {
      try {
        setTasks(JSON.parse(storedTasks));
      } catch (error) {
        console.error('Failed to parse tasks from local storage', error);
      }
    }
  }, []);

  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newTasks));
  };

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = { ...task, id: Math.random().toString(36).substr(2, 9) };
    saveTasks([...tasks, newTask]);
  };

  const editTask = (id: string, updatedFields: Partial<Task>) => {
    const newTasks = tasks.map((task) => (task.id === id ? { ...task, ...updatedFields } : task));
    saveTasks(newTasks);
  };

  const deleteTask = (id: string) => {
    const newTasks = tasks.filter((task) => task.id !== id);
    saveTasks(newTasks);
  };

  return {
    tasks,
    addTask,
    editTask,
    deleteTask,
  };
};
