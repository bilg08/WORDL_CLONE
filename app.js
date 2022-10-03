// let grid = document.getElementById('grid');
// grid.className = 'grid';
// let worldList = ["sting",'hello','world','shine'];
// let randomIndex = Math.floor(Math.random() * worldList.length);
// let secret = worldList[randomIndex];

// let attempts = [];
// let currentAttempt = "";
// buildGrid();
// uptadeGrid();

// document.addEventListener('keydown',handleKeyDown)

// function handleKeyDown(e) {
//     let letter = e.key.toLowerCase();
//     // The test() method returns true 
//     // if it finds a match, 
//     // otherwise false.
//     if (letter === 'enter') {
//         if (currentAttempt.length < 5) {
//             return;
//         }
        
//         attempts.push(currentAttempt);
//         currentAttempt = ""
//     } else if (letter === "backspace") {
//        currentAttempt = currentAttempt.slice(0,currentAttempt.length-1)
//     }else if (/[a-z]/.test(letter)) {
//         currentAttempt += letter;
//     }
//     uptadeGrid()
// }

// function buildGrid() {
    // for (let i = 0; i < 6; i++) {
    //     let row = document.createElement('div');
    //     row.className = 'row';
    //     for (let j = 0; j < 5; j++) {
    //         let cell = document.createElement('div');
    //         cell.className = 'cell';
    //         row.appendChild(cell);
    //     }
    //     grid.appendChild(row);
    // }
// }





// function uptadeGrid() {
//     let row = grid.firstChild;
//     for (let attempt of attempts) {
//         drawPastAttempt(row, attempt);
//         row = row.nextSibling;
//     }
//     drawCurrentAttempt(row,currentAttempt);
// };
// function drawCurrentAttempt(row,attempt) {
//     for (let i = 0; i < 5; i++) {
//         let cell = row.children[i];
//         cell.innerText = attempt[i] ?? '';
//     }
// };
// function drawPastAttempt(row, attempt) {
//     for (let i = 0; i < 5; i++) {
//         let cell = row.children[i];
//         cell.innerText = attempt[i] ?? '';
//         cell.style.background = getBgColor(attempt, i);
//     }
// };


// function getBgColor(attempt,i) {
//     let correctLetter = secret[i];
//     let attemptLetter = attempt[i];
    
//     if (correctLetter === attemptLetter) {
//         return '#538d4e';
//     }
//     if (
//         attemptLetter === undefined
//         || secret.indexOf(attemptLetter) === -1) {
//         return 
//     }
//     return "#b59f3b";
// }
let grid = document.getElementById('grid');
let worldLists = ['pizza', 'piano', 'paint', 'panic'];
let attempts = [];
let currentAttempt = '';
let randomIndex = Math.floor(Math.random() * attempts.length);
let secretWord = worldLists[randomIndex];
function drawGrid() {
    for (let i = 0; i < 6; i++) {
        let row = document.createElement('div');
        row.className = 'row';
            for (let j = 0; j < 5; j++) {
                let cell = document.createElement('div');
                cell.className = 'cell';
                row.appendChild(cell);
            }
        grid.appendChild(row);
    }
}
drawGrid();
uptadeGrid();
function uptadeGrid() {
    let row = grid.firstChild;
    for (let attempt of attempts) {
        drawPastAttempt(attempt, row);
        row = row.nextSibling;
    }
    drawCurrentAttempt(row, currentAttempt);
}
function drawPastAttempt(attempt, row) {
    for (let i = 0; i < 5; i++) {
        let cell = row.children[i];
        cell.innerText = attempt[i] ?? '';
        cell.style.backgroundColor = getBgColor(attempt,i);
    }
}
function drawCurrentAttempt(row, attempt) {
  for (let i = 0; i < 5; i++) {
    let cell = row.children[i];
    cell.innerText = attempt[i] ?? "";
  }
}
function getBgColor(attempt,i) {
    let correctLetter = secretWord[i];
    let attemptLetter = attempt[i];
    if (correctLetter === attemptLetter) {
        return "#538d4e";
    } else if (secretWord.indexOf(attemptLetter)===-1|| attemptLetter === undefined) {
        return ;
    } 
    return "#b59f3b";
}
function handleKeyDown(e) {
    let letter = e.key.toLowerCase();
    if (letter === 'enter') {
        if (currentAttempt.length < 5) {
            return
        }
        if (!secretWord.includes(letter)) {
            alert('Таны оруулсан үсэг таах үгэнд алга байна')
            return
        }
        attempts.push(currentAttempt);
        currentAttempt = "";
    } else if (letter === 'backspace') {
            currentAttempt = currentAttempt.slice(0,currentAttempt.length-1);
    } else if (/[a-z]/.test(letter)) {
        currentAttempt = currentAttempt + letter;
    }
    uptadeGrid()
}

document.addEventListener('keydown',handleKeyDown)