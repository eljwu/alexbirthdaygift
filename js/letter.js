const foldedLetter =
  document.getElementById("foldedLetter");

const confettiContainer =
  document.getElementById("confettiContainer");

const continueButton = 
  document.getElementById("continueButton");


window.addEventListener("load", () => {

  // Unfold the letter
  setTimeout(() => {
    foldedLetter.classList.add("open");
  }, 350);


  // Launch confetti after the letter unfolds
  setTimeout(() => {
    launchConfetti();
  }, 1900);


  // Show continue button
  setTimeout(() => {
    continueButton.classList.add("visible");
  }, 2800);

});


function launchConfetti() {

  const colors = [
    "#4e0672",
    "#6661c0",
    "#a4c4d9",
    "#f5eede",
    "#64b2ee"
  ];

  const amount = 70;

  for (let i = 0; i < amount; i++) {

    const piece = document.createElement("div");

    piece.classList.add("confetti-piece");

    piece.style.left =
      `${Math.random() * 100}%`;

    piece.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];

    const width =
      5 + Math.random() * 6;

    const height =
      8 + Math.random() * 10;

    piece.style.width =
      `${width}px`;

    piece.style.height =
      `${height}px`;

    const drift =
      -120 + Math.random() * 240;

    piece.style.setProperty(
      "--drift",
      `${drift}px`
    );

    const rotation =
      360 + Math.random() * 720;

    piece.style.setProperty(
      "--rotation",
      `${rotation}deg`
    );

    const duration =
      2.7 + Math.random() * 1.8;

    piece.style.setProperty(
      "--duration",
      `${duration}s`
    );

    piece.style.animationDelay =
      `${Math.random() * 0.7}s`;

    confettiContainer.appendChild(piece);

    setTimeout(() => {
      piece.remove();
    }, 5500);

  }

}

continueButton.addEventListener("click", () => {
    window.location.href = "passcode.html";
});