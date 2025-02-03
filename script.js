
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const completedTaskList = document.getElementById("completedTaskList");
const completedCountSpan = document.getElementById("completedCount");


document.addEventListener("DOMContentLoaded", loadTasks);
addTaskBtn.addEventListener("click", addTask);
taskList.addEventListener("click", handleTaskActions);
completedTaskList.addEventListener("click", handleTaskActions);


function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    const task = { text: taskText, completed: false };
    saveTask(task);
    renderTask(task, false);

    taskInput.value = "";
    updateGoalCounter();
}


function renderTask(task, isCompleted) {
    const li = document.createElement("li");
    li.innerHTML = `
        <span class="${task.completed ? "completed" : ""}">${task.text}</span>
        <button class="tick-btn">✔</button>
        <button class="delete-btn">X</button>
    `;

    if (isCompleted) {
        completedTaskList.appendChild(li);
    } else {
        taskList.appendChild(li);
    }
}


function handleTaskActions(event) {
    const target = event.target;
    if (target.classList.contains("delete-btn")) {
        deleteTask(target.parentElement);
    } else if (target.classList.contains("tick-btn")) {
        toggleTask(target.parentElement);
    }
}


function toggleTask(taskElement) {
    const taskText = taskElement.querySelector("span").textContent;
    let tasks = getTasks();

    tasks = tasks.map(task => {
        if (task.text === taskText) {
            task.completed = !task.completed;
        }
        return task;
    });

    saveTasks(tasks);
    taskElement.remove();
    updateGoalCounter();
    loadTasks();
}


function deleteTask(taskElement) {
    const taskText = taskElement.querySelector("span").textContent;
    let tasks = getTasks().filter(task => task.text !== taskText);

    saveTasks(tasks);
    taskElement.remove();
    updateGoalCounter();
}


function saveTask(task) {
    const tasks = getTasks();
    tasks.push(task);
    saveTasks(tasks);
}

function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getTasks() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
}

function loadTasks() {
    taskList.innerHTML = "";
    completedTaskList.innerHTML = "";
    
    getTasks().forEach(task => {
        renderTask(task, task.completed);
    });

    updateGoalCounter();
}


function updateGoalCounter() {
    const completedTasks = getTasks().filter(task => task.completed).length;
    completedCountSpan.textContent = completedTasks;

    if (completedTasks >= 2) {
        goalCounter.textContent = "🎉 Goal Completed!";
        goalCounter.style.color = "#ff5e62";
        celebrate();
    } else {
        goalCounter.textContent = `Goal: ${completedTasks}/2 Completed`;
        goalCounter.style.color = "#4CAF50";
    }
}


function celebrate() {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const colors = ["#ff0000", "#ff8000", "#ffff00", "#00ff00", "#00ffff", "#0000ff", "#ff00ff"];

    (function frame() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return;

        const particle = document.createElement("div");
        particle.classList.add("confetti");
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.left = Math.random() * 100 + "vw";
        particle.style.animationDuration = Math.random() * 3 + 2 + "s";
        document.body.appendChild(particle);

        setTimeout(() => particle.remove(), 3000);
        requestAnimationFrame(frame);
    })();
}