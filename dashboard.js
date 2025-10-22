const subjects = [
  { name: "JavaScript", file: "subjects/javascript-questions.js" },
  { name: "HTML & CSS", file: "subjects/htmlcss-questions.js" },
  { name: "Python", file: "subjects/python-questions.js" }
];

const currentUser = localStorage.getItem("currentUser");
if (!currentUser) window.location.href = "register.html";
else document.getElementById("user-name").innerText = currentUser;

const subjectsContainer = document.getElementById("subjects-container");
subjects.forEach(subj => {
  const btn = document.createElement("button");
  btn.innerText = subj.name;
  btn.onclick = () => {
    localStorage.setItem("selectedQuiz", subj.file);
    window.location.href = "quiz.html";
  };
  subjectsContainer.appendChild(btn);
});

document.getElementById("leaderboard-btn").addEventListener("click", () => {
  window.location.href = "leaderboard.html";
});
document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "register.html";
});
