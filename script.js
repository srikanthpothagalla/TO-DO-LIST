const inputBox = document.getElementById('input-box');
const deadlineBox = document.getElementById('deadline-box');
const listContainer = document.getElementById('list-container');

function addTask() {
  let task = inputBox.value.trim();
  let deadline = deadlineBox.value;
  if (task === '' || deadline === '') return;

  const listItem = document.createElement('li');
  listItem.innerHTML = `${task} <span class='datetime'>(${getCurrentDateTime()})</span> 
                        <span class='countdown' data-deadline='${deadline}'></span>`;

  let span = document.createElement('button');
  span.innerHTML = '×';
  span.classList.add('delete');
  span.onclick = function () {
    listItem.remove();
    saveData();
  };
  listItem.appendChild(span);
  listContainer.appendChild(listItem);

  inputBox.value = '';
  deadlineBox.value = '';
  saveData();
  updateCountdown();
}

function getCurrentDateTime() {
  return new Date().toLocaleString();
}

function keyDown(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    addTask();
  }
}

listContainer.addEventListener('click', function(e) {
  if (e.target.tagName === 'LI') {
    e.target.classList.toggle('checked');
    saveData();
  }
});

function saveData() {
  const tasks = [];
  document.querySelectorAll('#list-container li').forEach(li => {
    tasks.push({
      text: li.childNodes[0].textContent.trim(),
      datetime: li.querySelector('.datetime').textContent,
      deadline: li.querySelector('.countdown').getAttribute('data-deadline'),
      checked: li.classList.contains('checked')
    });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadData() { 
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  listContainer.innerHTML = '';
  tasks.forEach(task => {
    const listItem = document.createElement('li');
    if (task.checked) listItem.classList.add('checked');
    listItem.innerHTML = `${task.text} <span class='datetime'>${task.datetime}</span> 
                          <span class='countdown' data-deadline='${task.deadline}'></span>`;

    let span = document.createElement('button');
    span.innerHTML = '×';
    span.classList.add('delete');
    span.onclick = function () {
      listItem.remove();
      saveData();
    };
    listItem.appendChild(span);
    listContainer.appendChild(listItem);
  });
  updateCountdown();
}

function updateCountdown() {
  setInterval(() => {
    document.querySelectorAll('.countdown').forEach(span => {
      const deadline = new Date(span.getAttribute('data-deadline'));
      const now = new Date();
      const diff = deadline - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        span.innerText = `Time Left: ${days}d ${hours}h ${minutes}m ${seconds}s`;
      } else {
        span.innerText = "Time Expired!";
        span.classList.add('time-expired');
      }
    });
  }, 1000);
}

loadData();
