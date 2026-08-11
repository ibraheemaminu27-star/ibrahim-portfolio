// ===============================
// ELEMENTS
// ===============================

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");

const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

const filters = document.querySelectorAll(".filter");

const clearCompletedBtn =
    document.getElementById("clearCompleted");

const completedCount =
    document.getElementById("completedCount");

const totalCount =
    document.getElementById("totalCount");

const progressFill =
    document.getElementById("progressFill");

const themeBtn =
    document.getElementById("themeBtn");

const editModal =
    document.getElementById("editModal");

const editInput =
    document.getElementById("editInput");

const saveEdit =
    document.getElementById("saveEdit");

const closeModal =
    document.getElementById("closeModal");


// ===============================
// DATA
// ===============================

let tasks =
    JSON.parse(localStorage.getItem("ibrahimTasks")) || [];

let currentFilter = "all";

let editingTaskId = null;


// ===============================
// SAVE TASKS
// ===============================

function saveTasks() {

    localStorage.setItem(
        "ibrahimTasks",
        JSON.stringify(tasks)
    );

}


// ===============================
// CREATE TASK
// ===============================

function createTask() {

    const text =
        taskInput.value.trim();

    if (text === "") {

        taskInput.focus();

        return;
    }

    const task = {

        id: Date.now(),

        text: text,

        completed: false,

        createdAt: new Date().toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric",
                year: "numeric"
            }
        )

    };

    tasks.unshift(task);

    saveTasks();

    taskInput.value = "";

    renderTasks();

    taskInput.focus();
}


// ===============================
// RENDER TASKS
// ===============================

function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "pending") {

        filteredTasks =
            tasks.filter(task => !task.completed);

    }

    if (currentFilter === "completed") {

        filteredTasks =
            tasks.filter(task => task.completed);

    }


    if (filteredTasks.length === 0) {

        emptyMessage.style.display = "block";

        if (tasks.length > 0) {

            if (currentFilter === "pending") {

                emptyMessage.querySelector("h2").textContent =
                    "No pending tasks";

                emptyMessage.querySelector("p").textContent =
                    "All your tasks are completed.";

            }

            if (currentFilter === "completed") {

                emptyMessage.querySelector("h2").textContent =
                    "No completed tasks";

                emptyMessage.querySelector("p").textContent =
                    "Complete a task to see it here.";

            }

            if (currentFilter === "all") {

                emptyMessage.querySelector("h2").textContent =
                    "No tasks yet";

                emptyMessage.querySelector("p").textContent =
                    "Add your first task above.";

            }

        }

    } else {

        emptyMessage.style.display = "none";

    }


    filteredTasks.forEach(task => {

        const li =
            document.createElement("li");

        li.className = "task";

        if (task.completed) {

            li.classList.add("completed");

        }


        li.innerHTML = `

            <button
                class="task-check"
                data-action="complete"
                data-id="${task.id}"
                aria-label="Complete task">
            </button>


            <span class="task-text">
                ${escapeHTML(task.text)}
            </span>


            <span class="task-date">
                ${task.createdAt}
            </span>


            <div class="task-actions">

                <button
                    class="edit-btn"
                    data-action="edit"
                    data-id="${task.id}"
                    title="Edit task">
                    ✎
                </button>

                <button
                    class="delete-btn"
                    data-action="delete"
                    data-id="${task.id}"
                    title="Delete task">
                    ×
                </button>

            </div>

        `;


        taskList.appendChild(li);

    });


    updateStats();

}


// ===============================
// ESCAPE HTML
// ===============================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// ===============================
// COMPLETE TASK
// ===============================

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            return {
                ...task,
                completed: !task.completed
            };

        }

        return task;

    });

    saveTasks();

    renderTasks();
}


// ===============================
// DELETE TASK
// ===============================

function deleteTask(id) {

    tasks =
        tasks.filter(task => task.id !== id);

    saveTasks();

    renderTasks();
}


// ===============================
// OPEN EDIT MODAL
// ===============================

function openEditModal(id) {

    const task =
        tasks.find(task => task.id === id);

    if (!task) {
        return;
    }

    editingTaskId = id;

    editInput.value = task.text;

    editModal.classList.add("show");

    setTimeout(() => {

        editInput.focus();

        editInput.select();

    }, 100);

}


// ===============================
// SAVE EDIT
// ===============================

function saveTaskEdit() {

    const newText =
        editInput.value.trim();

    if (
        newText === "" ||
        editingTaskId === null
    ) {
        return;
    }

    tasks = tasks.map(task => {

        if (task.id === editingTaskId) {

            return {
                ...task,
                text: newText
            };

        }

        return task;

    });

    saveTasks();

    closeEditModal();

    renderTasks();
}


// ===============================
// CLOSE EDIT MODAL
// ===============================

function closeEditModal() {

    editModal.classList.remove("show");

    editingTaskId = null;

    editInput.value = "";
}


// ===============================
// CLEAR COMPLETED
// ===============================

function clearCompleted() {

    tasks =
        tasks.filter(task => !task.completed);

    saveTasks();

    renderTasks();
}


// ===============================
// UPDATE STATISTICS
// ===============================

function updateStats() {

    const total =
        tasks.length;

    const completed =
        tasks.filter(task => task.completed).length;

    totalCount.textContent = total;

    completedCount.textContent = completed;


    let percentage = 0;

    if (total > 0) {

        percentage =
            Math.round((completed / total) * 100);

    }

    progressFill.style.width =
        `${percentage}%`;
}


// ===============================
// FILTERS
// ===============================

filters.forEach(filter => {

    filter.addEventListener("click", () => {

        filters.forEach(button => {

            button.classList.remove("active");

        });

        filter.classList.add("active");

        currentFilter =
            filter.dataset.filter;

        renderTasks();

    });

});


// ===============================
// ADD BUTTON
// ===============================

addBtn.addEventListener(
    "click",
    createTask
);


// ===============================
// ENTER KEY
// ===============================

taskInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            createTask();

        }

    }
);


// ===============================
// TASK ACTIONS
// ===============================

taskList.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest("button");

        if (!button) {
            return;
        }

        const id =
            Number(button.dataset.id);

        const action =
            button.dataset.action;


        if (action === "complete") {

            toggleTask(id);

        }


        if (action === "delete") {

            deleteTask(id);

        }


        if (action === "edit") {

            openEditModal(id);

        }

    }
);


// ===============================
// CLEAR COMPLETED
// ===============================

clearCompletedBtn.addEventListener(
    "click",
    clearCompleted
);


// ===============================
// EDIT MODAL
// ===============================

saveEdit.addEventListener(
    "click",
    saveTaskEdit
);

closeModal.addEventListener(
    "click",
    closeEditModal
);


editInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            saveTaskEdit();

        }

        if (event.key === "Escape") {

            closeEditModal();

        }

    }
);


// Close modal when clicking outside

editModal.addEventListener(
    "click",
    event => {

        if (event.target === editModal) {

            closeEditModal();

        }

    }
);


// ===============================
// DARK MODE
// ===============================

themeBtn.addEventListener(
    "click",
    () => {

        document.body.classList.toggle("dark");

        const darkMode =
            document.body.classList.contains("dark");

        localStorage.setItem(
            "ibrahimDarkMode",
            darkMode
        );

        themeBtn.textContent =
            darkMode ? "☀" : "☾";

    }
);


// Load saved theme

const savedDarkMode =
    localStorage.getItem("ibrahimDarkMode");

if (savedDarkMode === "true") {

    document.body.classList.add("dark");

    themeBtn.textContent = "☀";

}


// ===============================
// INITIAL RENDER
// ===============================

renderTasks();
