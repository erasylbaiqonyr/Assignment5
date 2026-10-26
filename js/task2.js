
let completedCount = 0;

for (const task of tasks) {
    if (task.completed === true) {
        completedCount++;
    }
}

const progressPercent = tasks.length === 0
    ? 0
    : Math.round((completedCount / tasks.length) * 100);

document.querySelector("#progressBar").className = "progress-bar";

const progressLevel = Math.round(progressPercent / 10) * 10;

document.querySelector("#progressBar").classList.add(
    `progress-${progressLevel}`
);

document.querySelector("#progressText").textContent =
    `${completedCount} of ${tasks.length} tasks completed`;
