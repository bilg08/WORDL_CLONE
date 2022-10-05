let grid = document.getElementById('grid');
let keyBoard = document.getElementById("keyBoard");
keyBoard.className = 'keyboard';
let worldLists = ['table', 'chair', 'china', 'piano', 'paint','light'];
let attempts = [];
let currentAttempt = '';
let randomIndex = Math.floor(Math.random() * worldLists.length);
let secretWord = worldLists[randomIndex];
let GREY = "#212121";
let GREEN = "#538d4e";
let YELLOW = "#b59f3b";
let LIGHTGREY = "#888";
let BLACK = '#000'
let keyboardButtons = new Map();
function drawGrid() {
    for (let i = 0; i < 6; i++) {
        let row = document.createElement('div');
        row.className = 'row';
            for (let j = 0; j < 5; j++) {
                let cell = document.createElement('div');
                cell.className = 'cell';
                cell.textContent = '';
                let front = document.createElement('div');
                front.className = "front";
                let back = document.createElement("div");
                back.className = "back";
                let surface = document.createElement("div");
                surface.className = 'surface';
                surface.appendChild(front);
                surface.appendChild(back);
                cell.appendChild(surface);
                row.appendChild(cell);
            }
        grid.appendChild(row);
    }
}
drawGrid();
uptadeGrid();
function uptadeGrid() {
 
    for (let i = 0; i < 6; i++) {
        let row = grid.children[i];
        if (i < attempts.length) {
            drawAttempt(row,attempts[i],true)
        } else if (i === attempts.length) {
            drawAttempt(row, currentAttempt, false);
        } else {
            drawAttempt(row, "", false);          
        }
    }
}
function drawAttempt(row, attempt, isCurrent) {
  for (let i = 0; i < 5; i++) {
    let cell = row.children[i];
    let surface = cell.firstChild;
    let front = surface.children[0];
    let back = surface.children[1];
    if (attempt[i] !== undefined) {
      front.textContent = attempt[i];
      back.textContent = attempt[i];
    } else {
      front.innerHTML = '<div style = "opacity: 0">X</div>';
      back.innerHTML = '<div style = "opacity: 0">X</div>';
      clearAnimation(cell);
    }
    front.style.backgroundColor = BLACK;
    front.style.borderColor = "";
    if (attempt[i] !== undefined) {
      front.style.borderColor = LIGHTGREY;
    }

    back.style.backgroundColor = getBgColor(attempt, i);
    back.style.borderColor = getBgColor(attempt, i);

    if (isCurrent) {
      cell.classList.add("solved");
    } else {
      cell.classList.remove("solved");
    }
  }
}

function getBgColor(attempt,i) {
    let correctLetter = secretWord[i];
    let attemptLetter = attempt[i];
    if (correctLetter === attemptLetter) {
        return GREEN
    } else if (secretWord.indexOf(attemptLetter)===-1|| attemptLetter === undefined) {
        return GREY;
    } 
    return YELLOW;
}
function handleKeyDown(e) {
    if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) {
        return;
    }
    handleKey(e.key)
}
function handleKey(key) {
    if (history.length === 6) {
      return;
    }
    
    let letter = key.toLowerCase();
    if (letter === "enter") {
      if (currentAttempt.length < 5) {
        return;
      }

      if (history.length === 5 && currentAttempt !== secret) {
        alert(secret);
      }
      attempts.push(currentAttempt);
      currentAttempt = "";
      uptadeKeyBoard();
      saveGame();
    } else if (letter === "backspace") {
      currentAttempt = currentAttempt.slice(0, currentAttempt.length - 1);
    } else if (/^[a-z]$/.test(letter)) {
      if (currentAttempt.length < 5) {
        currentAttempt += letter;
          animatePress(currentAttempt.length - 1);
      }
    }
     uptadeGrid();
}
document.addEventListener('keydown', handleKeyDown);

function buildKeyboard() {
    buildKeyboardRow('qwertyuiop',false);
    buildKeyboardRow("asdfghjkl",false);
    buildKeyboardRow("zxcvbnm",true);
}
buildKeyboard()
function buildKeyboardRow(letters,isLastRow) {
    let row = document.createElement('div');
    if (isLastRow) {
     let button = document.createElement("button");
     button.className = "KeyForKeyBoard";
     button.innerText = 'Enter';
        button.style.background = LIGHTGREY;
        button.onclick = () => {
            handleKey('enter');
        }
     row.appendChild(button);
    }
    for (let letter of letters) {
        let button = document.createElement('button');
        button.className = "KeyForKeyBoard";
        button.innerText = letter;
        button.style.background = LIGHTGREY;
        button.onclick = () => {
          handleKey(letter);
        };
        keyboardButtons.set(letter,button)
        row.appendChild(button);
    }
    if (isLastRow) {
        let button = document.createElement("button");
        button.className = "KeyForKeyBoard";
        button.innerText = "<=";
        button.style.background = LIGHTGREY;
        button.onclick = () => {
          handleKey('backspace');
        };
        row.appendChild(button);
    }
    keyBoard.appendChild(row);
}
uptadeKeyBoard();
function getBetterColor (a, b) {
    if (a === GREEN || b === GREEN) {
        return GREEN;
    }
    if (a === YELLOW || b=== YELLOW) {
        return YELLOW;
    }
}
function uptadeKeyBoard() {
    let bestColors = new Map();
    for (let attempt of attempts) {
        for (let i = 0; i < attempt.length; i++){
            let color = getBgColor(attempt, i);
            let key = attempt[i];
            let bestColor = bestColors.get(key);
            bestColors.set(key,getBetterColor(color,bestColor))
        }
    }
    for (let [key, button] of keyboardButtons) {
        button.style.backgroundColor = bestColors.get(key)
    }

}

loadGame();

function animatePress(index) {
    let rowIndex = attempts.length;
    let row = grid.children[rowIndex];
    let cell = row.children[index];
    cell.style.animationName = 'press';
    cell.style.animationDuration = '0.2s';
    cell.style.animationTimingFunction = 'ease-out';
}

function clearAnimation(cell) {
  cell.style.animationName = "";
    cell.style.animationDuration = "";
    cell.style.animationTimingFunction = "ease-out";
    
}

function loadGame() {
    let data;
    try {
        data = JSON.parse(localStorage.getItem("data"));
    } catch (error) { }
    
    if (data != null) {
    console.log(attempts === data.attempts);
        // if (data.attempts === attempts) {
          console.log(attempts === data.attempts);
            attempts = data.attempts;
            console.log(attempts)
        // }
    }
}

function saveGame() {
    let data = JSON.stringify({ secretWord, attempts });
    try {
        localStorage.setItem('data', data);
    } catch (error) {
        
    }
}