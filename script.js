`use strict`;

const containerTasks = document.querySelector(".tasks");
const containerPrompt = document.querySelector(".task-prompt");
const containerBlur = document.querySelector(".blur");
const taskListObj = document.querySelectorAll(".task");

const labelTotal = document.querySelector(".total");
const labelCompleted = document.querySelector(".completed");
const labelTime = document.querySelector(".timer");
let activeLabelTaskTimer = document.querySelector(".task-timer");

const btnAdd = document.querySelector(".btn--add");
const btnPromptClose = document.querySelector(".btn--close");
const btnPromptSubmit = document.querySelector(".btn--prompt-submit");
const btnTime = document.querySelectorAll(".btn--time");
const btnIncreaseTime = document.querySelectorAll(".btn--time-increase");
const btnDecreaseTime = document.querySelectorAll(".btn--time-decrease");
let btnPlayPause = document.querySelectorAll(".btn-pause");
let btnEdit = document.querySelectorAll(".btn-edit");

const inputTask = document.querySelector(".input--task");
const inputTime = document.querySelector(".input--time");
const inputHours = document.querySelector(".input--hours");
const inputMinutes = document.querySelector(".input--minutes");
const inputSeconds = document.querySelector(".input--seconds");

const iconTask = document.querySelector(".progress-bar-icon-progress--task");
const iconTime = document.querySelector(".progress-bar-icon-progress--time");

const tasks = [];
let mainTimer;

// Showing Prompt
const showPrompt = function () {
  containerBlur.classList.add("visible");
  containerPrompt.classList.add("visible");
};

// Hiding Prompt
const hidePrompt = function () {
  containerBlur.classList.remove("visible");
  containerPrompt.classList.remove("visible");
  inputTask.value = "";
  inputHours.value = inputMinutes.value = inputSeconds.value = "00";
};

// Covert seconds to timestamp string and return
const convertToTimeStamp = function (sec) {
  const hours = `${Math.trunc(sec / 3600)}`.padStart(2, 0);
  const minutes = `${Math.trunc(((sec / 3600) % 1) * 60)}`.padStart(2, 0);
  const seconds = `${sec % 60}`.padStart(2, 0);

  if (hours !== "00") return `${hours}:${minutes}:${seconds}`;
  return `${minutes}:${seconds}`;
};

// Extract number of seconds from input prompt
const getInputSeconds = function () {
  const hours = +`${inputHours.value}` * 60 * 60;
  const minutes = +`${inputMinutes.value}` * 60;
  const seconds = +`${inputSeconds.value}`;

  return hours + minutes + seconds;
};

// Display tasks in DOM
const displayTasks = function (tasks) {
  containerTasks.innerHTML = "";
  tasks.forEach(function (task, i) {
    containerTasks.insertAdjacentHTML(
      "beforeend",
      `    <div class="task">
            <div class="task-title">
              <span class="task-number">${i + 1}</span>${task.task}
            </div>
            <div class="task-timer">${convertToTimeStamp(task.time)}</div>
            <div class="task-control">
              <button class="btn btn-pause">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="#000000"
                  viewBox="0 0 256 256"
                  class="icon icon--pause"
                >
                  <path
                    d="M184,64V192a8,8,0,0,1-16,0V64a8,8,0,0,1,16,0Zm40-8a8,8,0,0,0-8,8V192a8,8,0,0,0,16,0V64A8,8,0,0,0,224,56Zm-80,72a15.76,15.76,0,0,1-7.33,13.34L48.48,197.49A15.91,15.91,0,0,1,24,184.15V71.85A15.91,15.91,0,0,1,48.48,58.51l88.19,56.15A15.76,15.76,0,0,1,144,128Zm-16.18,0L40,72.08V183.93Z"
                  ></path>
                </svg>
              </button>
              <button class="btn btn-edit">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="#000000"
                  viewBox="0 0 256 256"
                  class="icon icon--edit"
                >
                  <path
                    d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z"
                  ></path>
                </svg>
              </button>
              <button class="btn btn-discard">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="#000000"
                  viewBox="0 0 256 256"
                  class="icon icon--discard"
                >
                  <path
                    d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"
                  ></path>
                </svg>
              </button>
            </div>
          </div>`
    );
  });

  // Changing definition of list of buttons
  btnPlayPause = document.querySelectorAll(".btn-pause");
  btnEdit = document.querySelectorAll(".btn-edit");

  //For evey element, check for clicks
  btnPlayPause?.forEach((btn) => {
    btn.addEventListener("click", function () {
      updateProgress();

      let taskNumber = +`${
        btn.parentElement.parentElement.querySelector(".task-number")
          .textContent
      }`;

      let taskActivated = tasks.find((task) => task.active);

      taskNumber--;

      if (!tasks[taskNumber].active) {
        // debugger;
        activeLabelTaskTimer =
          btn.parentElement.parentElement.querySelector(".task-timer");

        //if any other task is already active, set it to false and clear interval if it exists
        if (taskActivated) {
          setTaskActive(taskActivated, true);
        }

        // Make the current task active, if its not complete yet, start timer (false && truthy)
        setTaskActive(tasks[taskNumber]) && startTimer(taskNumber);
      } else {
        // debugger;
        setTaskActive(tasks[taskNumber], true);
        startTimer(taskNumber, true);
      }
    });
  });

  btnEdit?.forEach((btn) => {
    btn.addEventListener("click", function () {
      let taskNumber = +`${
        btn.parentElement.parentElement.querySelector(".task-number")
          .textContent
      }`;

      taskNumber--;
      const currTask = tasks[taskNumber];

      const currTimeStamp = convertToTimeStamp(currTask.time).split(":");

      let taskActivated = tasks.find((task) => task.active);
      if (taskActivated) setTaskActive(taskActivated, true);

      showPrompt();
      inputTask.value = currTask.task;
      if (currTimeStamp.length === 3) {
        inputHours.value = currTimeStamp[0];
        inputMinutes.value = currTimeStamp[1];
        inputSeconds.value = currTimeStamp[2];
      } else if (currTimeStamp.length === 2) {
        inputHours.value = "00";
        inputMinutes.value = currTimeStamp[0];
        inputSeconds.value = currTimeStamp[1];
      }
    });
  });
};

const setTaskActive = function (task, stop) {
  if (stop) {
    // debugger;
    if (mainTimer) clearInterval(mainTimer);
    return (task.active = false);
  }

  if (!task.completed) {
    task.active = true;
    return true;
  } else {
    alert("Cannot activate a completed task");
    task.active = false;
    return false;
  }
};

// const updateTime(timeStamp) {
//   const
// }

// const set`TaskCompl`ete = function (task) {
//   task.completed = true;
//   task.active = false;
// };

const startTimer = function (i, stop) {
  const taskActivated = tasks[i];

  const stepTimer = function () {
    // debugger;
    if (taskActivated.time === 0 || stop) {
      // debugger;
      clearInterval(mainTimer);
      updateTime(taskActivated.time);
      taskActivated.completed = true;
      taskActivated.active = false;
      updateUI(tasks);
    } else if (taskActivated.time > 0) {
      taskActivated.time--;
      updateTime(taskActivated.time);
    }
    // console.log(currentTime);
    // updateUI(tasks);
  };

  if (!stop) {
    stepTimer();
    mainTimer = setInterval(stepTimer, 1000);
  }
};

const updateProgress = function () {
  // debugger;
  let taskFraction = `${Math.round(
    533.8 -
      (Number(labelCompleted.textContent) / Number(labelTotal.textContent)) *
        533.8
  )}px`;

  if (taskFraction === "NaNpx") {
    taskFraction = `534px`;
  }

  const taskActivated = tasks.find((task) => task.active);

  const timeFraction = taskActivated
    ? `${Math.round(
        533.8 - (taskActivated.time / taskActivated.timeOrg) * 533.8
      )}px`
    : `534px`;

  iconTask.style.strokeDashoffset = taskFraction;
  iconTime.style.strokeDashoffset = timeFraction;

  // console.log(taskFraction);
  // console.log(
  //   Number(labelCompleted.textContent) / Number(labelTotal.textContent)
  // );
  // console.log(timeFraction);
};

const updateTime = function (time) {
  const currTime = convertToTimeStamp(time);
  labelTime.textContent = currTime;
  // debugger;
  activeLabelTaskTimer.textContent = currTime;
  updateProgress();
};

const updateUI = function (tasks) {
  labelTotal.textContent = tasks.length;
  labelCompleted.textContent = tasks.filter(
    (taskObj) => taskObj.completed
  ).length;

  const taskActivated = tasks.find((task) => task.active);

  if (tasks.some((task) => task.active)) {
    updateTime(taskActivated.time);
    // console.log("uh");
  } else {
    labelTime.textContent = `00:00:00`;
  }

  // if (task)
  displayTasks(tasks);
};

btnAdd.addEventListener("click", showPrompt);
btnPromptClose.addEventListener("click", hidePrompt);
containerBlur.addEventListener("click", hidePrompt);

btnTime.forEach(function (btnElem) {
  btnElem.addEventListener("click", function (e) {
    const targetInput = document.getElementById(
      e.currentTarget.getAttribute("aria-details")
    );
    if (btnElem.classList.contains("btn--time-increase")) {
      targetInput.value++;
      targetInput.value = targetInput.value.padStart(2, "0");
    } else if (
      btnElem.classList.contains("btn--time-decrease") &&
      targetInput.value > 0
    ) {
      targetInput.value--;
      targetInput.value = targetInput.value.padStart(2, "0");
    }
  });
});

btnPromptSubmit.addEventListener("click", function (e) {
  e.preventDefault();
  const task = inputTask.value;
  const time = getInputSeconds();

  if (time) {
    const taskObj = {
      task,
      time,
      timeOrg: time,
      completed: false,
      active: false,
    };
    tasks.push(taskObj);
    hidePrompt();
    updateUI(tasks);
  } else {
    alert("Enter a time greater than 60 seconds");
  }
});
containerTasks.innerHTML = "";
// updateProgress();

updateUI(tasks);
