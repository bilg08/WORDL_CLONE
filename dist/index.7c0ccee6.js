let grid = document.getElementById("grid");
let keyBoard = document.getElementById("keyBoard");
keyBoard.className = "keyboard";
let worldLists = [
    "table",
    "chair",
    "china",
    "piano",
    "paint",
    "light"
];
let attempts = [];
let currentAttempt = "";
let randomIndex = Math.floor(Math.random() * worldLists.length);
let secretWWordWord = worldLists[randomIndex];
let GREY = "#212121";
let GREEN = "#538d4e";
let YELLOW = "#b59f3b";
let LIGHTGREY = "#888";
let BLACK = "#000";
let secretWord = worldLists[randomIndex];
let keyboardButtons = new Map();
function buildGrid() {
    for(let i = 0; i < 6; i++){
        let row = document.createElement("div");
        for(let j = 0; j < 5; j++){
            let cell = document.createElement("div");
            cell.className = "cell";
            let front = document.createElement("div");
            front.className = "front";
            let back = document.createElement("div");
            back.className = "back";
            let surface = document.createElement("div");
            surface.className = "surface";
            surface.style.transitionDelay = j * 300 + "ms";
            surface.appendChild(front);
            surface.appendChild(back);
            cell.appendChild(surface);
            row.appendChild(cell);
        }
        grid.appendChild(row);
    }
}
buildGrid();
uptadeGrid();
function uptadeGrid() {
    for(let i = 0; i < 6; i++){
        let row = grid.children[i];
        if (i < attempts.length) drawAttempt(row, attempts[i], true);
        else if (i === attempts.length) drawAttempt(row, currentAttempt, false);
        else drawAttempt(row, "", false);
    }
}
function drawAttempt(row, attempt, solved) {
    for(let i = 0; i < 5; i++){
        let cell = row.children[i];
        let surface = cell.firstChild;
        let front = surface.children[0];
        let back = surface.children[1];
        if (attempt[i] !== undefined) {
            front.textContent = attempt[i];
            back.textContent = attempt[i];
        } else {
            front.innerHTML = '<div style="opacity: 0">X</div>';
            back.innerHTML = '<div style="opacity: 0">X</div>';
            clearAnimation(cell);
        }
        front.style.backgroundColor = BLACK;
        front.style.border = `1px solid ${BLACK}`;
        if (attempt[i] !== undefined) front.style.border = `1px solid ${GREY}}`;
        back.style.backgroundColor = getBgColor(attempt, i);
        back.style.borderColor = getBgColor(attempt, i);
        if (solved) cell.classList.add("solved");
        else cell.classList.remove("solved");
    }
}
function getBgColor(attempt, i) {
    let correctLetter = secretWWordWord[i];
    let attemptLetter = attempt[i];
    if (correctLetter === attemptLetter) return GREEN;
    else if (secretWWordWord.indexOf(attemptLetter) === -1 || attemptLetter === undefined) return GREY;
    return YELLOW;
}
function handleKeyDown(e) {
    if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
    handleKey(e.key);
}
function handleKey(key) {
    if (history.length === 6) return;
    let letter = key.toLowerCase();
    if (letter === "enter") {
        if (currentAttempt.length < 5) return;
        if (attempts.length === 5 && currentAttempt !== secretWord) alert(secretWord);
        attempts.push(currentAttempt);
        currentAttempt = "";
        uptadeKeyBoard();
        saveGame();
    } else if (letter === "backspace") currentAttempt = currentAttempt.slice(0, currentAttempt.length - 1);
    else if (/^[a-z]$/.test(letter)) {
        if (currentAttempt.length < 5) {
            currentAttempt += letter;
            animatePress(currentAttempt.length - 1);
        }
    }
    uptadeGrid();
}
document.addEventListener("keydown", handleKeyDown);
function buildKeyboard() {
    buildKeyboardRow("qwertyuiop", false);
    buildKeyboardRow("asdfghjkl", false);
    buildKeyboardRow("zxcvbnm", true);
}
buildKeyboard();
function buildKeyboardRow(letters, isLastRow) {
    let row = document.createElement("div");
    if (isLastRow) {
        let button = document.createElement("button");
        button.className = "KeyForKeyBoard";
        button.textContent = "Enter";
        button.style.backgroundColor = LIGHTGREY;
        button.onclick = ()=>{
            handleKey("enter");
        };
        row.appendChild(button);
    }
    for (let letter of letters){
        let button1 = document.createElement("button");
        button1.className = "KeyForKeyBoard";
        button1.textContent = letter;
        button1.style.backgroundColor = LIGHTGREY;
        button1.onclick = ()=>{
            handleKey(letter);
        };
        keyboardButtons.set(letter, button1);
        row.appendChild(button1);
    }
    if (isLastRow) {
        let button2 = document.createElement("button");
        button2.className = "KeyForKeyBoard";
        button2.textContent = "Backspace";
        button2.style.backgroundColor = LIGHTGREY;
        button2.onclick = ()=>{
            handleKey("backspace");
        };
        row.appendChild(button2);
    }
    keyBoard.appendChild(row);
}
uptadeKeyBoard();
function getBetterColor(a, b) {
    if (a === GREEN || b === GREEN) return GREEN;
    if (a === YELLOW || b === YELLOW) return YELLOW;
}
function uptadeKeyBoard() {
    let bestColors = new Map();
    for (let attempt of attempts)for(let i = 0; i < attempt.length; i++){
        let color = getBgColor(attempt, i);
        let key = attempt[i];
        let bestColor = bestColors.get(key);
        bestColors.set(key, getBetterColor(color, bestColor));
    }
    for (let [key1, button] of keyboardButtons)button.style.backgroundColor = bestColors.get(key1);
}
loadGame();
function animatePress(index) {
    let rowIndex = attempts.length;
    let row = grid.children[rowIndex];
    let cell = row.children[index];
    cell.style.animationName = "press";
    cell.style.animationDuration = "0.2s";
    cell.style.animationTimingFunction = "ease-out";
}
function clearAnimation(cell) {
    cell.style.animationName = "";
    cell.style.animationDuration = "";
    cell.style.animationTimingFunction = "";
}
function loadGame() {
    let data;
    try {
        data = JSON.parse(localStorage.getItem("data"));
    } catch (error) {}
    if (data != null) attempts = data.attempts;
}
function saveGame() {
    let data = JSON.stringify({
        secretWWordWord,
        attempts
    });
    try {
        localStorage.setItem("data", data);
    } catch (error) {}
}

//# sourceMappingURL=index.7c0ccee6.js.map
