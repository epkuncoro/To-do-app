document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task-input");
  const addTaskBtn = document.getElementById("add-task-btn");
  const taskList = document.getElementById("task-list");

  const loadTasks = () => {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    if (tasks) {
      tasks.forEach((task) => {
        createTaskElement(task.text, task.completed);
      });
    }
  };

  const saveTasks = () => {
    const tasks = [];
    taskList.querySelectorAll("li").forEach((li) => {
      const taskText = li.querySelector("span").textContent;
      const isCompleted = li.querySelector(".checkbox").checked;
      tasks.push({ text: taskText, completed: isCompleted });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  const createTaskElement = (taskText, isCompleted = false) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <input type="checkbox" class="checkbox" ${isCompleted ? "checked" : ""} />
      <span>${taskText}</span>
      <div class="task-buttons">
        <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
        <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;

    li.querySelector(".checkbox").addEventListener("change", () => {
      li.classList.toggle("completed", li.querySelector(".checkbox").checked);
      saveTasks();
    });

    li.querySelector(".delete-btn").addEventListener("click", () => {
      li.remove();
      saveTasks();
    });

    li.querySelector(".edit-btn").addEventListener("click", () => {
      const taskSpan = li.querySelector("span");
      const currentText = taskSpan.textContent;

      const inputEdit = document.createElement("input");
      inputEdit.type = "text";
      inputEdit.value = currentText;
      inputEdit.classList.add("edit-input");

      taskSpan.replaceWith(inputEdit);
      inputEdit.focus();

      const saveEdit = () => {
        const newText = inputEdit.value.trim();
        if (newText) {
          taskSpan.textContent = newText;
        }
        inputEdit.replaceWith(taskSpan);
        saveTasks();
      };

      inputEdit.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          saveEdit();
        }
      });

      li.querySelector(".edit-btn").addEventListener("click", saveEdit, {
        once: true,
      });
    });

    taskList.appendChild(li);
    if (isCompleted) {
      li.classList.add("completed");
    }
  };

  const addTask = (event) => {
    event.preventDefault();
    const taskText = taskInput.value.trim();
    if (!taskText) {
      return;
    }
    createTaskElement(taskText);
    taskInput.value = "";
    saveTasks();
  };

  addTaskBtn.addEventListener("click", addTask);
  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addTask(e);
    }
  });

  loadTasks();
});
