let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];
let currentFilter = 'all';

const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const count = document.getElementById('count');
const clearDone = document.getElementById('clearDone');
const filterButtons = document.querySelectorAll('.filter');
addBtn.onclick = function() {
    let text = taskInput.value.trim();
    if (text === '') return;

    tasks.push({
        id: Date.now(),
        text: text,
        done: false
    });

    taskInput.value = '';
    save();
    show();
};

taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') addBtn.click();
});

function save() {
    localStorage.setItem('myTasks', JSON.stringify(tasks));
}

function toggle(id) {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
            tasks[i].done = !tasks[i].done;
        }
    }
    save();
    show();
}
function remove(id) {
    tasks = tasks.filter(function(t) {
        return t.id !== id;
    });
    save();
    show();
}
function show() {
    let list = tasks;

    if (currentFilter === 'active') {
        list = tasks.filter(function(t) { return !t.done; });
    } else if (currentFilter === 'done') {
        list = tasks.filter(function(t) { return t.done; });
    }

    taskList.innerHTML = '';

    if (list.length === 0) {
        taskList.innerHTML = '<li class="empty">No tasks here</li>';
    } else {
        list.forEach(function(task) {
            let li = document.createElement('li');
            if (task.done) li.className = 'done';

            li.innerHTML = `
                <input type="checkbox" ${task.done ? 'checked' : ''}>
                <span>${escapeText(task.text)}</span>
                <button class="delete">x</button>
            `;

            li.querySelector('input').onchange = function() {
                toggle(task.id);
            };

            li.querySelector('.delete').onclick = function() {
                remove(task.id);
            };

            taskList.appendChild(li);
        });
    }

    let left = tasks.filter(function(t) { return !t.done; }).length;
    count.textContent = left + ' task' + (left !== 1 ? 's' : '') + ' left';
}

function escapeText(text) {
    let div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

filterButtons.forEach(function(btn) {
    btn.onclick = function() {
        filterButtons.forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        show();
    };
});

clearDone.onclick = function() {
    tasks = tasks.filter(function(t) { return !t.done; });
    save();
    show();
};

show();