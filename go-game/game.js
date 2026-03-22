class GoGame {
    constructor() {
        this.boardSize = 19;
        this.board = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(null));
        this.currentPlayer = 'black';
        this.gameStarted = false;
        this.difficulty = 'easy';
        this.currentLevel = 1;
        this.playerTitle = '新手';
        this.timer = 0;
        this.timerInterval = null;
        this.lastMoveTime = Date.now();
        this.moveReminderInterval = null;
        this.score = { black: 0, white: 0 };
        this.audio = {
            placeStone: new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA=='),
            win: new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA=='),
            lose: new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==')
        };
        this.audioEnabled = true;
        this.titles = [
            { level: 1, title: '新手' },
            { level: 3, title: '初级棋手' },
            { level: 6, title: '中级棋手' },
            { level: 9, title: '高级棋手' },
            { level: 12, title: '大师' },
            { level: 15, title: '围棋之神' }
        ];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.createBoard();
        this.updateTitle();
    }

    setupEventListeners() {
        document.getElementById('start-game').addEventListener('click', () => this.startGame());
        document.getElementById('restart-game').addEventListener('click', () => this.restartGame());
        document.getElementById('back-to-menu').addEventListener('click', () => this.backToMenu());

        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.difficulty = btn.dataset.level;
            });
        });

        document.querySelectorAll('.level-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentLevel = parseInt(btn.dataset.level);
                document.getElementById('current-level').textContent = this.currentLevel;
                this.updateTitle();
            });
        });
    }

    createBoard() {
        const board = document.getElementById('game-board');
        board.innerHTML = '';

        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                const cell = document.createElement('div');
                cell.className = 'board-cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.addEventListener('click', () => this.placeStone(i, j));
                board.appendChild(cell);
            }
        }
    }

    startGame() {
        this.gameStarted = true;
        document.getElementById('game-menu').style.display = 'none';
        this.resetBoard();
        this.startTimer();
        this.startMoveReminder();
        this.updatePlayerTurn();
    }

    resetBoard() {
        this.board = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(null));
        document.querySelectorAll('.stone').forEach(stone => stone.remove());
        this.currentPlayer = 'black';
        this.score = { black: 0, white: 0 };
        this.updateScore();
        this.lastMoveTime = Date.now();
    }

    startTimer() {
        this.timer = 0;
        clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            this.timer++;
            const minutes = Math.floor(this.timer / 60).toString().padStart(2, '0');
            const seconds = (this.timer % 60).toString().padStart(2, '0');
            document.getElementById('timer').textContent = `${minutes}:${seconds}`;
        }, 1000);
    }

    startMoveReminder() {
        clearInterval(this.moveReminderInterval);
        this.moveReminderInterval = setInterval(() => {
            const now = Date.now();
            if (now - this.lastMoveTime > 30000) { // 30秒未落子提醒
                this.showNotification('该你落子了！');
            }
        }, 5000);
    }

    placeStone(row, col) {
        if (!this.gameStarted || this.board[row][col]) return;

        this.board[row][col] = this.currentPlayer;
        this.createStone(row, col, this.currentPlayer);
        this.playSound(this.currentPlayer === 'black' ? 'placeStoneBlack' : 'placeStoneWhite');
        this.lastMoveTime = Date.now();

        // 检查是否有对方棋子被吃
        const capturedStones = this.checkCapture(row, col);
        if (capturedStones.length > 0) {
            this.removeCapturedStones(capturedStones);
        }

        // 检查是否有己方棋子被吃
        const selfCaptured = this.checkSelfCapture(row, col);
        if (selfCaptured.length > 0) {
            // 撤销落子
            this.board[row][col] = null;
            const cell = document.querySelector(`.board-cell[data-row="${row}"][data-col="${col}"]`);
            const stone = cell.querySelector('.stone');
            if (stone) stone.remove();
            return;
        }

        if (this.checkWin(row, col)) {
            this.endGame(this.currentPlayer);
            return;
        }

        this.switchPlayer();
        this.updatePlayerTurn();

        // AI move
        if (this.currentPlayer === 'white') {
            setTimeout(() => this.aiMove(), this.getAiDelay());
        }
    }

    checkCapture(row, col) {
        const opponent = this.currentPlayer === 'black' ? 'white' : 'black';
        const captured = [];
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

        for (const [dr, dc] of directions) {
            const r = row + dr;
            const c = col + dc;
            if (r >= 0 && r < this.boardSize && c >= 0 && c < this.boardSize) {
                if (this.board[r][c] === opponent) {
                    const group = this.getGroup(r, c);
                    if (this.getLiberties(group) === 0) {
                        captured.push(...group);
                    }
                }
            }
        }

        return captured;
    }

    checkSelfCapture(row, col) {
        const group = this.getGroup(row, col);
        if (this.getLiberties(group) === 0) {
            return group;
        }
        return [];
    }

    getGroup(row, col) {
        const color = this.board[row][col];
        if (!color) return [];

        const group = [];
        const visited = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(false));
        const queue = [[row, col]];
        visited[row][col] = true;

        while (queue.length > 0) {
            const [r, c] = queue.shift();
            group.push([r, c]);

            const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
            for (const [dr, dc] of directions) {
                const nr = r + dr;
                const nc = c + dc;
                if (nr >= 0 && nr < this.boardSize && nc >= 0 && nc < this.boardSize) {
                    if (!visited[nr][nc] && this.board[nr][nc] === color) {
                        visited[nr][nc] = true;
                        queue.push([nr, nc]);
                    }
                }
            }
        }

        return group;
    }

    getLiberties(group) {
        const visited = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(false));
        let liberties = 0;

        for (const [r, c] of group) {
            const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
            for (const [dr, dc] of directions) {
                const nr = r + dr;
                const nc = c + dc;
                if (nr >= 0 && nr < this.boardSize && nc >= 0 && nc < this.boardSize) {
                    if (!visited[nr][nc] && !this.board[nr][nc]) {
                        visited[nr][nc] = true;
                        liberties++;
                    }
                }
            }
        }

        return liberties;
    }

    removeCapturedStones(stones) {
        for (const [r, c] of stones) {
            this.board[r][c] = null;
            const cell = document.querySelector(`.board-cell[data-row="${r}"][data-col="${c}"]`);
            const stone = cell.querySelector('.stone');
            if (stone) stone.remove();
        }
        // 播放吃子音效
        this.playSound('capture');
        // 更新分数
        this.score[this.currentPlayer] += stones.length;
        this.updateScore();
    }

    createStone(row, col, player) {
        const cell = document.querySelector(`.board-cell[data-row="${row}"][data-col="${col}"]`);
        const stone = document.createElement('div');
        stone.className = `stone ${player}`;
        cell.appendChild(stone);
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
    }

    updatePlayerTurn() {
        const playerElement = document.getElementById('current-player');
        playerElement.textContent = this.currentPlayer === 'black' ? '黑棋' : '白棋';
        playerElement.style.color = this.currentPlayer === 'black' ? '#000' : '#ff6b6b';
    }

    getAiDelay() {
        switch (this.difficulty) {
            case 'easy': return 500;
            case 'hard': return 1000;
            case 'hell': return 1500;
            default: return 500;
        }
    }

    aiMove() {
        let move;
        switch (this.difficulty) {
            case 'easy':
                move = this.getEasyAiMove();
                break;
            case 'hard':
                move = this.getHardAiMove();
                break;
            case 'hell':
                move = this.getHellAiMove();
                break;
        }

        if (move) {
            this.placeStone(move.row, move.col);
        }
    }

    getEasyAiMove() {
        // 简单AI：优先中心位置，然后随机落子
        const emptyCells = [];
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                if (!this.board[i][j]) {
                    const distanceToCenter = Math.sqrt(Math.pow(i - 9, 2) + Math.pow(j - 9, 2));
                    emptyCells.push({ row: i, col: j, score: 10 - distanceToCenter });
                }
            }
        }
        // 按分数排序，优先选择中心位置
        emptyCells.sort((a, b) => b.score - a.score);
        // 从top 10中随机选择
        const topCells = emptyCells.slice(0, 10);
        return topCells[Math.floor(Math.random() * topCells.length)];
    }

    getHardAiMove() {
        // 困难AI：优先攻击，然后防御，最后选择中心位置
        const moves = [];
        
        // 1. 检查是否能形成胜利
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                if (!this.board[i][j]) {
                    if (this.checkPotentialWin(i, j, 'white')) {
                        return { row: i, col: j };
                    }
                    // 检查是否能形成4子
                    if (this.checkPotentialFour(i, j, 'white')) {
                        moves.push({ row: i, col: j, score: 1000 });
                    }
                }
            }
        }
        
        // 2. 检查是否需要防御
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                if (!this.board[i][j]) {
                    if (this.checkPotentialWin(i, j, 'black')) {
                        return { row: i, col: j };
                    }
                    // 检查是否需要防御4子
                    if (this.checkPotentialFour(i, j, 'black')) {
                        moves.push({ row: i, col: j, score: 900 });
                    }
                }
            }
        }
        
        // 3. 检查是否能形成3子
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                if (!this.board[i][j]) {
                    if (this.checkPotentialThree(i, j, 'white')) {
                        moves.push({ row: i, col: j, score: 800 });
                    }
                }
            }
        }
        
        // 4. 检查是否需要防御3子
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                if (!this.board[i][j]) {
                    if (this.checkPotentialThree(i, j, 'black')) {
                        moves.push({ row: i, col: j, score: 700 });
                    }
                }
            }
        }
        
        // 5. 选择中心位置
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                if (!this.board[i][j]) {
                    const distanceToCenter = Math.sqrt(Math.pow(i - 9, 2) + Math.pow(j - 9, 2));
                    moves.push({ row: i, col: j, score: 100 - distanceToCenter * 5 });
                }
            }
        }
        
        // 按分数排序，选择最高分
        moves.sort((a, b) => b.score - a.score);
        return moves[0];
    }

    getHellAiMove() {
        // 地狱AI：更复杂的评估系统
        const moves = [];
        
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                if (!this.board[i][j]) {
                    const score = this.evaluateMove(i, j, 'white');
                    moves.push({ row: i, col: j, score });
                }
            }
        }
        
        // 按分数排序，选择最高分
        moves.sort((a, b) => b.score - a.score);
        return moves[0];
    }

    evaluateMove(row, col, player) {
        let score = 0;
        const opponent = player === 'black' ? 'white' : 'black';
        
        // 1. 检查是否能形成胜利
        if (this.checkPotentialWin(row, col, player)) {
            score += 10000;
        }
        
        // 2. 检查是否能防御对方胜利
        if (this.checkPotentialWin(row, col, opponent)) {
            score += 9000;
        }
        
        // 3. 检查是否能形成4子
        if (this.checkPotentialFour(row, col, player)) {
            score += 1000;
        }
        
        // 4. 检查是否需要防御对方4子
        if (this.checkPotentialFour(row, col, opponent)) {
            score += 900;
        }
        
        // 5. 检查是否能形成3子
        if (this.checkPotentialThree(row, col, player)) {
            score += 800;
        }
        
        // 6. 检查是否需要防御对方3子
        if (this.checkPotentialThree(row, col, opponent)) {
            score += 700;
        }
        
        // 7. 位置评估（中心位置更有价值）
        const distanceToCenter = Math.sqrt(Math.pow(row - 9, 2) + Math.pow(col - 9, 2));
        score += 100 - distanceToCenter * 5;
        
        // 8. 气的评估
        const tempBoard = JSON.parse(JSON.stringify(this.board));
        tempBoard[row][col] = player;
        const group = this.getGroupInBoard(tempBoard, row, col);
        const liberties = this.getLibertiesInBoard(tempBoard, group);
        score += liberties * 10;
        
        return score;
    }

    checkPotentialFour(row, col, player) {
        const tempBoard = JSON.parse(JSON.stringify(this.board));
        tempBoard[row][col] = player;
        return this.checkFourInBoard(tempBoard, row, col, player);
    }

    checkPotentialThree(row, col, player) {
        const tempBoard = JSON.parse(JSON.stringify(this.board));
        tempBoard[row][col] = player;
        return this.checkThreeInBoard(tempBoard, row, col, player);
    }

    checkFourInBoard(board, row, col, player) {
        return this.checkLineInBoard(board, row, col, player, 4);
    }

    checkThreeInBoard(board, row, col, player) {
        return this.checkLineInBoard(board, row, col, player, 3);
    }

    checkLineInBoard(board, row, col, player, length) {
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, 1], [-1, 1], [1, -1]];
        
        for (const [dr, dc] of directions) {
            let count = 1;
            // 向一个方向延伸
            for (let i = 1; ; i++) {
                const r = row + dr * i;
                const c = col + dc * i;
                if (r >= 0 && r < this.boardSize && c >= 0 && c < this.boardSize && board[r][c] === player) {
                    count++;
                } else {
                    break;
                }
            }
            // 向相反方向延伸
            for (let i = 1; ; i++) {
                const r = row - dr * i;
                const c = col - dc * i;
                if (r >= 0 && r < this.boardSize && c >= 0 && c < this.boardSize && board[r][c] === player) {
                    count++;
                } else {
                    break;
                }
            }
            if (count >= length) {
                return true;
            }
        }
        return false;
    }

    getGroupInBoard(board, row, col) {
        const color = board[row][col];
        if (!color) return [];

        const group = [];
        const visited = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(false));
        const queue = [[row, col]];
        visited[row][col] = true;

        while (queue.length > 0) {
            const [r, c] = queue.shift();
            group.push([r, c]);

            const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
            for (const [dr, dc] of directions) {
                const nr = r + dr;
                const nc = c + dc;
                if (nr >= 0 && nr < this.boardSize && nc >= 0 && nc < this.boardSize) {
                    if (!visited[nr][nc] && board[nr][nc] === color) {
                        visited[nr][nc] = true;
                        queue.push([nr, nc]);
                    }
                }
            }
        }

        return group;
    }

    getLibertiesInBoard(board, group) {
        const visited = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(false));
        let liberties = 0;

        for (const [r, c] of group) {
            const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
            for (const [dr, dc] of directions) {
                const nr = r + dr;
                const nc = c + dc;
                if (nr >= 0 && nr < this.boardSize && nc >= 0 && nc < this.boardSize) {
                    if (!visited[nr][nc] && !board[nr][nc]) {
                        visited[nr][nc] = true;
                        liberties++;
                    }
                }
            }
        }

        return liberties;
    }

    checkPotentialWin(row, col, player) {
        const tempBoard = JSON.parse(JSON.stringify(this.board));
        tempBoard[row][col] = player;
        return this.checkWinInBoard(tempBoard, row, col, player);
    }

    checkWin(row, col, player = null) {
        if (!player) player = this.board[row][col];
        return this.checkWinInBoard(this.board, row, col, player);
    }

    checkWinInBoard(board, row, col, player) {
        // 检查横向
        let count = 1;
        for (let j = col + 1; j < this.boardSize && board[row][j] === player; j++) count++;
        for (let j = col - 1; j >= 0 && board[row][j] === player; j--) count++;
        if (count >= 5) return true;

        // 检查纵向
        count = 1;
        for (let i = row + 1; i < this.boardSize && board[i][col] === player; i++) count++;
        for (let i = row - 1; i >= 0 && board[i][col] === player; i--) count++;
        if (count >= 5) return true;

        // 检查对角线
        count = 1;
        for (let i = row + 1, j = col + 1; i < this.boardSize && j < this.boardSize && board[i][j] === player; i++, j++) count++;
        for (let i = row - 1, j = col - 1; i >= 0 && j >= 0 && board[i][j] === player; i--, j--) count++;
        if (count >= 5) return true;

        // 检查反对角线
        count = 1;
        for (let i = row + 1, j = col - 1; i < this.boardSize && j >= 0 && board[i][j] === player; i++, j--) count++;
        for (let i = row - 1, j = col + 1; i >= 0 && j < this.boardSize && board[i][j] === player; i--, j++) count++;
        if (count >= 5) return true;

        return false;
    }

    endGame(winner) {
        this.gameStarted = false;
        clearInterval(this.timerInterval);
        clearInterval(this.moveReminderInterval);
        
        this.playSound(winner === 'black' ? 'win' : 'lose');
        
        const gameOver = document.getElementById('game-over');
        const result = gameOver.querySelector('.result');
        
        if (winner === 'black') {
            result.textContent = `恭喜你赢了！`;
            this.currentLevel++;
            document.getElementById('current-level').textContent = this.currentLevel;
            this.updateTitle();
        } else {
            result.textContent = `很遗憾，你输了！`;
        }
        
        gameOver.style.display = 'block';
    }

    updateTitle() {
        for (let i = this.titles.length - 1; i >= 0; i--) {
            if (this.currentLevel >= this.titles[i].level) {
                this.playerTitle = this.titles[i].title;
                document.getElementById('player-title').textContent = this.playerTitle;
                break;
            }
        }
    }

    updateScore() {
        document.getElementById('black-score').textContent = this.score.black;
        document.getElementById('white-score').textContent = this.score.white;
    }

    playSound(sound) {
        if (!this.audioEnabled) return;
        
        try {
            this.generateSound(sound);
        } catch (e) {
            console.log('Audio play error:', e);
        }
    }

    generateSound(type) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        switch (type) {
            case 'placeStoneBlack':
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.1);
                break;
            case 'placeStoneWhite':
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.1);
                break;
            case 'capture':
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.2);
                gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.2);
                break;
            case 'win':
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.3);
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
                break;
            case 'lose':
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.3);
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
                break;
        }
    }

    showNotification(message) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    restartGame() {
        document.getElementById('game-over').style.display = 'none';
        this.startGame();
    }

    backToMenu() {
        document.getElementById('game-over').style.display = 'none';
        document.getElementById('game-menu').style.display = 'block';
        clearInterval(this.timerInterval);
        clearInterval(this.moveReminderInterval);
    }
}

// 初始化游戏
window.onload = function() {
    new GoGame();
};