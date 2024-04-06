// Global variables
let data = [];
let ind;
let countGuess;
let countFills;
const resultBox = document.querySelector(".displayResult");
const keyboard = document.querySelector(".hangman-keyboard");
const guessText = document.querySelector(".guess-text");
const hangManImg = document.querySelector(".hangman-display img");
const answer = document.querySelector(".hangman-answer");
const hint = document.querySelector(".hint .text");
const resImg = document.querySelector(".result-img img");

// Fetching the words form info.json
let url = "info.json";

async function getWord() {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

// getting the random word index
async function randWordInd(data) {
  if (!data || !Array.isArray(data.words)) {
    throw new Error("Invalid data format");
  }
  return Math.floor(Math.random() * data.words.length);
}

// loading the corresponding blanks for the word
function loadBlanks(word) {
  for (let i = 0; i < word.word.length; i++) {
    const blanks = document.createElement("div");
    blanks.classList.add("blanks");
    blanks.setAttribute("data-blank-key", word.word.charAt(i));
    answer.appendChild(blanks);
  }
  hint.innerHTML = word.hint;
}

// Loading the word(main)
async function getRandWord() {
  ind = await randWordInd(data);
  console.log(data.words[ind].word);
  createKeys();
  loadBlanks(data.words[ind]);
  countGuess = 0;
  countFills = 0;
}
async function loadWord() {
  try {
    data = await getWord();
    getRandWord();
  } catch (error) {
    console.error("Error:", error);
  }
}
loadWord();

// Reset Button
const resetBtn = document.querySelector(".restart-btn");
resetBtn.addEventListener("click", () => {
  reset();
});
// Function to reset the Game
function reset() {
  resultBox.classList.remove("visibleResult");
  document.querySelector(".overlay").style.display = "none";
  countFills = 0;
  countFills = 0;
  keyboard.innerHTML = "";
  guessText.innerHTML = "0/6";
  hangManImg.src = `images/hangman-0.svg`;
  answer.innerHTML = ``;
  resImg.src = ``;
  data.words.splice(ind, 1);
  getRandWord();
}

// Display Result
function displayRes(res) {
  setTimeout(() => {
    const resHeading = document.querySelector(".result-heading");
    const resText = document.querySelector(".result-text");
    let word = data.words[ind].word;
    if (res === false) {
      resImg.src = `images/lost.gif`;
      resHeading.innerText = `Sorry!`;
      resText.innerHTML = `The correct word was: ${word}`;
    } else {
      resImg.src = `images/victory.gif`;
      resHeading.innerText = `Congrats!`;
      resText.innerHTML = `You found the word: ${word}`;
    }
    resultBox.classList.add("visibleResult");
    document.querySelector(".overlay").style.display = "block";
  }, "300");
}

// Make Char for the blanks to fill them
function fillBlank(key, blankArray, index) {
  const blank = blankArray[index];
  const char = document.createElement("div");
  char.classList.add("char");
  char.innerHTML = `${key}`;
  blank.appendChild(char);
}

// To load the blanks correctly for the present keys
function putKeys(key) {
  const blankArray = document.querySelectorAll(".blanks");
  blankArray.forEach((value, index) => {
    const val = value.dataset.blankKey;
    if (val == key) {
      fillBlank(key, blankArray, index);
      countFills++;
    }
  });
}

// countGuessing the number of guesses and updating the hangman
function guessNumber() {
  countGuess++;
  hangManImg.src = `images/hangman-${countGuess}.svg`;
  guessText.innerHTML = `${countGuess}/6`;
  if (countGuess === 6) {
    displayRes(false);
  }
}

// Checking if the key pressed is present in the word or not
function check(key) {
  let word = data.words[ind].word;
  let res = word.includes(key);
  return res;
}

// making the changes to the key according to the result
function getKey(key) {
  key.classList.add("active");
  key.removeEventListener("click", clickHandler);
  if (check(key.innerHTML.toLowerCase())) {
    putKeys(key.innerHTML.toLowerCase());
    if (countFills === data.words[ind].word.length) {
      displayRes(true);
    }
    return;
  }
  guessNumber();
}

function clickHandler() {
  getKey(this);
}

// Generating the keyboard
function createKeys() {
  for (let i = 97; i <= 122; i++) {
    const key = document.createElement("button");
    key.innerHTML = String.fromCharCode(i).toUpperCase();
    key.classList.add("key");
    keyboard.appendChild(key);
    key.addEventListener("click", clickHandler);
  }
}
