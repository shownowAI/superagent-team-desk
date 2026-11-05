import test from 'node:test';
import assert from 'node:assert/strict';
import { toggleTask, buildFollowupBrief } from './tasks.mjs';

const makeTasks = () => [
  { id: 1, title: '演示脚本定稿', owner: '产品同学', deadline: '周四 18:00', completed: false },
  { id: 2, title: '整理上手反馈', owner: '设计同学', deadline: '周五 10:00', completed: false },
  { id: 3, title: '演示页面走查', owner: '研发同学', deadline: '周五 12:00', completed: false },
];

test('完成演示脚本时，只改变该任务，其他两项继续待跟进', () => {
  const result = toggleTask(makeTasks(),1);
  assert.deepEqual(result.map(task => task.completed),[true,false,false]);
  assert.deepEqual(result.filter(task => !task.completed).map(task => task.id),[2,3]);
});

test('撤销一项已完成任务时，不影响其他任务状态', () => {
  const tasks = makeTasks();
  tasks[1].completed = true;
  const result = toggleTask(tasks,2);
  assert.deepEqual(result.map(task => task.completed),[false,false,false]);
});

test('更新任务不改写传入的数组、标题、负责人和截止时间', () => {
  const tasks = makeTasks();
  const before = structuredClone(tasks);
  const result = toggleTask(tasks,1);
  assert.deepEqual(tasks,before);
  assert.notStrictEqual(result,tasks);
  assert.deepEqual(result.map(({completed,...info}) => info),tasks.map(({completed,...info}) => info));
});

test('简报列出未完成事项的名称、负责人和截止时间，不含已完成事项', () => {
  const tasks = makeTasks();
  tasks[1].completed = true;
  const brief = buildFollowupBrief(tasks);
  assert.equal(brief,'演示脚本定稿｜产品同学｜周四 18:00\n演示页面走查｜研发同学｜周五 12:00');
  assert.ok(!brief.includes('整理上手反馈'));
  assert.ok(!brief.includes('设计同学'));
});

test('全部完成时，简报写明当前没有待跟进事项', () => {
  const tasks = makeTasks().map(task => ({ ...task, completed: true }));
  assert.equal(buildFollowupBrief(tasks),'当前没有待跟进事项');
});

test('生成简报不改写传入数组，也不遗漏任何未完成事项', () => {
  const tasks = makeTasks();
  const before = structuredClone(tasks);
  const brief = buildFollowupBrief(tasks);
  assert.deepEqual(tasks,before);
  assert.equal(brief.split('\n').length,3);
});
