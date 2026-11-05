// 切换指定任务的完成状态，只影响 id 匹配的那一项，其余任务保持原样。
export function toggleTask(tasks, id) {
  return tasks.map(task => ({
    ...task,
    completed: task.id === id ? !task.completed : task.completed,
  }));
}
