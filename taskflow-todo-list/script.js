var taskInput = document.getElementById("taskInput");
var prioritySelect = document.getElementById("prioritySelect");
var addBtn = document.getElementById("addBtn");

var taskList = document.getElementById("taskList");

var searchInput = document.getElementById("searchInput");

var totalCount = document.getElementById("totalCount");
var pendingCount = document.getElementById("pendingCount");
var completedCount = document.getElementById("completedCount");

var footerCount = document.getElementById("footerCount");

var clearCompleted = document.getElementById("clearCompleted");

var themeBtn = document.getElementById("themeBtn");

var filters = document.querySelectorAll(".filter");

var currentFilter = "all";

var editingId = null;


/* LOAD TASKS */

var savedTasks = localStorage.getItem("taskflowTasks");

if (savedTasks) {

    tasks = JSON.parse(savedTasks);

} else {

    tasks = [];

}


/* SAVE TASKS */

function saveTasks() {

    localStorage.setItem(
        "taskflowTasks",
        JSON.stringify(tasks)
    );
}


/* ADD / UPDATE TASK */

function addTask() {

    var text = taskInput.value.trim();

    var priority = prioritySelect.value;


    if (text === "") {

        alert("Please enter a task.");

        return;
    }


    /* EDIT */

    if (editingId !== null) {

        for (var i = 0; i < tasks.length; i++) {

            if (tasks[i].id === editingId) {

                tasks[i].text = text;

                tasks[i].priority = priority;

                break;

            }

        }


        editingId = null;

        addBtn.textContent = "Add";

    }

    /* NEW TASK */

    else {

        var newTask = {

            id: Date.now(),

            text: text,

            priority: priority,

            completed: false,

            date: new Date().toLocaleDateString()

        };


        tasks.push(newTask);

    }


    taskInput.value = "";

    prioritySelect.value = "medium";


    saveTasks();

    renderTasks();
}


/* RENDER */

function renderTasks() {

    taskList.innerHTML = "";


    var searchText = searchInput.value.toLowerCase();

    var filteredTasks = [];


    for (var i = 0; i < tasks.length; i++) {

        var task = tasks[i];

        var matchesFilter = false;

        var matchesSearch = task.text
            .toLowerCase()
            .indexOf(searchText) !== -1;


        if (currentFilter === "all") {

            matchesFilter = true;

        }

        else if (
            currentFilter === "pending" &&
            task.completed === false
        ) {

            matchesFilter = true;

        }

        else if (
            currentFilter === "completed" &&
            task.completed === true
        ) {

            matchesFilter = true;

        }


        if (matchesFilter && matchesSearch) {

            filteredTasks.push(task);

        }

    }


    if (filteredTasks.length === 0) {

        showEmptyState();

    }

    else {

        for (var j = 0; j < filteredTasks.length; j++) {

            createTaskElement(filteredTasks[j]);

        }

    }


    updateStats();
}


/* CREATE TASK */

function createTaskElement(task) {

    var taskDiv = document.createElement("div");

    taskDiv.className = "task";


    if (task.completed) {

        taskDiv.className += " completed";

    }


    var checkbox = document.createElement("div");

    checkbox.className = "checkbox";


    checkbox.onclick = function () {

        toggleTask(task.id);

    };


    var info = document.createElement("div");

    info.className = "task-info";


    var text = document.createElement("div");

    text.className = "task-text";

    text.textContent = task.text;


    var date = document.createElement("div");

    date.className = "task-date";

    date.textContent = "Added: " + task.date;


    info.appendChild(text);

    info.appendChild(date);


    var priority = document.createElement("span");

    priority.className =
        "priority " + task.priority;

    priority.textContent = task.priority;


    var actions = document.createElement("div");

    actions.className = "actions";


    var editButton = document.createElement("button");

    editButton.className = "edit-btn";

    editButton.innerHTML = "✎";

    editButton.title = "Edit task";


    editButton.onclick = function () {

        editTask(task.id);

    };


    var deleteButton = document.createElement("button");

    deleteButton.className = "delete-btn";

    deleteButton.innerHTML = "✕";

    deleteButton.title = "Delete task";


    deleteButton.onclick = function () {

        deleteTask(task.id);

    };


    actions.appendChild(editButton);

    actions.appendChild(deleteButton);


    taskDiv.appendChild(checkbox);

    taskDiv.appendChild(info);

    taskDiv.appendChild(priority);

    taskDiv.appendChild(actions);


    taskList.appendChild(taskDiv);
}


/* COMPLETE */

function toggleTask(id) {

    for (var i = 0; i < tasks.length; i++) {

        if (tasks[i].id === id) {

            tasks[i].completed =
                !tasks[i].completed;

            break;

        }

    }


    saveTasks();

    renderTasks();
}


/* DELETE */

function deleteTask(id) {

    var newTasks = [];


    for (var i = 0; i < tasks.length; i++) {

        if (tasks[i].id !== id) {

            newTasks.push(tasks[i]);

        }

    }


    tasks = newTasks;


    saveTasks();

    renderTasks();
}


/* EDIT */

function editTask(id) {

    for (var i = 0; i < tasks.length; i++) {

        if (tasks[i].id === id) {

            taskInput.value = tasks[i].text;

            prioritySelect.value =
                tasks[i].priority;

            editingId = id;

            addBtn.textContent = "Update";

            taskInput.focus();

            break;

        }

    }
}


/* CLEAR COMPLETED */

clearCompleted.onclick = function () {

    var newTasks = [];


    for (var i = 0; i < tasks.length; i++) {

        if (tasks[i].completed === false) {

            newTasks.push(tasks[i]);

        }

    }


    tasks = newTasks;


    saveTasks();

    renderTasks();
};


/* FILTER */

for (var i = 0; i < filters.length; i++) {

    filters[i].onclick = function () {

        for (var j = 0; j < filters.length; j++) {

            filters[j].classList.remove("active");

        }


        this.classList.add("active");


        currentFilter =
            this.getAttribute("data-filter");


        renderTasks();

    };

}


/* SEARCH */

searchInput.oninput = function () {

    renderTasks();

};


/* ENTER KEY */

taskInput.addEventListener(
    "keypress",
    function (event) {

        if (event.key === "Enter") {

            addTask();

        }

    }
);


/* ADD BUTTON */

addBtn.onclick = addTask;


/* STATISTICS */

function updateStats() {

    var total = tasks.length;

    var completed = 0;

    var pending = 0;


    for (var i = 0; i < tasks.length; i++) {

        if (tasks[i].completed) {

            completed++;

        }

        else {

            pending++;

        }

    }


    totalCount.textContent = total;

    pendingCount.textContent = pending;

    completedCount.textContent = completed;


    footerCount.textContent =
        total +
        (total === 1 ? " task" : " tasks");
}


/* EMPTY STATE */

function showEmptyState() {

    var title = "No tasks here";

    var message =
        "Add your first task to get started.";


    if (currentFilter === "completed") {

        message = "You have no completed tasks.";

    }

    else if (currentFilter === "pending") {

        message = "You have no pending tasks.";

    }


    if (searchInput.value !== "") {

        message = "No matching tasks found.";

    }


    taskList.innerHTML =

        '<div class="empty-state">' +

        '<div class="empty-icon">✓</div>' +

        '<h3>' + title + '</h3>' +

        '<p>' + message + '</p>' +

        '</div>';
}


/* DARK / LIGHT MODE */

themeBtn.onclick = function () {

    document.body.classList.toggle("light");


    if (document.body.classList.contains("light")) {

        themeBtn.textContent = "🌙";

        localStorage.setItem(
            "taskflowTheme",
            "light"
        );

    }

    else {

        themeBtn.textContent = "☀️";

        localStorage.setItem(
            "taskflowTheme",
            "dark"
        );

    }

};


/* LOAD THEME */

var savedTheme =
    localStorage.getItem("taskflowTheme");


if (savedTheme === "light") {

    document.body.classList.add("light");

    themeBtn.textContent = "🌙";

}


/* INITIAL DISPLAY */

renderTasks();