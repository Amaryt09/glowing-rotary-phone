// Lucky Casino - Fake Money Gaming Site
// Main JavaScript file

class LuckyCasino {
    constructor() {
        this.user = {
            name: 'Guest',
            balance: 1000,
            isLoggedIn: false
        };
        
        this.currentGame = null;
        this.currentBet = 25;
        this.lastWin = 0;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadUserData();
        this.updateUI();
        this.showSection('home');
    }
    
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.getAttribute('href').substring(1);
                this.showSection(section);
                this.updateNavigation(e.target);
            });
        });
        
        // Game cards
        document.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('click', () => {
                const game = card.dataset.game;
                this.showSection(game);
                this.updateNavigation(document.querySelector(`[href="#${game}"]`));
            });
        });
        
        // User menu
        document.getElementById('userBtn').addEventListener('click', () => {
            this.toggleUserDropdown();
        });
        
        // Modal events
        document.getElementById('loginBtn').addEventListener('click', () => {
            this.showModal('loginModal');
        });
        
        document.getElementById('registerBtn').addEventListener('click', () => {
            this.showModal('registerModal');
        });
        
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });
        
        // Close modals
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                this.hideModal(e.target.closest('.modal'));
            });
        });
        
        // Modal forms
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
        
        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });
        
        // Initialize games
        this.initSlotMachine();
        this.initBlackjack();
        this.initRoulette();
        
        // Leaderboard tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchLeaderboardTab(e.target);
            });
        });
    }
    
    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        this.currentGame = sectionId;
    }
    
    updateNavigation(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }
    
    toggleUserDropdown() {
        const dropdown = document.getElementById('userDropdown');
        dropdown.classList.toggle('show');
    }
    
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.style.display = 'block';
        this.hideUserDropdown();
    }
    
    hideModal(modal) {
        modal.style.display = 'none';
    }
    
    hideUserDropdown() {
        document.getElementById('userDropdown').classList.remove('show');
    }
    
    handleLogin() {
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        
        // Simulate login (in real app, this would validate against server)
        if (username && password) {
            this.user.name = username;
            this.user.isLoggedIn = true;
            this.user.balance = this.getStoredBalance(username) || 1000;
            
            this.saveUserData();
            this.updateUI();
            this.hideModal(document.getElementById('loginModal'));
            this.showNotification('Login successful!', 'success');
        } else {
            this.showNotification('Please enter username and password', 'error');
        }
    }
    
    handleRegister() {
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        
        if (username && email && password) {
            // Check if user already exists
            if (this.userExists(username)) {
                this.showNotification('Username already exists', 'error');
                return;
            }
            
            this.user.name = username;
            this.user.isLoggedIn = true;
            this.user.balance = 1000; // Starting balance
            
            this.saveUserData();
            this.updateUI();
            this.hideModal(document.getElementById('registerModal'));
            this.showNotification('Registration successful! Welcome to Lucky Casino!', 'success');
        } else {
            this.showNotification('Please fill in all fields', 'error');
        }
    }
    
    logout() {
        this.user.name = 'Guest';
        this.user.isLoggedIn = false;
        this.user.balance = 1000;
        
        this.saveUserData();
        this.updateUI();
        this.showNotification('Logged out successfully', 'success');
    }
    
    userExists(username) {
        const users = JSON.parse(localStorage.getItem('casinoUsers') || '{}');
        return users.hasOwnProperty(username);
    }
    
    getStoredBalance(username) {
        const users = JSON.parse(localStorage.getItem('casinoUsers') || '{}');
        return users[username]?.balance;
    }
    
    saveUserData() {
        if (this.user.isLoggedIn) {
            const users = JSON.parse(localStorage.getItem('casinoUsers') || '{}');
            users[this.user.name] = {
                balance: this.user.balance,
                lastLogin: new Date().toISOString()
            };
            localStorage.setItem('casinoUsers', JSON.stringify(users));
        }
        localStorage.setItem('currentUser', JSON.stringify(this.user));
    }
    
    loadUserData() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.user = { ...this.user, ...JSON.parse(savedUser) };
        }
    }
    
    updateUI() {
        document.getElementById('userName').textContent = this.user.name;
        document.getElementById('userBalance').textContent = `$${this.user.balance.toLocaleString()}`;
        
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        
        if (this.user.isLoggedIn) {
            loginBtn.style.display = 'none';
            registerBtn.style.display = 'none';
            logoutBtn.style.display = 'block';
        } else {
            loginBtn.style.display = 'block';
            registerBtn.style.display = 'block';
            logoutBtn.style.display = 'none';
        }
    }
    
    updateBalance(amount) {
        this.user.balance += amount;
        this.updateUI();
        this.saveUserData();
    }
    
    canAfford(amount) {
        return this.user.balance >= amount;
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 3000;
            font-weight: 600;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Slot Machine Game
    initSlotMachine() {
        const symbols = ['🍒', '🍋', '🍊', '🍇', '💎', '7️⃣'];
        const reels = ['reel1', 'reel2', 'reel3'];
        
        // Bet buttons
        document.querySelectorAll('#slots .bet-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('#slots .bet-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentBet = parseInt(btn.dataset.bet);
                document.getElementById('currentBet').textContent = this.currentBet;
            });
        });
        
        // Custom bet input
        document.getElementById('customBet').addEventListener('change', (e) => {
            const customBet = parseInt(e.target.value);
            if (customBet > 0) {
                this.currentBet = customBet;
                document.getElementById('currentBet').textContent = this.currentBet;
                document.querySelectorAll('#slots .bet-btn').forEach(b => b.classList.remove('active'));
            }
        });
        
        // Spin button
        document.getElementById('spinBtn').addEventListener('click', () => {
            this.spinSlotMachine();
        });
        
        // Set default bet
        document.querySelector('#slots .bet-btn[data-bet="25"]').classList.add('active');
    }
    
    spinSlotMachine() {
        if (!this.canAfford(this.currentBet)) {
            this.showNotification('Insufficient funds!', 'error');
            return;
        }
        
        this.updateBalance(-this.currentBet);
        
        const reels = ['reel1', 'reel2', 'reel3'];
        const symbols = ['🍒', '🍋', '🍊', '🍇', '💎', '7️⃣'];
        const results = [];
        
        // Add spinning animation
        reels.forEach(reelId => {
            const reel = document.getElementById(reelId);
            reel.classList.add('spinning');
        });
        
        // Disable spin button
        document.getElementById('spinBtn').disabled = true;
        
        // Stop reels after animation
        setTimeout(() => {
            reels.forEach((reelId, index) => {
                const reel = document.getElementById(reelId);
                reel.classList.remove('spinning');
                
                const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
                results.push(randomSymbol);
                
                // Update reel display
                const symbolElement = reel.querySelector('.symbol');
                symbolElement.textContent = randomSymbol;
            });
            
            // Check for wins
            const winAmount = this.checkSlotWin(results);
            this.lastWin = winAmount;
            
            if (winAmount > 0) {
                this.updateBalance(winAmount);
                this.showNotification(`You won $${winAmount}!`, 'success');
                document.getElementById('lastWin').textContent = winAmount;
            } else {
                this.showNotification('Better luck next time!', 'error');
                document.getElementById('lastWin').textContent = '0';
            }
            
            // Re-enable spin button
            document.getElementById('spinBtn').disabled = false;
        }, 2000);
    }
    
    checkSlotWin(results) {
        const [a, b, c] = results;
        
        // Three of a kind
        if (a === b && b === c) {
            if (a === '7️⃣') return this.currentBet * 100; // 7s pay 100x
            if (a === '💎') return this.currentBet * 50;  // Diamonds pay 50x
            return this.currentBet * 10; // Other symbols pay 10x
        }
        
        // Two of a kind
        if (a === b || b === c || a === c) {
            return this.currentBet * 2;
        }
        
        return 0;
    }
    
    // Blackjack Game
    initBlackjack() {
        this.blackjackGame = {
            deck: [],
            playerCards: [],
            dealerCards: [],
            playerScore: 0,
            dealerScore: 0,
            gameActive: false,
            bet: 0
        };
        
        // Bet buttons
        document.querySelectorAll('#blackjack .bet-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (!this.blackjackGame.gameActive) {
                    document.querySelectorAll('#blackjack .bet-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.blackjackGame.bet = parseInt(btn.dataset.bet);
                }
            });
        });
        
        // Game buttons
        document.getElementById('dealBtn').addEventListener('click', () => {
            this.dealBlackjack();
        });
        
        document.getElementById('hitBtn').addEventListener('click', () => {
            this.hitBlackjack();
        });
        
        document.getElementById('standBtn').addEventListener('click', () => {
            this.standBlackjack();
        });
        
        document.getElementById('newGameBtn').addEventListener('click', () => {
            this.newBlackjackGame();
        });
        
        // Set default bet
        document.querySelector('#blackjack .bet-btn[data-bet="50"]').classList.add('active');
        this.blackjackGame.bet = 50;
    }
    
    createDeck() {
        const suits = ['♠', '♥', '♦', '♣'];
        const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        const deck = [];
        
        for (let suit of suits) {
            for (let value of values) {
                deck.push({ suit, value });
            }
        }
        
        // Shuffle deck
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        
        return deck;
    }
    
    dealBlackjack() {
        if (!this.canAfford(this.blackjackGame.bet)) {
            this.showNotification('Insufficient funds!', 'error');
            return;
        }
        
        this.updateBalance(-this.blackjackGame.bet);
        
        this.blackjackGame.deck = this.createDeck();
        this.blackjackGame.playerCards = [];
        this.blackjackGame.dealerCards = [];
        this.blackjackGame.gameActive = true;
        
        // Deal initial cards
        this.blackjackGame.playerCards.push(this.blackjackGame.deck.pop());
        this.blackjackGame.dealerCards.push(this.blackjackGame.deck.pop());
        this.blackjackGame.playerCards.push(this.blackjackGame.deck.pop());
        this.blackjackGame.dealerCards.push(this.blackjackGame.deck.pop());
        
        this.updateBlackjackDisplay();
        this.updateBlackjackButtons();
        
        document.getElementById('gameStatus').textContent = 'Game in progress! Hit or Stand?';
    }
    
    hitBlackjack() {
        if (!this.blackjackGame.gameActive) return;
        
        this.blackjackGame.playerCards.push(this.blackjackGame.deck.pop());
        this.updateBlackjackDisplay();
        
        this.blackjackGame.playerScore = this.calculateScore(this.blackjackGame.playerCards);
        
        if (this.blackjackGame.playerScore > 21) {
            this.endBlackjackGame('Bust! You lose!');
        }
    }
    
    standBlackjack() {
        if (!this.blackjackGame.gameActive) return;
        
        // Dealer plays
        while (this.blackjackGame.dealerScore < 17) {
            this.blackjackGame.dealerCards.push(this.blackjackGame.deck.pop());
            this.blackjackGame.dealerScore = this.calculateScore(this.blackjackGame.dealerCards);
        }
        
        this.updateBlackjackDisplay();
        this.determineBlackjackWinner();
    }
    
    calculateScore(cards) {
        let score = 0;
        let aces = 0;
        
        for (let card of cards) {
            if (card.value === 'A') {
                aces++;
                score += 11;
            } else if (['J', 'Q', 'K'].includes(card.value)) {
                score += 10;
            } else {
                score += parseInt(card.value);
            }
        }
        
        // Adjust for aces
        while (score > 21 && aces > 0) {
            score -= 10;
            aces--;
        }
        
        return score;
    }
    
    updateBlackjackDisplay() {
        const playerCardsDiv = document.getElementById('playerCards');
        const dealerCardsDiv = document.getElementById('dealerCards');
        
        // Clear previous cards
        playerCardsDiv.innerHTML = '';
        dealerCardsDiv.innerHTML = '';
        
        // Display player cards
        this.blackjackGame.playerCards.forEach(card => {
            const cardElement = this.createCardElement(card);
            playerCardsDiv.appendChild(cardElement);
        });
        
        // Display dealer cards
        this.blackjackGame.dealerCards.forEach((card, index) => {
            if (this.blackjackGame.gameActive && index === 1) {
                // Hide second dealer card during game
                const cardElement = document.createElement('div');
                cardElement.className = 'card card-back';
                cardElement.textContent = '?';
                dealerCardsDiv.appendChild(cardElement);
            } else {
                const cardElement = this.createCardElement(card);
                dealerCardsDiv.appendChild(cardElement);
            }
        });
        
        // Update scores
        this.blackjackGame.playerScore = this.calculateScore(this.blackjackGame.playerCards);
        this.blackjackGame.dealerScore = this.calculateScore(this.blackjackGame.dealerCards);
        
        document.getElementById('playerScore').textContent = this.blackjackGame.playerScore;
        document.getElementById('dealerScore').textContent = this.blackjackGame.gameActive ? '?' : this.blackjackGame.dealerScore;
    }
    
    createCardElement(card) {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        
        if (['♥', '♦'].includes(card.suit)) {
            cardElement.classList.add('red');
        } else {
            cardElement.classList.add('black');
        }
        
        cardElement.textContent = `${card.value}${card.suit}`;
        return cardElement;
    }
    
    determineBlackjackWinner() {
        const playerScore = this.blackjackGame.playerScore;
        const dealerScore = this.blackjackGame.dealerScore;
        
        if (dealerScore > 21) {
            this.endBlackjackGame('Dealer busts! You win!');
            this.updateBalance(this.blackjackGame.bet * 2);
        } else if (playerScore > dealerScore) {
            this.endBlackjackGame('You win!');
            this.updateBalance(this.blackjackGame.bet * 2);
        } else if (playerScore < dealerScore) {
            this.endBlackjackGame('Dealer wins!');
        } else {
            this.endBlackjackGame('Push! It\'s a tie!');
            this.updateBalance(this.blackjackGame.bet);
        }
    }
    
    endBlackjackGame(message) {
        this.blackjackGame.gameActive = false;
        document.getElementById('gameStatus').textContent = message;
        this.updateBlackjackButtons();
        this.updateBlackjackDisplay();
    }
    
    newBlackjackGame() {
        this.blackjackGame.gameActive = false;
        this.blackjackGame.playerCards = [];
        this.blackjackGame.dealerCards = [];
        this.blackjackGame.playerScore = 0;
        this.blackjackGame.dealerScore = 0;
        
        this.updateBlackjackDisplay();
        this.updateBlackjackButtons();
        document.getElementById('gameStatus').textContent = 'Place your bet and deal cards!';
    }
    
    updateBlackjackButtons() {
        const dealBtn = document.getElementById('dealBtn');
        const hitBtn = document.getElementById('hitBtn');
        const standBtn = document.getElementById('standBtn');
        const newGameBtn = document.getElementById('newGameBtn');
        
        if (this.blackjackGame.gameActive) {
            dealBtn.disabled = true;
            hitBtn.disabled = false;
            standBtn.disabled = false;
            newGameBtn.disabled = true;
        } else {
            dealBtn.disabled = false;
            hitBtn.disabled = true;
            standBtn.disabled = true;
            newGameBtn.disabled = false;
        }
    }
    
    // Roulette Game
    initRoulette() {
        this.rouletteGame = {
            bets: {},
            totalBet: 0,
            lastNumber: null
        };
        
        // Bet cells
        document.querySelectorAll('.bet-cell').forEach(cell => {
            cell.addEventListener('click', () => {
                this.placeRouletteBet(cell);
            });
        });
        
        // Spin button
        document.getElementById('spinRoulette').addEventListener('click', () => {
            this.spinRoulette();
        });
        
        // Bet amount input
        document.getElementById('rouletteBet').addEventListener('change', (e) => {
            // Update bet amount for future bets
        });
    }
    
    placeRouletteBet(cell) {
        const betAmount = parseInt(document.getElementById('rouletteBet').value);
        
        if (!this.canAfford(betAmount)) {
            this.showNotification('Insufficient funds!', 'error');
            return;
        }
        
        const betType = cell.dataset.bet;
        
        if (!this.rouletteGame.bets[betType]) {
            this.rouletteGame.bets[betType] = 0;
        }
        
        this.rouletteGame.bets[betType] += betAmount;
        this.rouletteGame.totalBet += betAmount;
        
        this.updateBalance(-betAmount);
        cell.classList.add('selected');
        
        this.updateRouletteInfo();
        this.showNotification(`Bet $${betAmount} on ${betType}`, 'success');
    }
    
    spinRoulette() {
        if (this.rouletteGame.totalBet === 0) {
            this.showNotification('Place some bets first!', 'error');
            return;
        }
        
        // Generate random number (0-36)
        const winningNumber = Math.floor(Math.random() * 37);
        this.rouletteGame.lastNumber = winningNumber;
        
        // Add spinning animation
        const wheel = document.getElementById('rouletteWheel');
        wheel.classList.add('spinning');
        
        // Disable spin button
        document.getElementById('spinRoulette').disabled = true;
        
        setTimeout(() => {
            wheel.classList.remove('spinning');
            
            // Check wins
            const winAmount = this.checkRouletteWin(winningNumber);
            
            if (winAmount > 0) {
                this.updateBalance(winAmount);
                this.showNotification(`Winning number: ${winningNumber}! You won $${winAmount}!`, 'success');
            } else {
                this.showNotification(`Winning number: ${winningNumber}. Better luck next time!`, 'error');
            }
            
            // Reset bets
            this.resetRouletteBets();
            document.getElementById('spinRoulette').disabled = false;
        }, 3000);
    }
    
    checkRouletteWin(winningNumber) {
        let totalWin = 0;
        
        for (let [betType, betAmount] of Object.entries(this.rouletteGame.bets)) {
            if (this.isRouletteWin(betType, winningNumber)) {
                const multiplier = this.getRouletteMultiplier(betType);
                totalWin += betAmount * multiplier;
            }
        }
        
        return totalWin;
    }
    
    isRouletteWin(betType, winningNumber) {
        switch (betType) {
            case 'red':
                return [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(winningNumber);
            case 'black':
                return [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35].includes(winningNumber);
            case 'even':
                return winningNumber !== 0 && winningNumber % 2 === 0;
            case 'odd':
                return winningNumber % 2 === 1;
            case '1-18':
                return winningNumber >= 1 && winningNumber <= 18;
            case '19-36':
                return winningNumber >= 19 && winningNumber <= 36;
            case '0':
                return winningNumber === 0;
            default:
                // Direct number bet
                return parseInt(betType) === winningNumber;
        }
    }
    
    getRouletteMultiplier(betType) {
        switch (betType) {
            case 'red':
            case 'black':
            case 'even':
            case 'odd':
            case '1-18':
            case '19-36':
                return 2;
            case '0':
                return 35;
            default:
                // Direct number bet
                return 35;
        }
    }
    
    resetRouletteBets() {
        this.rouletteGame.bets = {};
        this.rouletteGame.totalBet = 0;
        
        document.querySelectorAll('.bet-cell').forEach(cell => {
            cell.classList.remove('selected');
        });
        
        this.updateRouletteInfo();
    }
    
    updateRouletteInfo() {
        document.getElementById('lastNumber').textContent = this.rouletteGame.lastNumber || '-';
        document.getElementById('totalBet').textContent = this.rouletteGame.totalBet;
    }
    
    // Leaderboard
    switchLeaderboardTab(activeTab) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeTab.classList.add('active');
        
        // In a real app, this would fetch different leaderboard data
        this.showNotification(`Switched to ${activeTab.dataset.tab} leaderboard`, 'success');
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize the casino when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.casino = new LuckyCasino();
});

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-menu')) {
        document.getElementById('userDropdown').classList.remove('show');
    }
    
    if (e.target.classList.contains('modal')) {
        window.casino.hideModal(e.target);
    }
});