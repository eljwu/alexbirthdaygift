const form =
  document.getElementById("passcodeForm");

const input =
  document.getElementById("passcodeInput");

const message =
  document.getElementById("message");

const card =
  document.querySelector(".passcode-card");


const correctPasscode = "ciroc";


form.addEventListener("submit", (event) => {

  event.preventDefault();

  const entered =
    input.value.trim();


  if (entered.toLowerCase() === correctPasscode.toLowerCase()) {

    message.textContent =
      "Unlocked.";

    setTimeout(() => {
      window.location.href = "fighter.html";
    }, 700);

  } else {

    message.textContent =
      "Not quite. Try again.";

    card.classList.remove("shake");

    void card.offsetWidth;

    card.classList.add("shake");

    input.select();
  }

});