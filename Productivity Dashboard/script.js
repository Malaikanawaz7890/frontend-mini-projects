var tasks = JSON.parse(localStorage.getItem("taskNestTasks")) || [];

var savedNote = localStorage.getItem("taskNestNote");

if (savedNote) {
    document.getElementById("notesInput").value = savedNote;
}

/* DATE */

var today = new Date();

var options = {
    weekday: "long",
    month: "short",
    day: "numeric"
};

document.getElementById("currentDate").innerHTML =
    today.toLocaleDateString("en-US", options);


/* OPEN FORM */

function openTaskForm() {

    var form = document.getElementById("taskForm");

    form.classList.toggle("show");

    if (form.classList.contains("show")) {
        document.getElementById("taskInput").focus();
    }
}


/* ADD TASK */

function addTask() {

    var taskInput = document.getElementById("taskInput");
    var priorityInput = document.getElementById("priorityInput");

    var taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }

    var newTask = {
        id: Date.now(),
        name: taskText,
        priority: priorityInput.value,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();

    taskInput.value = "";

    displayTasks();
}


/* SAVE TASKS */

function saveTasks() {
    localStorage.setItem("taskNestTasks", JSON.stringify(tasks));
}


/* DISPLAY TASKS */

function displayTasks() {

    var taskList = document.getElementById("taskList");
    var emptyState = document.getElementById("emptyState");

    var searchText =
        document.getElementById("searchInput").value.toLowerCase();

    var filter =
        document.getElementById("filterInput").value;

    taskList.innerHTML = "";

    var visibleTasks = [];

    for (var i = 0; i < tasks.length; i++) {

        var task = tasks[i];

        var matchesSearch =
            task.name.toLowerCase().indexOf(searchText) !== -1;

        var matchesFilter = true;

        if (filter === "pending") {
            matchesFilter = task.completed === false;
        }

        if (filter === "completed") {
            matchesFilter = task.completed === true;
        }

        if (matchesSearch && matchesFilter) {
            visibleTasks.push(task);
        }
    }

    if (visibleTasks.length === 0) {
        emptyState.style.display = "block";
    } else {
        emptyState.style.display = "none";
    }

    for (var j = 0; j < visibleTasks.length; j++) {

        var currentTask = visibleTasks[j];

        var taskItem = document.createElement("div");
        taskItem.className = "task-item";

        var check = document.createElement("div");
        check.className = "check";

        if (currentTask.completed) {
            check.className = "check done";
            check.innerHTML = "✓";
        }

        check.onclick = (function(id) {
            return function() {
                toggleTask(id);
            };
        })(currentTask.id);

        var info = document.createElement("div");
        info.className = "task-info";

        var taskName = document.createElement("div");
        taskName.className = "task-name";

        if (currentTask.completed) {
            taskName.className = "task-name completed";
        }

        taskName.innerHTML = currentTask.name;

        var priority = document.createElement("span");
        priority.className = "priority " + currentTask.priority;
        priority.innerHTML = currentTask.priority;

        info.appendChild(taskName);
        info.appendChild(priority);

        var deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.innerHTML = "🗑";

        deleteButton.onclick = (function(id) {
            return function() {
                deleteTask(id);
            };
        })(currentTask.id);

        taskItem.appendChild(check);
        taskItem.appendChild(info);
        taskItem.appendChild(deleteButton);

        taskList.appendChild(taskItem);
    }

    updateStats();
}


/* COMPLETE TASK */

function toggleTask(id) {

    for (var i = 0; i < tasks.length; i++) {

        if (tasks[i].id === id) {
            tasks[i].completed = !tasks[i].completed;
            break;
        }
    }

    saveTasks();
    displayTasks();
}


/* DELETE TASK */

function deleteTask(id) {

    var newTasks = [];

    for (var i = 0; i < tasks.length; i++) {

        if (tasks[i].id !== id) {
            newTasks.push(tasks[i]);
        }
    }

    tasks = newTasks;

    saveTasks();
    displayTasks();
}


/* UPDATE STATS */

function updateStats() {

    var total = tasks.length;
    var completed = 0;

    for (var i = 0; i < tasks.length; i++) {

        if (tasks[i].completed) {
            completed++;
        }
    }

    var pending = total - completed;

    var percentage = 0;

    if (total > 0) {
        percentage = Math.round((completed / total) * 100);
    }

    document.getElementById("totalTasks").innerHTML = total;
    document.getElementById("completedTasks").innerHTML = completed;
    document.getElementById("pendingTasks").innerHTML = pending;
    document.getElementById("progressPercent").innerHTML =
        percentage + "%";

    document.getElementById("circlePercent").innerHTML =
        percentage + "%";

    document.getElementById("progressText").innerHTML =
        completed + " / " + total;

    document.getElementById("progressBar").style.width =
        percentage + "%";

    var degrees = percentage * 3.6;

    document.querySelector(".progress-circle").style.background =
        "conic-gradient(#9b65f6 " +
        degrees +
        "deg, #eee9f5 " +
        degrees +
        "deg)";
}


/* SAVE NOTE */

function saveNote() {

    var note = document.getElementById("notesInput").value;

    localStorage.setItem("taskNestNote", note);

    var message = document.getElementById("noteMessage");

    message.innerHTML = "✓ Note saved successfully";

    setTimeout(function() {
        message.innerHTML = "";
    }, 2000);
}


/* ENTER KEY */

document.getElementById("taskInput").addEventListener(
    "keypress",
    function(event) {

        if (event.key === "Enter") {
            addTask();
        }

    }
);


/* START */

displayTasks();