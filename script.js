// ==============================
// Easy-to-edit date night config
// ==============================
const EVENT_PASSWORD = "Dotun";
const FOOD_PASSWORD = "Maia";
const RECIPIENT_EMAIL = "oladotunadigun07@gmail.com";
const DATE_NIGHT = "2026-05-24T20:00:00-03:00";

const EVENT_OPTIONS = [
  {
    title: "Kahoot quizzes",
    tag: "We both take turns picking topics",
  },
  {
    title: "Skribbl.io",
    tag: "Guess the drawing",
  },
  {
    title: "Spotify playlist",
    tag: "We both pick 1-3 songs that remind us of the other person or our relationship and talk about why we picked them.",
  },
  {
    title: "True crime YouTube watch",
    tag: "Watch an episode of true crime(trying something you like to do",
  },
  {
    title: "Budget outfit build",
    tag: "We build each other an outfit with a budget",
  },

    {
    title: "Obsessed",
    tag: "Movie Time",
  },
];

const FOOD_OPTIONS = [
  "Sushi",
  "Chocolate Brownies",
  "Wings",
  "Chicfila wrap",
  "Cava",
  "Other"
];

// ==============================
// Page setup
// ==============================
const eventGrid = document.querySelector("#eventGrid");
const foodGrid = document.querySelector("#foodGrid");
const eventPasswordInput = document.querySelector("#eventPassword");
const foodPasswordInput = document.querySelector("#foodPassword");
const eventFeedback = document.querySelector("#eventFeedback");
const foodFeedback = document.querySelector("#foodFeedback");
const choicePanel = document.querySelector("#choicePanel");
const choiceMessage = document.querySelector("#choiceMessage");
const sendChoice = document.querySelector("#sendChoice");

let selectedFood = "";

renderEventCards(false);
renderFoodCards(false);
createFloatingDecorations();
startCountdown();
setupTeleportingNoButton();

// ==============================
// Hero acceptance and confetti
// ==============================
document.querySelectorAll(".accept-date").forEach((button) => {
  button.addEventListener("click", () => {
    const success = document.querySelector("#dateSuccess");
    success.hidden = false;
    success.textContent = "Date confirmed."
    launchConfetti();
  });
});

// ==============================
// Teleporting No button
// ==============================
function setupTeleportingNoButton() {
  const noButton = document.querySelector("#noButton");
  const noButtonNote = document.querySelector("#noButtonNote");
  const excuses = [
    "The no button has left the meeting.",
    "Interesting choice. Unfortunately, physics disagrees.",
    "No has been forwarded to the Department of Absolutely Not.",
    "That button is shy and legally unavailable."
  ];

  const dodge = (event) => {
    event.preventDefault();
    noButton.classList.add("teleporting");

    const padding = 14;
    const maxLeft = window.innerWidth - noButton.offsetWidth - padding;
    const maxTop = window.innerHeight - noButton.offsetHeight - padding;
    const nextLeft = Math.max(padding, Math.random() * maxLeft);
    const nextTop = Math.max(padding, Math.random() * maxTop);

    noButton.style.left = `${nextLeft}px`;
    noButton.style.top = `${nextTop}px`;
    noButtonNote.textContent = excuses[Math.floor(Math.random() * excuses.length)];
  };

  ["mouseenter", "pointerdown", "focus", "touchstart"].forEach((eventName) => {
    noButton.addEventListener(eventName, dodge);
  });

  noButton.addEventListener("click", dodge);
}

// ==============================
// Countdown timer
// ==============================
function startCountdown() {
  const target = new Date(DATE_NIGHT).getTime();
  const days = document.querySelector("#countdownDays");
  const hours = document.querySelector("#countdownHours");
  const minutes = document.querySelector("#countdownMinutes");
  const seconds = document.querySelector("#countdownSeconds");
  const note = document.querySelector("#countdownNote");

  const updateCountdown = () => {
    const distance = target - Date.now();

    if (Number.isNaN(target)) {
      note.textContent = "Update DATE_NIGHT in script.js with a valid date and time.";
      return;
    }

    if (distance <= 0) {
      days.textContent = "00";
      hours.textContent = "00";
      minutes.textContent = "00";
      seconds.textContent = "00";
      note.textContent = "It is date night. This is not a drill.";
      return;
    }

    const totalSeconds = Math.floor(distance / 1000);
    const remainingDays = Math.floor(totalSeconds / 86400);
    const remainingHours = Math.floor((totalSeconds % 86400) / 3600);
    const remainingMinutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = totalSeconds % 60;

    days.textContent = String(remainingDays).padStart(2, "0");
    hours.textContent = String(remainingHours).padStart(2, "0");
    minutes.textContent = String(remainingMinutes).padStart(2, "0");
    seconds.textContent = String(remainingSeconds).padStart(2, "0");
    note.textContent = "This countdown is powered by  Wi-Fi";
  };

  updateCountdown();
  window.setInterval(updateCountdown, 1000);
}

// ==============================
// Password unlock handlers
// ==============================
document.querySelector("#unlockEvents").addEventListener("click", unlockEvents);
document.querySelector("#unlockFood").addEventListener("click", unlockFood);

eventPasswordInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") unlockEvents();
});

foodPasswordInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") unlockFood();
});

function unlockEvents() {
  if (eventPasswordInput.value.trim() === EVENT_PASSWORD) {
    eventGrid.classList.remove("locked");
    eventFeedback.textContent = "Powered by Wi-Fi";
    renderEventCards(true);
  } else {
    eventFeedback.textContent = "Powered by Wi-Fi";
  }
}

function unlockFood() {
  if (foodPasswordInput.value.trim() === FOOD_PASSWORD) {
    foodGrid.classList.remove("locked");
    foodFeedback.textContent = "Powered by Wi-Fi";
    renderFoodCards(true);
  } else {
    foodFeedback.textContent = "Powered by Wi-Fi";
  }
}

// ==============================
// Event and food card rendering
// ==============================
function renderEventCards(isUnlocked) {
  eventGrid.innerHTML = "";

  EVENT_OPTIONS.forEach((option) => {
    const article = document.createElement("article");
    article.className = "idea-card";
    article.innerHTML = `
      <div>
        <h3>${option.title}</h3>
        <p>${option.description}</p>
      </div>
      <span>${option.tag}</span>
    `;

    if (!isUnlocked) {
      article.setAttribute("aria-hidden", "true");
    }

    eventGrid.appendChild(article);
  });
}

function renderFoodCards(isUnlocked) {
  foodGrid.innerHTML = "";

  FOOD_OPTIONS.forEach((option) => {
    const button = document.createElement("button");
    button.className = "food-card";
    button.type = "button";
    button.innerHTML = `<strong>${option}</strong>`;
    button.disabled = !isUnlocked;

    if (option === selectedFood) {
      button.classList.add("selected");
    }

    button.addEventListener("click", () => selectFood(option));
    foodGrid.appendChild(button);
  });
}

function selectFood(option) {
  selectedFood = option;
  renderFoodCards(true);

  choicePanel.hidden = false;
  choiceMessage.textContent = `${option} has been selected. Excellent taste. Suspiciously excellent, actually.`;

  const subject = encodeURIComponent("My official date night food choice");
  const body = encodeURIComponent(`I choose: ${option}\n\nPlease prepare`);
  sendChoice.href = `mailto:${RECIPIENT_EMAIL}?subject=${subject}&body=${body}`;
}

// ==============================
// Floating decorations
// ==============================
function createFloatingDecorations() {
  const floatingLayer = document.querySelector("#floatingLayer");
  const symbols = ["heart", "sparkle", "dot"];

  for (let index = 0; index < 26; index += 1) {
    const item = document.createElement("span");
    const symbol = symbols[index % symbols.length];
    item.className = "floating-item";
    item.textContent = symbol === "heart" ? "\u2665" : symbol === "sparkle" ? "\u2726" : "\u2022";
    item.style.left = `${Math.random() * 100}%`;
    item.style.animationDelay = `${Math.random() * -18}s`;
    item.style.animationDuration = `${14 + Math.random() * 14}s`;
    item.style.fontSize = `${14 + Math.random() * 16}px`;
    floatingLayer.appendChild(item);
  }
}

// ==============================
// Lightweight confetti
// ==============================
function launchConfetti() {
  const confettiLayer = document.querySelector("#confettiLayer");
  const colors = ["#f7b7cf", "#c7b7ff", "#bfe7ff", "#bcefd8", "#fff0a8"];

  for (let index = 0; index < 70; index += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[index % colors.length];
    piece.style.animationDelay = `${Math.random() * 0.28}s`;
    piece.style.transform = `rotate(${Math.random() * 180}deg)`;
    confettiLayer.appendChild(piece);

    window.setTimeout(() => {
      piece.remove();
    }, 1800);
  }
}
