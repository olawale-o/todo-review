import { isStorage, getStorage, setStorage } from './storage.js';
import {
  dragStart, dragEnter, dragLeave, dragEnd, drop,
} from './interactive.js';
import change from './change.js';
import {
  addNewTodo, clearAllCompletedTodos, editTodo, onDeleteTodo,
} from './add-remove.js';

import './stylesheet/style.css';

const todoKey = 'TODOS';
let todos = [];

if (isStorage(todoKey)) {
  todos = getStorage(todoKey);
} else {
  setStorage(todoKey, todos);
  todos = getStorage(todoKey);
}

const todoTasks = document.querySelector('#todo-tasks');

const target = document.getElementById('todo-tasks');
const items = target.getElementsByTagName('li');

const dragAll = () => {
  for (let a = 0; a < items.length; a += 1) {
    const i = items[a];
    i.draggable = true;
    i.addEventListener('dragstart', dragStart);
    i.addEventListener('dragenter', dragEnter);
    i.addEventListener('dragleave', dragLeave);
    i.addEventListener('dragend', dragEnd);
    i.addEventListener('dragover', (event) => {
      event.preventDefault();
      i.style.opacity = 0.2;
    });
    i.addEventListener('drop', drop);
  }
};

const createComponent = ({ element, className, id }) => {
  const tag = document.createElement(element);
  tag.setAttribute('id', id || element);
  tag.setAttribute('class', className);

  return tag;
};

const createTodo = (todo) => {
  const li = createComponent({ element: 'li', className: 'todo-list', id: `id-${todo.index}` });
  const div = createComponent({ element: 'div', className: 'field todo-list__task' });
  const label = createComponent({ element: 'label', className: 'label', id: `label-${todo.index}` });
  const checkbox = createComponent({ element: 'input', className: 'checkbox' });
  checkbox.setAttribute('type', 'checkbox');
  checkbox.setAttribute('name', 'todo-task');
  checkbox.checked = todo.completed === true;
  const span = createComponent({ element: 'span', className: 'todo-list__text', id: `span-${todo.index}` });
  span.textContent = todo.description;
  span.style.textDecoration = todo.completed === true ? 'line-through' : 'none';
  label.appendChild(checkbox);
  const sp = createComponent({ element: 'span', className: 'checkmark' });
  label.appendChild(sp);
  const bin = createComponent({ element: 'i', className: 'bx bx-trash-alt bin hide', id: `bin-${todo.index}` });
  const icon = createComponent({ element: 'i', className: 'bx bx-dots-vertical-rounded move', id: `icon-${todo.index}` });
  icon.onmousedown = dragAll;
  checkbox.onchange = () => {
    change(todo, todos);
    if (todo.completed) {
      span.style.textDecoration = 'line-through';
    } else {
      span.style.textDecoration = 'none';
    }
  };

  div.appendChild(label);
  div.appendChild(span);
  div.appendChild(icon);
  div.appendChild(bin);
  li.appendChild(div);

  const toggleButtons = () => {
    bin.classList.toggle('hide');
    icon.classList.toggle('hide');
  };

  span.addEventListener('click', () => {
    span.setAttribute('contenteditable', true);
    span.focus();
  });

  bin.addEventListener('mousedown', (event) => {
    todos = onDeleteTodo(event.target.id, todos);

    todoTasks.innerHTML = '';
    todos.forEach((td, i) => {
      td.index = i + 1;
    });

    todos.forEach((task) => {
      todoTasks.appendChild(createTodo(task));
    });
    setStorage('TODOS', todos);
  });
  let completed = null;
  span.addEventListener('focus', (event) => {
    toggleButtons();
    if (event.target.style.textDecoration === 'line-through') {
      span.style.textDecorationColor = 'transparent';
      completed = true;
    }
    li.classList.add('focus');
  });

  span.addEventListener('blur', (event) => {
    toggleButtons();
    if (completed) {
      event.target.style.textDecorationColor = 'initial';
      completed = null;
    }
    editTodo(event.target, todos);
    li.classList.remove('focus');
    span.removeAttribute('contenteditable');
  });

  return li;
};

todos.forEach((task) => {
  todoTasks.appendChild(createTodo(task));
});

const addkey = document.querySelector('#add');
const task = document.querySelector('#task');

addkey.addEventListener('click', () => {
  const newTodo = addNewTodo(task, todos);
  todoTasks.appendChild(createTodo(newTodo));
  task.value = '';
});

task.addEventListener('keydown', (event) => {
  if (event.which === 13) {
    const newTodo = addNewTodo(task, todos);
    todoTasks.appendChild(createTodo(newTodo));
    task.value = '';
  }
});

const trashAll = document.querySelector('#trash-all');
trashAll.addEventListener('click', () => {
  const tds = clearAllCompletedTodos(todos);
  todoTasks.innerHTML = '';
  tds.forEach((task) => {
    todoTasks.appendChild(createTodo(task));
  });
});
