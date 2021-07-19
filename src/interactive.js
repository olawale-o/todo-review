import { getStorage, setStorage } from './storage.js';

const target = document.getElementById('todo-tasks');
target.classList.add('todo-tasks');
const items = target.getElementsByTagName('li');
let current = null;

export function dragStart() {
  current = this;
  for (let b = 0; b < items.length; b += 1) {
    const item = items[b];
    if (item === current) {
      item.classList.add('border');
    }
  }
}

export function dragEnter() {
  if (this !== current) {
    this.style.opacity = 0.2;
  }
}

export function dragLeave(event) {
  event.preventDefault();
  if (this === current) {
    this.style.visibility = 'hidden';
  } else {
    this.style.opacity = 1;
  }
}

export function dragEnd() {
  for (let a = 0; a < items.length; a += 1) {
    const item = items[a];
    item.classList.remove('border');
    this.style.visibility = 'visible';
    item.style.opacity = 1;
  }
}

export function drop(event) {
  event.preventDefault();
  if (this !== current) {
    let currentPosiiton = 0;
    let droppedPosition = 0;
    for (let i = 0; i < items.length; i += 1) {
      if (current === items[i]) {
        currentPosiiton = i;
      }
      if (this === items[i]) {
        droppedpos = i;
      }
    }
    if (currentPosiiton < droppedPosition) {
      this.parentNode.insertBefore(current, this.nextSibling);
    } else {
      this.parentNode.insertBefore(current, this);
    }
  }
  const movingIndex = parseInt(current.id.split('-')[1], 10);
  const staticIndex = parseInt(this.id.split('-')[1], 10);
  const todos = getStorage('TODOS');
  if (movingIndex !== staticIndex) {
    const movedTodo = todos.find((todo) => todo.index === movingIndex);
    const tds = todos.filter((todo) => todo.index !== movingIndex);
    tds.splice(staticIndex - 1, 0, movedTodo);
    tds.forEach((td, i) => {
      td.index = i + 1;
    });
    for (let b = 0; b < items.length; b += 1) {
      const it = items[b];
      it.id = `id-${b + 1}`;
      const span = it.querySelector('span');
      span.id = `task-${b + 1}`;
    }
    setStorage('TODOS', tds);
  }
}
