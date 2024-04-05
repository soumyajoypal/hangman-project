// Making the keyboard
const keyboard = document.querySelector('.hangman-keyboard');
function createKeys() {
    for (let i = 97; i <= 122; i++) {
        const key = document.createElement('button');
        key.innerHTML = String.fromCharCode(i).toUpperCase();
        key.classList.add('key');
        keyboard.appendChild(key);
    }
}
createKeys();
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

async function randWordInd(data) {
    if (!data || !Array.isArray(data.words)) {
        throw new Error('Invalid data format');
    }
    return Math.floor(Math.random() * data.words.length);
}
function loadBlanks(word) {
    const answer = document.querySelector('.hangman-answer');
    const hint = document.querySelector('.hint .text');
    for (let i = 0; i < word.word.length; i++) {
        const blanks = document.createElement('div');
        blanks.classList.add('blanks');
        answer.appendChild(blanks);
    }
    hint.innerHTML = word.hint;
}
async function loadWord() {
    try {
        let data = await getWord();
        let ind = await randWordInd(data);
        console.log(data.words[ind].word);
        loadBlanks(data.words[ind]);
    } catch (error) {
        console.error('Error:', error);
    }
}
loadWord();