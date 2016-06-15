'use strict()';

var list      = document.getElementById('todo-items');
var itemInput = document.getElementById('todo-add-new');
var toDoObjects = [];

var addToDo = function() {
  var text = itemInput.value;

  addToDoToDom(text);
  addToDoToStorage(text);
};

var addToDoToDom = function(text) {
  var item        = document.createElement('li');
  var listLength  = list.children.length;
  var itemText    = '<label class="todo__text"><input type="checkbox" id="too-doo-check_' + (listLength + 1) + '" /><span class="px1">' + text + '</span></label>';
  var itemAction  = '<span class="todo__remove"><button type="button" class="btn btn--icon"><i class="icon icon--remove"></i></button></span>';

  item.innerHTML = itemText + itemAction;
  item.id = 'too-doo_' + (listLength + 1);
  item.classList.add('todo__item');
  item.setAttribute('data-status', 'incomplete');
  list.appendChild(item);
  itemInput.value = '';
};

var addToDoToStorage = function(text) {
  toDoObjects.push(text);
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

  // remember completed state when loading to do items in dom
};

var completeToDo = function(event) {
  var check = event.target;
  var toDo = check.parentElement.parentElement;
  var toDoStatus = toDo.getAttribute('data-status');

  if (toDo && toDo.matches('li')) {
    toDo.classList.toggle('todo__item--complete');
    
    if (toDoStatus === 'incomplete') {
      toDo.setAttribute('data-status', 'complete');
    } else {
      toDo.setAttribute('data-status', 'incomplete');
    }

    var toDoItems = list.innerHTML;
    localStorage.setItem('toDoItems', toDoItems);
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
};

window.onload = function(){
  toDoHandlers();
};

loadToDosFromStorage();
