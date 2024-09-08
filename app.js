// script.js

document.addEventListener('DOMContentLoaded', () => {
  const loadingScreen = document.getElementById('loadingScreen');
  const taskInput = document.getElementById('taskInput');
  const addTaskBtn = document.getElementById('addTaskBtn');
  const taskList = document.getElementById('taskList');
  const filterSelect = document.getElementById('filter');

  // Hide loading screen once everything is loaded
    window.addEventListener('load', () => {
        loadingScreen.style.display = 'none';
    });

  // Load tasks from local storage
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  renderTasks(tasks);

  addTaskBtn.addEventListener('click', () => {
      const taskValue = taskInput.value.trim();
      if (taskValue) {
          const newTask = { text: taskValue, completed: false, id: Date.now() };
          tasks.push(newTask);
          saveTasks(tasks);
          renderTasks(tasks);
          taskInput.value = '';
      }
  });

  filterSelect.addEventListener('change', () => {
      renderTasks(tasks);
  });

  function renderTasks(tasks) {
      const filter = filterSelect.value;
      taskList.innerHTML = '';

      tasks
          .filter(task => {
              if (filter === 'completed') return task.completed;
              if (filter === 'pending') return !task.completed;
              return true;
          })
          .forEach(task => {
              const li = document.createElement('li');
              li.className = task.completed ? 'completed' : '';
              li.dataset.id = task.id;

              li.innerHTML = `
                  <span>${task.text}</span>
                  <div>
                      <button class="edit-btn">Edit</button>
                      <button class="delete-btn">Delete</button>
                      <button class="toggle-btn">${task.completed ? 'Mark as Pending' : 'Mark as Completed'}</button>
                  </div>
              `;

              taskList.appendChild(li);
          });

      attachEventListeners();
  }

  function attachEventListeners() {
      document.querySelectorAll('.delete-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
              const id = parseInt(e.target.closest('li').dataset.id);
              tasks = tasks.filter(task => task.id !== id);
              saveTasks(tasks);
              renderTasks(tasks);
          });
      });

      document.querySelectorAll('.edit-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
              const li = e.target.closest('li');
              const id = parseInt(li.dataset.id);
              const task = tasks.find(t => t.id === id);
              const newText = prompt('Edit task:', task.text);
              if (newText !== null) {
                  task.text = newText;
                  saveTasks(tasks);
                  renderTasks(tasks);
              }
          });
      });

      document.querySelectorAll('.toggle-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
              const id = parseInt(e.target.closest('li').dataset.id);
              const task = tasks.find(t => t.id === id);
              task.completed = !task.completed;
              saveTasks(tasks);
              renderTasks(tasks);
          });
      });
  }

  function saveTasks(tasks) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
  }
});
