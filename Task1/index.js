//VARIABLES
const today = document.querySelector('#today');
const date = new Date();
const newTaskBtn = document.querySelector('.newTaskBtn');
const newTaskForm = document.querySelector('.newTask');
const addTaskBtn = document.querySelector('.addTaskBtn');
const taskInput = document.querySelector('#addTask');
const categoryInput = document.querySelector('#addCategory');
const itemList = document.querySelector('.itemList');
const itemFilter = document.querySelector('.filter');
const category = document.querySelector('span');
const clearAllBtn = document.querySelector('#clearAllBtn');

// Getting today's date automatically
let options = {
	weekday: 'short',
	year: 'numeric',
	month: 'short',
	day: 'numeric',
};
today.textContent = date.toLocaleString('default', options);

// today.textContent = new Intl.DateTimeFormat('default', options).format(date);

function displayItems() {
	let div;
	const tasksFromStorage = getTaskFromStorage();
	const categoryFromStorage = getCategoryFromStorage();

	for (const task of tasksFromStorage) {
		const category = categoryFromStorage[tasksFromStorage.indexOf(task)];
		div = createDiv1(task, category);

		addTaskToDOM(div);
	}

	checkUi();
}

function addNewTask() {
	newTaskForm.classList.toggle('hidden');
	if (!newTaskForm.classList.contains('hidden')) {
		newTaskBtn.style.backgroundColor = '#e00a0a';
	} else {
		newTaskBtn.style.backgroundColor = '#0b2f9f';
	}
}

function onAddTaskSubmit(e) {
	e.preventDefault();
	const newTask = taskInput.value;
	const newCategory = categoryInput.value;
	const div = createDiv1(newTask, newCategory);

	// 	//validate input
	if (newTask === '' || newCategory === 'none' || newCategory === '') {
		alert('Please enter a Task and a Category');
		return;
	}

	addTaskToDOM(div);
	addTaskToStorage(taskInput.value, categoryInput.value);

	taskInput.value = '';

	checkUi();
}

function addTaskToDOM(task) {
	//create task
	const li = document.createElement('li');
	const button = createBtn('remove-item btn-link text-red');

	li.appendChild(task);
	li.appendChild(button);

	itemList.appendChild(li);
}

function addTaskToStorage(task, category) {
	const tasksFromStorage = getTaskFromStorage();
	const categoryFromStorage = getCategoryFromStorage();

	tasksFromStorage.push(task);
	categoryFromStorage.push(category);

	localStorage.setItem('tasks', JSON.stringify(tasksFromStorage));
	localStorage.setItem('category', JSON.stringify(categoryFromStorage));
}

function getTaskFromStorage() {
	let tasksFromStorage;

	if (localStorage.getItem('tasks') === null) {
		tasksFromStorage = [];
	} else {
		tasksFromStorage = JSON.parse(localStorage.getItem('tasks'));
	}

	return tasksFromStorage;
}

function getCategoryFromStorage() {
	let categoryFromStorage;

	if (localStorage.getItem('category') === null) {
		categoryFromStorage = [];
	} else {
		categoryFromStorage = JSON.parse(localStorage.getItem('category'));
	}

	return categoryFromStorage;
}

//create div
// function createDiv(classes) {
// 	const newTask = taskInput.value;
// 	const newCategory = categoryInput.value;

// 	//validate input
// 	if (newTask === '' || newCategory === 'none' || newCategory === '') {
// 		alert('Please enter a Task and a Category');
// 		return;
// 	}

// 	const div = document.createElement('div');
// 	div.className = classes;
// 	const span = createSpan(classes);

// 	function createSpan() {
// 		const span = document.createElement('span');
// 		span.className = classes;
// 		span.textContent = newCategory;

// 		return span;
// 	}

// 	div.appendChild(document.createTextNode(newTask));
// 	div.appendChild(span);
// 	return div;
// }

function createDiv1(task, category) {
	const div = document.createElement('div');
	div.className = 'item';
	const span = createSpan();

	function createSpan() {
		const span = document.createElement('span');
		// span.className = classes;
		span.textContent = category;

		return span;
	}

	div.appendChild(document.createTextNode(task));
	div.appendChild(span);

	return div;
}

function createBtn(classes) {
	const btn = document.createElement('button');
	btn.className = classes;
	const icon = createIcon('fa-solid fa-xmark');

	function createIcon(classes) {
		const icon = document.createElement('i');
		icon.className = classes;

		return icon;
	}

	btn.appendChild(icon);
	return btn;
}

function onClickRemove(e) {
	if (e.target.parentElement.classList.contains('remove-item')) {
		removeItem(e.target.parentElement.parentElement);
	}
}

function removeItem(task) {
	if (confirm('Have you completed the task?')) {
		//remove task from storage
		task.remove();

		//remove task from storage
		removeTaskFromStorage(task.firstChild.firstChild.textContent);
		removeCategoryFromStorage(task.firstChild.lastChild.textContent);
		checkUi();
	}
}

function removeTaskFromStorage(task) {
	let tasksFromStorage = getTaskFromStorage();

	//filter out item to be removed
	tasksFromStorage = tasksFromStorage.filter((i) => i !== task);

	//reset to localstorage
	localStorage.setItem('tasks', JSON.stringify(tasksFromStorage));
}

function removeCategoryFromStorage(category) {
	let categoryFromStorage = getCategoryFromStorage();

	//filter out item to be removed
	categoryFromStorage = categoryFromStorage.filter((i) => i !== category);

	//reset to localstorage
	localStorage.setItem('category', JSON.stringify(categoryFromStorage));
}

function filterCategory(e) {
	const items = itemList.querySelectorAll('li');
	const text = e.target.value.toLowerCase();

	items.forEach((item) => {
		const categoryName =
			item.firstElementChild.firstElementChild.textContent.toLowerCase();

		if (categoryName.indexOf(text) != -1) {
			item.style.display = 'flex';
		} else {
			item.style.display = 'none';
		}
	});
}

function clearAllTasks() {
	if (confirm('Are you done with all the tasks?')) {
		while (itemList.firstChild) {
			itemList.removeChild(itemList.firstChild);
		}
	}

	//clear Items from Storage
	localStorage.removeItem('tasks');
	localStorage.removeItem('category');

	checkUi();
}

function checkUi() {
	const items = itemList.querySelectorAll('li');

	if (items.length === 0) {
		newTaskForm.classList.add('hidden');
		itemFilter.classList.add('hidden');
		clearAllBtn.classList.add('hidden');
	} else {
		itemFilter.classList.remove('hidden');
		clearAllBtn.classList.remove('hidden');
	}
}

//Initialize App
function init() {
	//EVENT LISTENERS
	newTaskBtn.addEventListener('click', addNewTask);
	newTaskForm.addEventListener('submit', onAddTaskSubmit);
	itemList.addEventListener('click', onClickRemove);
	itemFilter.addEventListener('input', filterCategory);
	clearAllBtn.addEventListener('click', clearAllTasks);
	document.addEventListener('DOMContentLoaded', displayItems);

	checkUi();
}

init();
