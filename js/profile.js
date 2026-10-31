const stats =
  document.querySelectorAll(".stat");

const continueButton =
  document.getElementById("continueButton");


window.addEventListener("load", () => {

  /*
    Animate the stat bars after the
    personnel file appears.
  */

  setTimeout(() => {

    stats.forEach((stat, index) => {

      const value =
        stat.dataset.value;

      const fill =
        stat.querySelector(".stat-fill");


      setTimeout(() => {

        fill.style.width =
          `${value}%`;

      }, index * 140);

    });

  }, 350);

});


continueButton.addEventListener(
  "click",
  () => {

    /*
      Change this once we decide
      what Mission 01 will be.
    */

    window.location.href =
      "mission.html";

  }
);