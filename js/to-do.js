'use strict()';

var list      = document.getElementById('todo-items');
var itemInput = document.getElementById('todo-add-new');
var toDoObjects = [];

var addToDo = function() {
  var todo = {
    text: itemInput.value,
    status: 'incomplete',
    id: toDoObjects.length + 1
  };

  addToDoToDom(todo);
  addToDoToStorage(todo);
};

var addToDoToDom = function(todo) {
  var item        = document.createElement('li');
  var listLength  = list.children.length;
  var itemText    = '<label class="todo__text"><input type="checkbox" id="too-doo-check_' + todo.id + '"';
  if (todo.status === 'complete') {
    itemText += 'checked=checked';
  }
  itemText += '/><span class="px1">' + todo.text + '</span></label>';
  var itemAction  = '<span class="todo__remove"><button type="button" class="btn btn--icon" id="button-' + todo.id + '"><i class="icon icon--remove"></i></button></span>';

  item.innerHTML = itemText + itemAction;
  item.id = 'too-doo_' + (listLength + 1);
  item.classList.add('todo__item');
  item.setAttribute('data-status', todo.status);
  item.setAttribute('data-id', todo.id);
  list.appendChild(item);
  itemInput.value = '';
};

var addToDoToStorage = function(todo) {
  toDoObjects.push(todo);
  localStorage.setItem('toDoObjects', JSON.stringify(toDoObjects));
};

var loadToDosFromStorage = function() {
  var str = localStorage.getItem('toDoObjects');
  if (str) {
    toDoObjects = JSON.parse(str);
  }

  // construct dom html from toDoObjects
  for (var i=0; i<toDoObjects.length; i++) {
    addToDoToDom(toDoObjects[i]);
  }
};

var completeToDo = function(event) {
  var check = event.target;
  var toDo = check.parentElement.parentElement;
  var toDoStatus = toDo.getAttribute('data-status');
  var toDoId = parseInt(toDo.getAttribute('data-id'));

  if (toDo && toDo.matches('li')) {
   
    if (toDoStatus === 'incomplete') {
      toDoStatus = 'complete';
    } else {
      toDoStatus = 'incomplete';
    }

    toDo.setAttribute('data-status', toDoStatus);

    for (var i = 0; i < toDoObjects.length; i++) {
      if (toDoObjects[i].id === toDoId) {
        toDoObjects[i].status = toDoStatus;
      }
    }

    localStorage.setItem('toDoObjects', JSON.stringify(toDoObjects));
  }
};

var removeToDo = function(event) {
  var button = event.target;
  var toDo = button.parentElement.parentElement.parentElement;
  var toDoId = parseInt(toDo.getAttribute('data-id'));

  if (toDo && toDo.matches('li')) {
    // 1. remove the li from the dom
    list.removeChild(toDo);
    // 2. remove the todo object with matching id from toDoObjects
    for (var i = 0; i < toDoObjects.length; i++) {
      if (toDoObjects[i].id === toDoId) {
        toDoObjects.splice(i, 1);
      }
    }
    // 3. set toDoObjects into localStorage as JSON
    localStorage.setItem('toDoObjects', JSON.stringify(toDoObjects));
  }
};

var validateToDo = function(event) {
  event.preventDefault();
  if(!itemInput.value) {
    document.getElementById('error').innerHTML = 'Please enter a value!';
  } else {
    addToDo();
  }
};

var clearToDos = function(event) {
  event.preventDefault();
  window.localStorage.clear();
  location.reload();
  return false;
};

document.getElementById('clear-todos').addEventListener('click', clearToDos, false);

document.getElementById('btn-submit').addEventListener('click', validateToDo, false);

itemInput.onkeydown = function(event) {
  if(event.keyCode == 13) {
    validateToDo(event);
    return false;
  }
};

var toDoHandlers = function() {
  list.addEventListener('change', completeToDo, false);
  list.addEventListener('click', removeToDo, false);
};

window.onload = function(){
  toDoHandlers();
};

loadToDosFromStorage();
