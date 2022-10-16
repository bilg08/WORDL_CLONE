import { useState, useEffect, useRef } from "react";
let GREY = "#212121";
let GREEN = "#538d4e";
let YELLOW = "#b59f3b";
let BLACK = "#000";
export default function Wordle() {
  let [history, setHistory] = useState([]);
  let [currentAttempt, setCurrentAttempt] = useState("");
  let loadedRef = useRef(false);
  let animatingRef = useRef(false);
  let attempt = useRef();

  useEffect(() => {
    if (loadedRef.current) {
      return;
    }
    loadedRef.current = true;
    let savedHistory = loadHistory();
    if (savedHistory) {
      setHistory(savedHistory);
    }
  });

  function handleKeyDown(e) {
    if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) {
      return;
    }

    handleKey(e.key);
  }
  async function handleKey(key) {
    if (history.length === 6) {
      return;
    }
    if (animatingRef.current === true) {
      return;
    }
    let letter = key.toLowerCase();
    if (letter === "enter") {
      if (currentAttempt.length < 5) {
        return;
      }

      if (history.length === 5 && currentAttempt !== secret) {
          alert(secret);
          localStorage.clear();
          location.reload();
      }
      let newHistory = [...history, currentAttempt];

      setHistory(newHistory);
      saveHistory(newHistory);
      setCurrentAttempt("");
      waitForAnimation(currentAttempt);
    } else if (letter === "backspace") {
      setCurrentAttempt(currentAttempt.slice(0, currentAttempt.length - 1));
    } else if (/^[a-z]$/.test(letter)) {
      if (currentAttempt.length < 5) {
        setCurrentAttempt(currentAttempt + letter);
        currentAttempt += letter;
      }
    }
  }
  function waitForAnimation(currentAttempt) {
    attempt.current = currentAttempt;
    if (animatingRef.current === true) {
      throw Error("should never happen");
    }
    animatingRef.current = true;
    setTimeout(() => {
      animatingRef.current = false;
      if (attempt.current === secret) {
        alert("zov taalaa");
        localStorage.clear();
        location.reload();
      }
    }, 2000);
  }
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <div>
      <h1>Wordle</h1>
      <Grid history={history} currentAttempt={currentAttempt} />
      <Keyboard onKey={handleKey} />
    </div>
  );
}

let wordlist = ["table,", "chair"];
let randomIndex = Math.floor(Math.random() * history.length);
let secret = wordlist[randomIndex];
function Grid({ history, currentAttempt }) {
  let rows = [];
  for (let i = 0; i < 6; i++) {
    if (i < history.length) {
      rows.push(<Attempt key={i} attempt={history[i]} solved={true} />);
    } else if (i === history.length) {
      rows.push(<Attempt key={i} attempt={currentAttempt} solved={false} />);
    } else {
      rows.push(<Attempt key={i} attempt="" solved={false} />);
    }
  }
  return <div id="grid">{rows}</div>;
}

function Attempt({ attempt, solved }) {
  let cells = [];
  for (let i = 0; i < 5; i++) {
    cells.push(<Cell key={i} index={i} attempt={attempt} solved={solved} />);
  }
  return <div>{cells}</div>;
}
function Cell({ index, attempt, solved }) {
  let content;
  let hasLetter = attempt[index] !== undefined;
  let color = getBgColor(attempt, index);
  if (hasLetter) {
    content = attempt[index];
  } else {
    content = <div style={{ opacity: 0 }}>X</div>;
  }
  return (
    <div className={"cell " + (solved ? "solved" : "")} key={index}>
      <div className="surface" style={{ transitionDelay: index * 300 + "ms" }}>
        <div
          className="front"
          style={{
            backgroundColor: BLACK,
            borderColor: hasLetter ? GREY : "",
          }}>
          {content}
        </div>
        <div
          className="back"
          style={{
            backgroundColor: color,
            borderColor: color,
          }}>
          {content}
        </div>
      </div>
    </div>
  );
}
function getBgColor(attempt, i) {
  let correctLetter = secret[i];
  let attemptLetter = attempt[i];
  if (attemptLetter === undefined || secret.indexOf(attemptLetter) === -1) {
    return GREY;
  }
  if (correctLetter === attemptLetter) {
    return GREEN;
  }
  return YELLOW;
}
function Keyboard({ onKey }) {
  return (
    <div id="keyboard">
      <BuildKeyboardRow onKey={onKey} letters="qwertyuiop" isLast={false} />
      <BuildKeyboardRow onKey={onKey} letters="asdfghjkl" isLast={false} />
      <BuildKeyboardRow onKey={onKey} letters="zxcvbnm" isLast={true} />;
    </div>
  );
}
function BuildKeyboardRow({ letters, onKey, isLast }) {
  let buttons = [];
  if (isLast) {
    buttons.push(
      <Button onKey={onKey} key="enter" buttonKey="Enter">
        Enter
      </Button>
    );
  }
  for (let letter of letters) {
    buttons.push(
      <Button onKey={onKey} key={letter} buttonKey={letter}>
        {letter}
      </Button>
    );
  }
  if (isLast) {
    buttons.push(
      <Button onKey={onKey} key="backspace" buttonKey="Backspace">
        Backspace
      </Button>
    );
  }
  return <div>{buttons}</div>;
}
function Button({ buttonKey, children, onKey }) {
  return (
    <button
      style={{
        background: GREY,
      }}
      className="button"
      onClick={() => {
        onKey(buttonKey);
      }}>
      {children}
    </button>
  );
}

function loadHistory() {
  let data;
  try {
    data = JSON.parse(localStorage.getItem("data"));
  } catch (error) {}

  if (data != null) {
    return data.history;
  }
}

function saveHistory(history) {
  let data = JSON.stringify({ secret, history });
  try {
    localStorage.setItem("data", data);
  } catch (error) {}
}
