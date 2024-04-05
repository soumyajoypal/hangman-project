
// Fetching the words form info.json
let url = 'info.json';

async function getWord() {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

// getting the random word index
async function randWordInd(data) {
    if (!data || !Array.isArray(data.words)) {
        throw new Error('Invalid data format');
    }
    return Math.floor(Math.random() * data.words.length);
}

// loading the corresponding blanks for the word
function loadBlanks(word) {
    const answer = document.querySelector('.hangman-answer');
    const hint = document.querySelector('.hint .text');
    for (let i = 0; i < word.word.length; i++) {
        const blanks = document.createElement('div');
        blanks.classList.add('blanks');
        blanks.setAttribute('data-blank-key', word.word.charAt(i));
        answer.appendChild(blanks);
    }
    hint.innerHTML = word.hint;
}

// Global variables
let data = [];
let ind;
let count;

// Loading the word(main)
async function loadWord() {
    try {
        data = await getWord();
        ind = await randWordInd(data);
        console.log(data.words[ind].word);
        loadBlanks(data.words[ind]);
        count = 0;
    } catch (error) {
        console.error('Error:', error);
    }
}
loadWord();

// Make Char for the blanks to fill them
function fillBlank(key, blankArray, index) {
    const blank = blankArray[index];
    const char = document.createElement('div');
    char.classList.add('char');
    char.innerHTML = `${key}`;
    blank.appendChild(char);
}

// To load the blanks correctly for the present keys
function putKeys(key) {
    const blankArray = document.querySelectorAll('.blanks');
    blankArray.forEach((value, index) => {
        const val = value.dataset.blankKey;
        if (val == key) {
            fillBlank(key, blankArray, index);
        }
    })
}

// Counting the number of guesses and updating the hangman
function guessNumber() {
    count++;
    const guessText = document.querySelector('.guess-text');
    const img = document.querySelector('.hangman-display img');
    img.src = `images/hangman-${count}.svg`;
    guessText.innerHTML = `${count}/6`;
    if (count === 6) {
        console.log('You Lost');
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
    key.classList.add('active');
    key.removeEventListener('click', () => {
        getKey(key);
    });
    if (check(key.innerHTML.toLowerCase())) {
        putKeys(key.innerHTML.toLowerCase());
        return;
    }
    guessNumber();
}

// Generating the keyboard
const keyboard = document.querySelector('.hangman-keyboard');
function createKeys() {
    for (let i = 97; i <= 122; i++) {
        const key = document.createElement('button');
        key.innerHTML = String.fromCharCode(i).toUpperCase();
        key.classList.add('key');
        keyboard.appendChild(key);
        key.addEventListener('click', () => {
            getKey(key);
        })
    }
}
createKeys();







