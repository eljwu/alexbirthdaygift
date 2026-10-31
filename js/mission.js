
const MISSION_PAGES = {
  1: "trivia.html",
  2: "frogger.html",
  3: "final.html"
};

const STORAGE_KEY = "birthdayMissionProgress";

const defaultProgress = {
  trivia: false,
  frogger: false,
  final: false
};

function getProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (!saved || typeof saved !== "object") {
      return { ...defaultProgress };
    }

    return {
      trivia: saved.trivia === true,
      frogger: saved.frogger === true,
      final: saved.final === true
    };
  } catch {
    return { ...defaultProgress };
  }
}

function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function updateMissionCard(number, unlocked, completed) {
  const card = document.getElementById(`mission${number}`);
  const status = card.querySelector(".mission-status");
  const button = card.querySelector(".mission-button");

  card.classList.toggle("locked", !unlocked);
  card.classList.toggle("completed", completed);

  button.disabled = !unlocked;

  if (completed) {
    status.textContent = "COMPLETED";
    button.textContent = "REPLAY MISSION →";
  } else if (unlocked) {
    status.textContent = "AVAILABLE";
    button.textContent =
      number === 3 ? "REVEAL FINAL MISSION →" : "BEGIN MISSION →";
  } else {
    status.textContent = "LOCKED";
    button.textContent =
      number === 3 ? "CLASSIFIED" : "MISSION LOCKED";
  }
}

function updateMissionScreen() {
  const progress = getProgress();

  // Unlock missions in sequence.
  updateMissionCard(1, true, progress.trivia);
  updateMissionCard(2, progress.trivia, progress.frogger);
  updateMissionCard(3, progress.frogger, progress.final);

  const completedCount = [
    progress.trivia,
    progress.frogger,
    progress.final
  ].filter(Boolean).length;

  document.getElementById("progressText").textContent =
    `${completedCount} / 3 COMPLETE`;

  document.getElementById("progressFill").style.width =
    `${(completedCount / 3) * 100}%`;
}

document.querySelectorAll(".mission-button").forEach(button => {
  button.addEventListener("click", () => {
    if (button.disabled) return;

    const missionNumber = Number(button.dataset.mission);
    window.location.href = MISSION_PAGES[missionNumber];
  });
});

updateMissionScreen();

// Refresh the hub when returning through browser history.
window.addEventListener("pageshow", updateMissionScreen);
