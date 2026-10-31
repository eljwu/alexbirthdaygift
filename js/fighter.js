const heroes = {

  a: {
    number: "01",
    name: "JACK",
    role: "SPECIALIST",
    title: "\"The President\"",
    description: "John Michael Galasso III is a reliable teammate and will go the distance for his team. Dangerous behavior includes diving across wet beer ball tables and tweaking.", 
    picture: "img/fighters/jack.JPEG",
    status: "AVAILABLE",
    difficulty: "★★★★☆",
    birthdayBoy: false,
    wrongMessage: "Not today, buddy."
  },

  b: {
    number: "02",
    name: "LEIM",
    role: "DEFENDER", 
    title: "\"Wingman\"", 
    description: "If not the best on defense, Leim Brandl is the most passionate, who can hold the line against even the strongest opponents. Arguably the greatest hype man of our time.",
    picture: "img/fighters/leim.jpg", 
    status: "AVAILABLE",
    difficulty: "★★★★☆",
    birthdayBoy: false,
    wrongMessage: "This character has not purchased the Birthday DLC."
  },

  c: {
    number: "03",
    name: "NICK",
    role: "SNIPER",
    title: "\"The Cuck\"",
    description: "Nicholas Stephen Frisch has low durability. He is a lightweight and a pissy drunk, but he dances like Michael Jackson.",
    picture: "img/fighters/nick.JPG",
    status: "AVAILABLE",
    difficulty: "★★☆☆☆",
    birthdayBoy: false,
    wrongMessage: "Come on, what are we doing?"
  },

  d: {
    number: "04",
    name: "SAM",
    role: "BERSERKER",
    title: "\"The Caveman\"",
    description: "Samuel Martin is a fierce and relentless warrior who charges into battle with unmatched aggression. He is extremely unpredictable and dangerous.",
    picture: "img/fighters/sam.JPG",
    status: "AVAILABLE",
    difficulty: "★★★☆☆",
    birthdayBoy: false,
    wrongMessage:
      "Absolutely not."
  },

  e: {
    number: "05",
    name: "CHARLIE",
    role: "SUPPORT",
    title: "\"The Geeker\"",
    description: "An IT specialist who is experienced in turning off machines and turning them back on again, Charlie Wang is a reliable and resourceful team member, until he hits the yart one too many times.",
    picture: "img/fighters/charlie.jpg", 
    status: "AVAILABLE",
    difficulty: "★★☆☆☆",
    birthdayBoy: false,
    wrongMessage:
      "Eligibility requirement not met: Birthday must be November 3."
  },

  f: {
  number: "06",
  name: "EL",
  role: "ROGUE",
  title: "\"The Best\"",
  description: "Not available at this time.",
  picture: "img/fighters/el.JPG",
  status: "MIA",
  difficulty: "★★★☆☆",
  birthdayBoy: false,
  wrongMessage: "Awww. But no. Try again."
},

g: {
  number: "07",
  name: "WILL",
  role: "DAMAGE",
  title: "\"Big Man\"",
  description: "William Cole Eubank is a skilled and competitive mastermind, but can be a bit of a loose cannon. Choose at your own risk.",
  picture: "img/fighters/will.JPEG",
  status: "AVAILABLE",
  difficulty: "★★★★☆",
  birthdayBoy: false,
  wrongMessage: "Not the birthday boy."
},

  birthday: {
    number: "08",
    name: "BIRTHDAY BOY",
    role: "BIRTHDAY BOY",
    title: "\"The Main Character\"",
    description:
      "The only hero authorized to begin the Level 20 Birthday Campaign.",
    picture: "img/fighters/alex.JPG",
    status: "ELIGIBLE",
    difficulty: "★★★☆☆",
    birthdayBoy: true
  }

};


const heroCards =
  document.querySelectorAll(".hero-card");

const heroNumber =
  document.getElementById("heroNumber");

const heroName =
  document.getElementById("heroName");

const heroRole =
  document.getElementById("heroRole");

const heroTitle =
  document.getElementById("heroTitle");

const heroDescription =
  document.getElementById("heroDescription");

const heroStatus =
  document.getElementById("heroStatus");

const heroDifficulty =
  document.getElementById("heroDifficulty");

const largeHeroImage =
  document.getElementById("largeHeroImage");

const selectButton =
  document.getElementById("selectButton");

const selectionMessage =
  document.getElementById("selectionMessage");

const lockScreen =
  document.getElementById("lockScreen");

const lockName =
  document.getElementById("lockName");


let selectedHero = "a";

let wrongAttempts = 0;

const attemptedHeroes = new Set();


function displayHero(heroKey) {

  const hero =
    heroes[heroKey];

  selectedHero =
    heroKey;


  /* Update selected card */

  heroCards.forEach(card => {

    card.classList.toggle(
      "selected",
      card.dataset.hero === heroKey
    );

  });


  /* Brief picture transition */

  largeHeroImage.classList.add(
    "changing"
  );


  setTimeout(() => {

    heroNumber.textContent =
      hero.number;

    heroName.textContent =
      hero.name;

    heroRole.textContent =
      hero.role;

    heroTitle.textContent =
      hero.title;

    heroDescription.textContent =
      hero.description;

    heroStatus.textContent =
      hero.status;

    heroDifficulty.textContent =
      hero.difficulty;

    largeHeroImage.innerHTML = `
      <img src="${hero.picture}" alt="${hero.name}">
    `;


    largeHeroImage.classList.remove(
      "changing"
    );

  }, 160);


  /* Clear old error */

  selectionMessage.textContent =
    "";


  /* Change button for birthday boy */

  if (hero.birthdayBoy) {

    selectButton.textContent =
      "LOCK IN";

    selectButton.classList.add(
      "birthday-ready"
    );

  } else {

    selectButton.textContent =
      "SELECT HERO";

    selectButton.classList.remove(
      "birthday-ready"
    );

  }

}


/* Hero card clicks */

heroCards.forEach(card => {

  card.addEventListener(
    "click",
    () => {

      const heroKey =
        card.dataset.hero;

      displayHero(heroKey);

    }
  );

});


/* Select hero button */

selectButton.addEventListener(
  "click",
  () => {

    const hero =
      heroes[selectedHero];


    if (hero.birthdayBoy) {

      lockInHero(hero);

    } else {

      wrongAttempts++;

      showWrongChoice(hero);

    }

  }
);


// function showWrongChoice(hero) {

//   const progressiveMessages = [

//     hero.wrongMessage,

//     "Try again.",

//     "This is a birthday website. Think about it.",

//     "You cannot possibly be struggling with this.",

//     "SELECT YOURSELF."

//   ];


//   const messageIndex =
//     Math.min(
//       wrongAttempts - 1,
//       progressiveMessages.length - 1
//     );


//   selectionMessage.textContent =
//     progressiveMessages[messageIndex];


//   /* Tiny shake */

//   selectButton.animate(
//     [
//       {
//         transform:
//           "translateX(0)"
//       },

//       {
//         transform:
//           "translateX(-5px)"
//       },

//       {
//         transform:
//           "translateX(5px)"
//       },

//       {
//         transform:
//           "translateX(-3px)"
//       },

//       {
//         transform:
//           "translateX(0)"
//       }
//     ],
//     {
//       duration: 280,
//       easing: "ease"
//     }
//   );

// }
function showWrongChoice(hero) {

  // First time selecting this particular fighter
  if (!attemptedHeroes.has(selectedHero)) {

    attemptedHeroes.add(selectedHero);

    selectionMessage.textContent = hero.wrongMessage;

  } else {

    // Repeated selections get progressively more aggressive
    const progressiveMessages = [
      "Try again.",
      "This is a birthday website. Think about it.",
      "You cannot possibly be struggling with this.",
      "SELECT YOURSELF."
    ];

    const messageIndex = Math.min(
      wrongAttempts - attemptedHeroes.size,
      progressiveMessages.length - 1
    );

    selectionMessage.textContent =
      progressiveMessages[Math.max(0, messageIndex)];

  }

  /* Tiny shake */

  selectButton.animate(
    [
      { transform: "translateX(0)" },
      { transform: "translateX(-5px)" },
      { transform: "translateX(5px)" },
      { transform: "translateX(-3px)" },
      { transform: "translateX(0)" }
    ],
    {
      duration: 280,
      easing: "ease"
    }
  );

}


function lockInHero(hero) {

  lockName.textContent =
    hero.name;

  lockScreen.classList.add(
    "visible"
  );

  lockScreen.setAttribute(
    "aria-hidden",
    "false"
  );


  /*
    Change "profile.html"
    to the name of your next page.
  */

  setTimeout(() => {

    window.location.href =
      "profile.html";

  }, 2300);

}


/* Initial hero */

displayHero("a");
