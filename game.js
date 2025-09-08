const urlParams = new URLSearchParams(window.location.search);
const stageId = parseInt(urlParams.get("id")) || 0;
const stage = stages.find(s => s.id === stageId);

// DOM
const board = document.getElementById("board");
const cardsDiv = document.getElementById("cards");
const backBtn = document.getElementById("back-btn");
const clearBtn = document.getElementById("clear-btn");

let boardArray = JSON.parse(JSON.stringify(stage.initial));

// レンダリング
function renderBoard() {
    const size = stage.size.split("x").map(Number)[0];
    board.style.gridTemplateColumns = `repeat(${size}, 40px)`;
    board.innerHTML = "";
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.textContent = boardArray[r][c];
            board.appendChild(cell);
        }
    }
}

function checkClear() {
    const goal = stage.goal;
    for (let r = 0; r < goal.length; r++) {
        for (let c = 0; c < goal[r].length; c++) {
            if (boardArray[r][c] !== goal[r][c]) return false;
        }
    }
    return true;
}

// カード適用
function applyCard(card, index) {
    if (card.used) return;
    const size = stage.size.split("x").map(Number)[0];
    if (card.type === "NOT") {
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                boardArray[r][c] = boardArray[r][c] ? 0 : 1;
            }
        }
    } else {
        const seq = card.sequence;
        for (let i = 0; i < size; i++) {
            if (card.type === "OR") boardArray[i] |= seq[i];
            if (card.type === "AND") boardArray[i] &= seq[i];
            if (card.type === "XOR") boardArray[i] ^= seq[i];
        }
    }
    card.used = true;
    renderCards();
    renderBoard();
    if (checkClear()) clearBtn.style.display = "block";
}

// カード表示
function renderCards() {
    cardsDiv.innerHTML = "";
    stage.cards.forEach((card, idx) => {
        const div = document.createElement("div");
        div.className = "card";
        if (card.used) div.classList.add("used");
        div.textContent = card.type + (card.sequence ? card.sequence.join("") : "");
        div.addEventListener("click", () => applyCard(card, idx));
        cardsDiv.appendChild(div);
    });
}

// 初期化
renderBoard();
renderCards();

// 戻るボタン
backBtn.addEventListener("click", () => {
    if (confirm("ステージ選択に戻りますか？")) location.href = "stage_select.html";
});
clearBtn.addEventListener("click", () => location.href = "stage_select.html");
