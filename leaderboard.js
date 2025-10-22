function displayLeaderboard(){
  const leaderboardList = document.getElementById("leaderboard");
  const users = JSON.parse(localStorage.getItem("users")) || [];
  leaderboardList.innerHTML="";

  users.forEach(u=>{
    u.quizzesTaken.forEach((quiz,i)=>{
      const li=document.createElement("li");
      li.textContent=`${u.username} - ${u.scores[i]} (${quiz.split('/').pop().replace('-questions.js','')})`;
      leaderboardList.appendChild(li);
    });
  });
}

displayLeaderboard();

document.getElementById("back-dashboard-btn").addEventListener("click",()=>{
  window.location.href="dashboard.html";
});

document.getElementById("clear-leaderboard-btn").addEventListener("click",()=>{
  if(confirm("Are you sure you want to clear all leaderboard data?")){
    let users=JSON.parse(localStorage.getItem("users"))||[];
    users.forEach(u=>{u.quizzesTaken=[]; u.scores=[];});
    localStorage.setItem("users", JSON.stringify(users));
    displayLeaderboard();
    alert("Leaderboard cleared!");
  }
});
