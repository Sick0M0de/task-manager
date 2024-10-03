document.addEventListener('DOMContentLoaded', loadTasks);

// Function to add a task
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    const priorityInput = document.getElementById('priorityInput').value;

    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }

    const taskList = document.getElementById('taskList');
    const li = document.createElement('li');
    li.textContent = `${taskText} (${priorityInput})`;

    // Add Complete, Edit, and Delete buttons
    const completeButton = createButton('Complete', 'complete', () => {
        li.classList.toggle('completed');
        saveTasks();
    });

    const editButton = createButton('Edit', 'edit', () => {
        editTask(li);
    });

    const deleteButton = createButton('Delete', 'delete', () => {
        taskList.removeChild(li);
        saveTasks();
    });

    li.appendChild(completeButton);
    li.appendChild(editButton);
    li.appendChild(deleteButton);
    taskList.appendChild(li);

    saveTasks();
    taskInput.value = '';
}

// Create button utility function
function createButton(text, className, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = className;
    button.addEventListener('click', onClick);
    return button;
}

// Edit task functionality
function editTask(taskItem) {
    const taskText = taskItem.firstChild.textContent;
    const [task, priority] = taskText.split(' (');

    const taskInput = document.getElementById('taskInput');
    const priorityInput = document.getElementById('priorityInput');

    taskInput.value = task;
    priorityInput.value = priority.slice(0, -1); // Remove closing ')'

    taskItem.remove();
    saveTasks();
}

// Save tasks to localStorage
function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#taskList li').forEach(li => {
        const task = li.firstChild.textContent.split(' (')[0];
        const priority = li.firstChild.textContent.split(' (')[1].slice(0, -1);
        const completed = li.classList.contains('completed');
        tasks.push({ task, priority, completed });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.forEach(task => {
        const taskList = document.getElementById('taskList');
        const li = document.createElement('li');
        li.textContent = `${task.task} (${task.priority})`;

        if (task.completed) {
            li.classList.add('completed');
        }

        const completeButton = createButton('Complete', 'complete', () => {
            li.classList.toggle('completed');
            saveTasks();
        });

        const editButton = createButton('Edit', 'edit', () => {
            editTask(li);
        });

        const deleteButton = createButton('Delete', 'delete', () => {
            taskList.removeChild(li);
            saveTasks();
        });

        li.appendChild(completeButton);
        li.appendChild(editButton);
        li.appendChild(deleteButton);
        taskList.appendChild(li);
    });
}

// Clear all tasks
function clearAllTasks() {
    document.getElementById('taskList').innerHTML = '';
    localStorage.removeItem('tasks');
}

// Sort tasks by completion status
function sortTasks() {
    const taskList = document.getElementById('taskList');
    const tasks = Array.from(taskList.children);

    tasks.sort((a, b) => {
        const aCompleted = a.classList.contains('completed');
        const bCompleted = b.classList.contains('completed');
        return aCompleted - bCompleted; // Uncompleted first
    });

    taskList.innerHTML = '';
    tasks.forEach(task => taskList.appendChild(task));
}
