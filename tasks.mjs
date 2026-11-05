// 切换指定任务的完成状态，只影响 id 匹配的那一项，其余任务保持原样。
export function toggleTask(tasks, id) {
  return tasks.map(task => ({
    ...task,
    completed: task.id === id ? !task.completed : task.completed,
  }));
}

// 生成待跟进简报文字：按「名称｜负责人｜截止时间」逐行列出未完成事项；
// 已完成事项不出现，全部完成时返回固定提示。不改写传入数组。
export function buildFollowupBrief(tasks) {
  const pending = tasks.filter(task => !task.completed);
  if (pending.length === 0) return '当前没有待跟进事项';
  return pending.map(task => `${task.title}｜${task.owner}｜${task.deadline}`).join('\n');
}
