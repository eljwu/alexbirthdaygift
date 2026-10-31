    const scene = document.getElementById("scene");
    const envelope = document.getElementById("envelope");
    const instruction = document.getElementById("instruction");
    const continueButton = document.getElementById("continueButton");

    let stage = 0;
    let animating = false;


    function advanceEnvelope() {

      if (animating) return;

      /*
        STAGE 0
        Front → flip to back
      */

      if (stage === 0) {

        animating = true;

        envelope.classList.add("flipped");
        instruction.textContent = "break the seal";

        setTimeout(() => {
          animating = false;
          stage = 1;
        }, 1000);

        return;
      }


      /*
        STAGE 1
        Break seal + open flap
      */

      if (stage === 1) {

        animating = true;

        envelope.classList.add("open");
        instruction.textContent = "one more time";

        setTimeout(() => {
          animating = false;
          stage = 2;
        }, 1000);

        return;
      }


      /*
        STAGE 2
        Letter rises from envelope
      */

      if (stage === 2) {

        animating = true;

        envelope.classList.add("letter-out");

        instruction.style.opacity = "0";

        setTimeout(() => {
          continueButton.classList.add("visible");
          animating = false;
          stage = 3;
        }, 1000);

        return;
      }

    }


    scene.addEventListener("click", advanceEnvelope);


    /*
      Keyboard accessibility:
      Enter or spacebar also opens the envelope.
    */

    scene.addEventListener("keydown", (event) => {

      if (
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();
        advanceEnvelope();
      }

    });

    continueButton.addEventListener("click", () => {

      console.log("Continue to the next part of the gift.");

      window.location.href = "letter.html";

    });
