const letters = document.querySelectorAll('.scoreboard-letter');
const loadingDiv = document.querySelector('.info-bar');
const ANSWER_LENGTH = 5;
const ROUNDS = 6;


async function init() {
  let currentGuess = "";
  let currentRow = 0;
  let isLoading = true;

  const res = await fetch("https://words.dev-apis.com/word-of-the-day");
  const resObj = await res.json();
  const word = resObj.word.toUpperCase();
  const wordParts = word.split("");
  let done = false;
  setLoading(false); 
  isLoading = false;

  console.log(word);

  function addLetter(letter) {
    if (currentGuess.length < ANSWER_LENGTH) {
      currentGuess += letter;
    } else {
      currentGuess = currentGuess.substring(0, currentGuess.length - 1) + letter;
    }

    letters[ANSWER_LENGTH * currentRow + currentGuess.length - 1].innerText = letter;
  }

  async function commit () {
    if (currentGuess.length != ANSWER_LENGTH) {
      // DO NOTHING
      return;
    }

    isLoading = true;
    setLoading(true);
    const res = await fetch("https://words.dev-apis.com/validate-word", {
      method: "POST",
      body: JSON.stringify({word: currentGuess})
    });
   
    const resObj = await res.json();
    const validWord = resObj.validWord;
    // const { validWord } = resObj;

    isLoading = false;
    setLoading(false);

    if (!validWord) {
      markInvalidWord();
      return;
    }

    const guessParts = currentGuess.split("");
    const map = makeMap(wordParts);
    

    for (let i = 0; i < ANSWER_LENGTH; i++) {
      // mark a correct
      if (guessParts[i] === wordParts[i]) {
        letters[currentRow * ANSWER_LENGTH + i].classList.add("correct");
        map[guessParts[i]]--;
      }
    }

    for (let i = 0; i < ANSWER_LENGTH; i++) {
      if (guessParts[i] === wordParts[i]) {
        // do nothig we already did it
      } else if (wordParts.includes(guessParts[i]) && map[guessParts[i]] > 0) {
        letters[currentRow * ANSWER_LENGTH + i].classList.add("close");
      } else {
        letters[currentRow * ANSWER_LENGTH + i].classList.add("wrong");
      }
    }
    // 

    currentRow++;
    if (currentGuess === word) {
      // win
      alert("you win");
      document.querySelector(".name").classList.add("winner");
      done = true;
    } else if (currentRow === ROUNDS) {
      alert(`you lose the word was ${word}`)
    }
    currentGuess = '';
  }

  function backspace() {
    currentGuess = currentGuess.substring (0, currentGuess.length - 1);
    letters[ANSWER_LENGTH * currentRow + currentGuess.length].innerText = "";
  }

  function markInvalidWord () {
    // alert('!no');

    for (let i = 0; i < ANSWER_LENGTH; i++) {
      letters[currentRow * ANSWER_LENGTH + i].classList.remove("invalid");

      setTimeout(function () {
        letters[currentRow * ANSWER_LENGTH + i].classList.add("invalid");
      }, 10);
    }
  }

  document.addEventListener('keydown', function (event) {

    if (done || isLoading) {
      // do nothing
      return;
    }


    const action = event.key;

    // console.log(action);

    if (action === 'Enter') {
      commit();
    } else if (action === 'Backspace') {
      backspace();
    } else if (isLetter(action)) {
      addLetter(action.toUpperCase())
    } else {
      // do nothing
    }
  })
}

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

function setLoading(isLoading) {
  loadingDiv.classList.toggle('show', isLoading);
}

function makeMap(array) {
  const obj = {};
  for (let i = 0; i < array.length; i++) {
    const letter = array[i]
    if (obj[letter]) {
      obj[letter]++;
    } else {
      obj[letter] = 1;
    }
  }

  return obj;
}

init();





















// const DOG_URL = "https://dog.ceo/api/breeds/image/random";

// const doggos = document.getElementById("dog-target");

// async function addNewDoggo() {
//   const promise = await fetch (DOG_URL);
//   const processedResponse = await promise.json();
//   const img = document.createElement("img");
//   img.src = processedResponse.message;
//   img.alt = "cute doggy";
//   doggos.appendChild(img);
//   // const promise = fetch(DOG_URL);
//   // promise
//   //   .then(function (response) {
//   //   const processingPromise = response.text();
//   //   return processingPromise;
//   // })
//   //   .then(function (processedResponse) {
//   //   const dogObject = JSON.parse(processedResponse);
//   //   const img = document.createElement("img");
//   //   img.src = dogObject.message;
//   //   img.alt = "Cute doggo";
//   //   doggos.appendChild(img);
//   // });
// }

// document.getElementById("dog-btn").addEventListener("click", addNewDoggo);

// const btn = document.querySelector("btncon  ");

// input.addEventListener("change", function () {
//   btn.style.backgroundColor = black;
// });