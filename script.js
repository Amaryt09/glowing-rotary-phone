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
        this.initPoker();
        this.initBaccarat();
        this.initCraps();
        this.initKeno();
        
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
        
        // Generate results first
        reels.forEach(() => {
            results.push(symbols[Math.floor(Math.random() * symbols.length)]);
        });
        
        // Add spinning animation to each reel with different stop times
        reels.forEach((reelId, index) => {
            const reel = document.getElementById(reelId);
            reel.classList.add('spinning');
            
            // Stop each reel at different times for more realistic effect
            setTimeout(() => {
                reel.classList.remove('spinning');
                
                // Update reel display with the actual result
                const symbolElement = reel.querySelector('.symbol');
                symbolElement.textContent = results[index];
                symbolElement.classList.add('win-animation');
                
                // Remove animation class after a short delay
                setTimeout(() => {
                    symbolElement.classList.remove('win-animation');
                }, 500);
            }, 1000 + (index * 500)); // Staggered stopping
        });
        
        // Disable spin button
        document.getElementById('spinBtn').disabled = true;
        
        // Check for wins after all reels stop
        setTimeout(() => {
            const winAmount = this.checkSlotWin(results);
            this.lastWin = winAmount;
            
            if (winAmount > 0) {
                this.updateBalance(winAmount);
                this.showNotification(`You won $${winAmount}!`, 'success');
                document.getElementById('lastWin').textContent = winAmount;
                
                // Add win animation to winning reels
                reels.forEach((reelId, index) => {
                    const reel = document.getElementById(reelId);
                    if (this.isWinningReel(results, index)) {
                        reel.classList.add('win-glow');
                        setTimeout(() => {
                            reel.classList.remove('win-glow');
                        }, 2000);
                    }
                });
            } else {
                this.showNotification('Better luck next time!', 'error');
                document.getElementById('lastWin').textContent = '0';
            }
            
            // Re-enable spin button
            document.getElementById('spinBtn').disabled = false;
        }, 3000);
    }
    
    isWinningReel(results, index) {
        const [a, b, c] = results;
        // Check if this reel is part of a winning combination
        if (a === b && b === c) return true; // Three of a kind
        if (index === 0 && (a === b || a === c)) return true; // First reel matches
        if (index === 1 && (a === b || b === c)) return true; // Second reel matches
        if (index === 2 && (b === c || a === c)) return true; // Third reel matches
        return false;
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
        const ball = wheel.querySelector('.ball');
        
        // Calculate the angle for the winning number
        const numberAngles = this.getRouletteNumberAngles();
        const targetAngle = numberAngles[winningNumber];
        
        // Add multiple spins plus the target angle
        const totalSpins = 5 + Math.random() * 3; // 5-8 spins
        const finalAngle = (totalSpins * 360) + targetAngle;
        
        wheel.style.transform = `rotate(${finalAngle}deg)`;
        wheel.classList.add('spinning');
        
        // Animate the ball
        ball.style.animation = 'ballSpin 3s ease-out';
        
        // Disable spin button
        document.getElementById('spinRoulette').disabled = true;
        
        setTimeout(() => {
            wheel.classList.remove('spinning');
            ball.style.animation = '';
            
            // Highlight the winning number
            this.highlightWinningNumber(winningNumber);
            
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
    
    getRouletteNumberAngles() {
        // European roulette number order
        const numbers = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
        const angles = {};
        
        numbers.forEach((num, index) => {
            angles[num] = (index * (360 / 37)) - 90; // -90 to start at top
        });
        
        return angles;
    }
    
    highlightWinningNumber(number) {
        // Remove previous highlights
        document.querySelectorAll('.number').forEach(el => {
            el.classList.remove('winning-number');
        });
        
        // Find and highlight the winning number
        const numberElements = document.querySelectorAll('.number');
        numberElements.forEach(el => {
            if (parseInt(el.textContent) === number) {
                el.classList.add('winning-number');
                setTimeout(() => {
                    el.classList.remove('winning-number');
                }, 3000);
            }
        });
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
    
    // Poker Game
    initPoker() {
        this.pokerGame = {
            deck: [],
            hand: [],
            selectedCards: [],
            bet: 0,
            gameActive: false
        };
        
        // Bet buttons
        document.querySelectorAll('#poker .bet-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (!this.pokerGame.gameActive) {
                    document.querySelectorAll('#poker .bet-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.pokerGame.bet = parseInt(btn.dataset.bet);
                }
            });
        });
        
        // Game buttons
        document.getElementById('dealPokerBtn').addEventListener('click', () => {
            this.dealPoker();
        });
        
        document.getElementById('drawPokerBtn').addEventListener('click', () => {
            this.drawPoker();
        });
        
        document.getElementById('newPokerGameBtn').addEventListener('click', () => {
            this.newPokerGame();
        });
        
        // Card selection
        document.querySelectorAll('#poker .card').forEach((card, index) => {
            card.addEventListener('click', () => {
                this.togglePokerCard(index);
            });
        });
        
        // Set default bet
        document.querySelector('#poker .bet-btn[data-bet="10"]').classList.add('active');
        this.pokerGame.bet = 10;
    }
    
    dealPoker() {
        if (!this.canAfford(this.pokerGame.bet)) {
            this.showNotification('Insufficient funds!', 'error');
            return;
        }
        
        this.updateBalance(-this.pokerGame.bet);
        
        this.pokerGame.deck = this.createDeck();
        this.pokerGame.hand = [];
        this.pokerGame.selectedCards = [];
        this.pokerGame.gameActive = true;
        
        // Deal 5 cards
        for (let i = 0; i < 5; i++) {
            this.pokerGame.hand.push(this.pokerGame.deck.pop());
        }
        
        this.updatePokerDisplay();
        this.updatePokerButtons();
        
        document.getElementById('pokerHand').textContent = 'Select cards to hold';
    }
    
    drawPoker() {
        // Replace unselected cards
        for (let i = 0; i < 5; i++) {
            if (!this.pokerGame.selectedCards.includes(i)) {
                this.pokerGame.hand[i] = this.pokerGame.deck.pop();
            }
        }
        
        this.updatePokerDisplay();
        
        // Check for winning hand
        const handRank = this.evaluatePokerHand(this.pokerGame.hand);
        const winAmount = this.getPokerPayout(handRank, this.pokerGame.bet);
        
        if (winAmount > 0) {
            this.updateBalance(winAmount);
            this.showNotification(`${handRank.name}! You won $${winAmount}!`, 'success');
            document.getElementById('pokerWin').textContent = winAmount;
        } else {
            this.showNotification('No winning hand', 'error');
            document.getElementById('pokerWin').textContent = '0';
        }
        
        document.getElementById('pokerHand').textContent = handRank.name;
        document.getElementById('pokerPayout').textContent = winAmount > 0 ? `$${winAmount}` : '$0';
        
        this.pokerGame.gameActive = false;
        this.updatePokerButtons();
    }
    
    togglePokerCard(index) {
        if (!this.pokerGame.gameActive) return;
        
        if (this.pokerGame.selectedCards.includes(index)) {
            this.pokerGame.selectedCards = this.pokerGame.selectedCards.filter(i => i !== index);
        } else {
            this.pokerGame.selectedCards.push(index);
        }
        
        this.updatePokerDisplay();
    }
    
    updatePokerDisplay() {
        this.pokerGame.hand.forEach((card, index) => {
            const cardElement = document.getElementById(`pokerCard${index + 1}`);
            cardElement.textContent = `${card.value}${card.suit}`;
            
            if (['♥', '♦'].includes(card.suit)) {
                cardElement.classList.add('red');
                cardElement.classList.remove('black');
            } else {
                cardElement.classList.add('black');
                cardElement.classList.remove('red');
            }
            
            if (this.pokerGame.selectedCards.includes(index)) {
                cardElement.classList.add('selected');
            } else {
                cardElement.classList.remove('selected');
            }
        });
    }
    
    updatePokerButtons() {
        const dealBtn = document.getElementById('dealPokerBtn');
        const drawBtn = document.getElementById('drawPokerBtn');
        const newGameBtn = document.getElementById('newPokerGameBtn');
        
        if (this.pokerGame.gameActive) {
            dealBtn.disabled = true;
            drawBtn.disabled = false;
            newGameBtn.disabled = true;
        } else {
            dealBtn.disabled = false;
            drawBtn.disabled = true;
            newGameBtn.disabled = false;
        }
    }
    
    newPokerGame() {
        this.pokerGame.gameActive = false;
        this.pokerGame.hand = [];
        this.pokerGame.selectedCards = [];
        
        // Reset display
        for (let i = 1; i <= 5; i++) {
            const cardElement = document.getElementById(`pokerCard${i}`);
            cardElement.textContent = '?';
            cardElement.classList.remove('selected', 'red', 'black');
        }
        
        this.updatePokerButtons();
        document.getElementById('pokerHand').textContent = '-';
        document.getElementById('pokerPayout').textContent = '-';
    }
    
    evaluatePokerHand(hand) {
        const values = hand.map(card => card.value);
        const suits = hand.map(card => card.suit);
        
        // Convert face cards to numbers
        const numericValues = values.map(val => {
            if (val === 'A') return 14;
            if (val === 'K') return 13;
            if (val === 'Q') return 12;
            if (val === 'J') return 11;
            return parseInt(val);
        }).sort((a, b) => b - a);
        
        const isFlush = suits.every(suit => suit === suits[0]);
        const isStraight = this.isStraight(numericValues);
        
        if (isFlush && isStraight) {
            return { name: 'Royal Flush', rank: 9 };
        }
        if (isFlush && isStraight) {
            return { name: 'Straight Flush', rank: 8 };
        }
        if (this.isFourOfAKind(numericValues)) {
            return { name: 'Four of a Kind', rank: 7 };
        }
        if (this.isFullHouse(numericValues)) {
            return { name: 'Full House', rank: 6 };
        }
        if (isFlush) {
            return { name: 'Flush', rank: 5 };
        }
        if (isStraight) {
            return { name: 'Straight', rank: 4 };
        }
        if (this.isThreeOfAKind(numericValues)) {
            return { name: 'Three of a Kind', rank: 3 };
        }
        if (this.isTwoPair(numericValues)) {
            return { name: 'Two Pair', rank: 2 };
        }
        if (this.isPair(numericValues)) {
            return { name: 'Pair', rank: 1 };
        }
        
        return { name: 'High Card', rank: 0 };
    }
    
    isStraight(values) {
        for (let i = 0; i < values.length - 1; i++) {
            if (values[i] - values[i + 1] !== 1) {
                return false;
            }
        }
        return true;
    }
    
    isFourOfAKind(values) {
        const counts = {};
        values.forEach(val => counts[val] = (counts[val] || 0) + 1);
        return Object.values(counts).includes(4);
    }
    
    isFullHouse(values) {
        const counts = {};
        values.forEach(val => counts[val] = (counts[val] || 0) + 1);
        const countsArray = Object.values(counts);
        return countsArray.includes(3) && countsArray.includes(2);
    }
    
    isThreeOfAKind(values) {
        const counts = {};
        values.forEach(val => counts[val] = (counts[val] || 0) + 1);
        return Object.values(counts).includes(3);
    }
    
    isTwoPair(values) {
        const counts = {};
        values.forEach(val => counts[val] = (counts[val] || 0) + 1);
        const pairs = Object.values(counts).filter(count => count === 2);
        return pairs.length === 2;
    }
    
    isPair(values) {
        const counts = {};
        values.forEach(val => counts[val] = (counts[val] || 0) + 1);
        return Object.values(counts).includes(2);
    }
    
    getPokerPayout(handRank, bet) {
        const payouts = {
            9: 250, // Royal Flush
            8: 50,  // Straight Flush
            7: 25,  // Four of a Kind
            6: 9,   // Full House
            5: 6,   // Flush
            4: 4,   // Straight
            3: 3,   // Three of a Kind
            2: 2,   // Two Pair
            1: 1,   // Pair
            0: 0    // High Card
        };
        
        return bet * payouts[handRank.rank];
    }
    
    // Baccarat Game
    initBaccarat() {
        this.baccaratGame = {
            deck: [],
            playerCards: [],
            bankerCards: [],
            playerScore: 0,
            bankerScore: 0,
            bet: 0,
            betType: null,
            gameActive: false
        };
        
        // Bet buttons
        document.querySelectorAll('#baccarat .bet-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (!this.baccaratGame.gameActive) {
                    document.querySelectorAll('#baccarat .bet-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.baccaratGame.bet = parseInt(btn.dataset.bet);
                }
            });
        });
        
        // Bet type buttons
        document.querySelectorAll('.baccarat-bet').forEach(btn => {
            btn.addEventListener('click', () => {
                if (!this.baccaratGame.gameActive) {
                    document.querySelectorAll('.baccarat-bet').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    this.baccaratGame.betType = btn.dataset.bet;
                }
            });
        });
        
        // Game buttons
        document.getElementById('dealBaccaratBtn').addEventListener('click', () => {
            this.dealBaccarat();
        });
        
        document.getElementById('newBaccaratGameBtn').addEventListener('click', () => {
            this.newBaccaratGame();
        });
        
        // Set default bet
        document.querySelector('#baccarat .bet-btn[data-bet="50"]').classList.add('active');
        this.baccaratGame.bet = 50;
    }
    
    dealBaccarat() {
        if (!this.canAfford(this.baccaratGame.bet) || !this.baccaratGame.betType) {
            this.showNotification('Place your bet first!', 'error');
            return;
        }
        
        this.updateBalance(-this.baccaratGame.bet);
        
        this.baccaratGame.deck = this.createDeck();
        this.baccaratGame.playerCards = [];
        this.baccaratGame.bankerCards = [];
        this.baccaratGame.gameActive = true;
        
        // Deal initial cards
        this.baccaratGame.playerCards.push(this.baccaratGame.deck.pop());
        this.baccaratGame.bankerCards.push(this.baccaratGame.deck.pop());
        this.baccaratGame.playerCards.push(this.baccaratGame.deck.pop());
        this.baccaratGame.bankerCards.push(this.baccaratGame.deck.pop());
        
        // Calculate scores
        this.baccaratGame.playerScore = this.calculateBaccaratScore(this.baccaratGame.playerCards);
        this.baccaratGame.bankerScore = this.calculateBaccaratScore(this.baccaratGame.bankerCards);
        
        // Apply third card rules
        this.applyBaccaratRules();
        
        this.updateBaccaratDisplay();
        this.determineBaccaratWinner();
        this.updateBaccaratButtons();
    }
    
    calculateBaccaratScore(cards) {
        let score = 0;
        cards.forEach(card => {
            let value = card.value;
            if (['J', 'Q', 'K'].includes(value)) {
                value = 0;
            } else if (value === 'A') {
                value = 1;
            } else {
                value = parseInt(value);
            }
            score += value;
        });
        return score % 10;
    }
    
    applyBaccaratRules() {
        // Player third card rule
        if (this.baccaratGame.playerScore <= 5) {
            this.baccaratGame.playerCards.push(this.baccaratGame.deck.pop());
            this.baccaratGame.playerScore = this.calculateBaccaratScore(this.baccaratGame.playerCards);
        }
        
        // Banker third card rule
        const playerThirdCard = this.baccaratGame.playerCards.length > 2 ? 
            this.baccaratGame.playerCards[2] : null;
        
        let bankerDraws = false;
        if (this.baccaratGame.bankerScore <= 2) {
            bankerDraws = true;
        } else if (this.baccaratGame.bankerScore === 3 && playerThirdCard && 
                   !['8'].includes(playerThirdCard.value)) {
            bankerDraws = true;
        } else if (this.baccaratGame.bankerScore === 4 && playerThirdCard && 
                   ['2', '3', '4', '5', '6', '7'].includes(playerThirdCard.value)) {
            bankerDraws = true;
        } else if (this.baccaratGame.bankerScore === 5 && playerThirdCard && 
                   ['4', '5', '6', '7'].includes(playerThirdCard.value)) {
            bankerDraws = true;
        } else if (this.baccaratGame.bankerScore === 6 && playerThirdCard && 
                   ['6', '7'].includes(playerThirdCard.value)) {
            bankerDraws = true;
        }
        
        if (bankerDraws) {
            this.baccaratGame.bankerCards.push(this.baccaratGame.deck.pop());
            this.baccaratGame.bankerScore = this.calculateBaccaratScore(this.baccaratGame.bankerCards);
        }
    }
    
    determineBaccaratWinner() {
        const playerScore = this.baccaratGame.playerScore;
        const bankerScore = this.baccaratGame.bankerScore;
        
        let winner = '';
        let winAmount = 0;
        
        if (playerScore > bankerScore) {
            winner = 'player';
        } else if (bankerScore > playerScore) {
            winner = 'banker';
        } else {
            winner = 'tie';
        }
        
        if (this.baccaratGame.betType === winner) {
            if (winner === 'player') {
                winAmount = this.baccaratGame.bet * 2;
            } else if (winner === 'banker') {
                winAmount = Math.floor(this.baccaratGame.bet * 1.95); // 5% commission
            } else if (winner === 'tie') {
                winAmount = this.baccaratGame.bet * 9;
            }
        }
        
        if (winAmount > 0) {
            this.updateBalance(winAmount);
            this.showNotification(`${winner.toUpperCase()} wins! You won $${winAmount}!`, 'success');
        } else {
            this.showNotification(`${winner.toUpperCase()} wins!`, 'error');
        }
        
        document.getElementById('baccaratStatus').textContent = 
            `${winner.toUpperCase()} wins! Player: ${playerScore}, Banker: ${bankerScore}`;
        
        this.baccaratGame.gameActive = false;
    }
    
    updateBaccaratDisplay() {
        const playerCardsDiv = document.getElementById('baccaratPlayerCards');
        const bankerCardsDiv = document.getElementById('baccaratBankerCards');
        
        // Clear previous cards
        playerCardsDiv.innerHTML = '';
        bankerCardsDiv.innerHTML = '';
        
        // Display player cards
        this.baccaratGame.playerCards.forEach(card => {
            const cardElement = this.createCardElement(card);
            playerCardsDiv.appendChild(cardElement);
        });
        
        // Display banker cards
        this.baccaratGame.bankerCards.forEach(card => {
            const cardElement = this.createCardElement(card);
            bankerCardsDiv.appendChild(cardElement);
        });
        
        // Update scores
        document.getElementById('baccaratPlayerScore').textContent = this.baccaratGame.playerScore;
        document.getElementById('baccaratBankerScore').textContent = this.baccaratGame.bankerScore;
    }
    
    updateBaccaratButtons() {
        const dealBtn = document.getElementById('dealBaccaratBtn');
        const newGameBtn = document.getElementById('newBaccaratGameBtn');
        
        if (this.baccaratGame.gameActive) {
            dealBtn.disabled = true;
            newGameBtn.disabled = true;
        } else {
            dealBtn.disabled = false;
            newGameBtn.disabled = false;
        }
    }
    
    newBaccaratGame() {
        this.baccaratGame.gameActive = false;
        this.baccaratGame.playerCards = [];
        this.baccaratGame.bankerCards = [];
        this.baccaratGame.playerScore = 0;
        this.baccaratGame.bankerScore = 0;
        
        this.updateBaccaratDisplay();
        this.updateBaccaratButtons();
        document.getElementById('baccaratStatus').textContent = 'Place your bet and deal cards!';
    }
    
    // Craps Game
    initCraps() {
        this.crapsGame = {
            point: null,
            bet: 0,
            betType: null,
            gameActive: false,
            comeOutRoll: true
        };
        
        // Bet buttons
        document.querySelectorAll('#craps .bet-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (!this.crapsGame.gameActive) {
                    document.querySelectorAll('#craps .bet-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.crapsGame.bet = parseInt(btn.dataset.bet);
                }
            });
        });
        
        // Bet type buttons
        document.querySelectorAll('.craps-bet').forEach(btn => {
            btn.addEventListener('click', () => {
                if (!this.crapsGame.gameActive) {
                    document.querySelectorAll('.craps-bet').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    this.crapsGame.betType = btn.dataset.bet;
                }
            });
        });
        
        // Game buttons
        document.getElementById('rollCrapsBtn').addEventListener('click', () => {
            this.rollCraps();
        });
        
        document.getElementById('newCrapsGameBtn').addEventListener('click', () => {
            this.newCrapsGame();
        });
        
        // Set default bet
        document.querySelector('#craps .bet-btn[data-bet="25"]').classList.add('active');
        this.crapsGame.bet = 25;
    }
    
    rollCraps() {
        if (!this.canAfford(this.crapsGame.bet) || !this.crapsGame.betType) {
            this.showNotification('Place your bet first!', 'error');
            return;
        }
        
        this.updateBalance(-this.crapsGame.bet);
        
        // Roll dice
        const dice1 = Math.floor(Math.random() * 6) + 1;
        const dice2 = Math.floor(Math.random() * 6) + 1;
        const total = dice1 + dice2;
        
        // Update dice display
        document.getElementById('dice1').textContent = this.getDiceSymbol(dice1);
        document.getElementById('dice2').textContent = this.getDiceSymbol(dice2);
        document.getElementById('diceTotal').textContent = total;
        
        // Add rolling animation
        document.getElementById('dice1').classList.add('rolling');
        document.getElementById('dice2').classList.add('rolling');
        
        setTimeout(() => {
            document.getElementById('dice1').classList.remove('rolling');
            document.getElementById('dice2').classList.remove('rolling');
            
            this.processCrapsResult(total);
        }, 1000);
    }
    
    getDiceSymbol(number) {
        const symbols = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
        return symbols[number - 1];
    }
    
    processCrapsResult(total) {
        let winAmount = 0;
        let message = '';
        
        if (this.crapsGame.comeOutRoll) {
            // Come out roll
            if (total === 7 || total === 11) {
                if (this.crapsGame.betType === 'pass' || this.crapsGame.betType === 'come') {
                    winAmount = this.crapsGame.bet * 2;
                    message = 'Natural! You win!';
                } else {
                    message = 'Natural! You lose!';
                }
            } else if (total === 2 || total === 3 || total === 12) {
                if (this.crapsGame.betType === 'dontpass' || this.crapsGame.betType === 'dontcome') {
                    winAmount = this.crapsGame.bet * 2;
                    message = 'Craps! You win!';
                } else {
                    message = 'Craps! You lose!';
                }
            } else {
                // Point established
                this.crapsGame.point = total;
                this.crapsGame.comeOutRoll = false;
                message = `Point is ${total}. Roll again!`;
            }
        } else {
            // Point roll
            if (total === this.crapsGame.point) {
                if (this.crapsGame.betType === 'pass' || this.crapsGame.betType === 'come') {
                    winAmount = this.crapsGame.bet * 2;
                    message = `Point made! You win!`;
                } else {
                    message = `Point made! You lose!`;
                }
                this.crapsGame.comeOutRoll = true;
                this.crapsGame.point = null;
            } else if (total === 7) {
                if (this.crapsGame.betType === 'dontpass' || this.crapsGame.betType === 'dontcome') {
                    winAmount = this.crapsGame.bet * 2;
                    message = 'Seven out! You win!';
                } else {
                    message = 'Seven out! You lose!';
                }
                this.crapsGame.comeOutRoll = true;
                this.crapsGame.point = null;
            } else {
                message = `Rolled ${total}. Roll again!`;
            }
        }
        
        if (winAmount > 0) {
            this.updateBalance(winAmount);
            this.showNotification(message + ` You won $${winAmount}!`, 'success');
        } else {
            this.showNotification(message, 'error');
        }
        
        document.getElementById('crapsStatus').textContent = message;
        this.crapsGame.gameActive = false;
        this.updateCrapsButtons();
    }
    
    updateCrapsButtons() {
        const rollBtn = document.getElementById('rollCrapsBtn');
        const newGameBtn = document.getElementById('newCrapsGameBtn');
        
        if (this.crapsGame.gameActive) {
            rollBtn.disabled = true;
            newGameBtn.disabled = true;
        } else {
            rollBtn.disabled = false;
            newGameBtn.disabled = false;
        }
    }
    
    newCrapsGame() {
        this.crapsGame.point = null;
        this.crapsGame.comeOutRoll = true;
        this.crapsGame.gameActive = false;
        
        document.getElementById('dice1').textContent = '⚀';
        document.getElementById('dice2').textContent = '⚀';
        document.getElementById('diceTotal').textContent = '-';
        document.getElementById('crapsStatus').textContent = 'Place your bet and roll the dice!';
        
        this.updateCrapsButtons();
    }
    
    // Keno Game
    initKeno() {
        this.kenoGame = {
            selectedNumbers: [],
            winningNumbers: [],
            bet: 0,
            gameActive: false
        };
        
        // Generate keno board
        this.generateKenoBoard();
        
        // Bet buttons
        document.querySelectorAll('#keno .bet-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (!this.kenoGame.gameActive) {
                    document.querySelectorAll('#keno .bet-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.kenoGame.bet = parseInt(btn.dataset.bet);
                }
            });
        });
        
        // Game buttons
        document.getElementById('playKenoBtn').addEventListener('click', () => {
            this.playKeno();
        });
        
        document.getElementById('clearKenoBtn').addEventListener('click', () => {
            this.clearKenoSelection();
        });
        
        // Set default bet
        document.querySelector('#keno .bet-btn[data-bet="10"]').classList.add('active');
        this.kenoGame.bet = 10;
    }
    
    generateKenoBoard() {
        const kenoNumbersDiv = document.getElementById('kenoNumbers');
        kenoNumbersDiv.innerHTML = '';
        
        for (let i = 1; i <= 80; i++) {
            const numberDiv = document.createElement('div');
            numberDiv.className = 'keno-number';
            numberDiv.textContent = i;
            numberDiv.dataset.number = i;
            
            numberDiv.addEventListener('click', () => {
                this.toggleKenoNumber(i);
            });
            
            kenoNumbersDiv.appendChild(numberDiv);
        }
    }
    
    toggleKenoNumber(number) {
        if (this.kenoGame.gameActive) return;
        
        const numberElement = document.querySelector(`[data-number="${number}"]`);
        
        if (this.kenoGame.selectedNumbers.includes(number)) {
            this.kenoGame.selectedNumbers = this.kenoGame.selectedNumbers.filter(n => n !== number);
            numberElement.classList.remove('selected');
        } else if (this.kenoGame.selectedNumbers.length < 20) {
            this.kenoGame.selectedNumbers.push(number);
            numberElement.classList.add('selected');
        }
        
        this.updateKenoInfo();
    }
    
    playKeno() {
        if (!this.canAfford(this.kenoGame.bet) || this.kenoGame.selectedNumbers.length === 0) {
            this.showNotification('Select numbers and place your bet!', 'error');
            return;
        }
        
        this.updateBalance(-this.kenoGame.bet);
        this.kenoGame.gameActive = true;
        
        // Generate 20 winning numbers
        this.kenoGame.winningNumbers = [];
        while (this.kenoGame.winningNumbers.length < 20) {
            const num = Math.floor(Math.random() * 80) + 1;
            if (!this.kenoGame.winningNumbers.includes(num)) {
                this.kenoGame.winningNumbers.push(num);
            }
        }
        
        // Animate winning numbers
        this.animateKenoResults();
        
        // Calculate wins
        const hits = this.kenoGame.selectedNumbers.filter(num => 
            this.kenoGame.winningNumbers.includes(num)
        ).length;
        
        const winAmount = this.calculateKenoPayout(hits, this.kenoGame.selectedNumbers.length, this.kenoGame.bet);
        
        if (winAmount > 0) {
            this.updateBalance(winAmount);
            this.showNotification(`You hit ${hits} numbers! You won $${winAmount}!`, 'success');
        } else {
            this.showNotification(`You hit ${hits} numbers. Better luck next time!`, 'error');
        }
        
        document.getElementById('kenoHit').textContent = hits;
        document.getElementById('kenoPayout').textContent = winAmount > 0 ? `$${winAmount}` : '$0';
        document.getElementById('kenoStatus').textContent = `Game complete! You hit ${hits} out of ${this.kenoGame.selectedNumbers.length} numbers.`;
        
        this.kenoGame.gameActive = false;
    }
    
    animateKenoResults() {
        this.kenoGame.winningNumbers.forEach((number, index) => {
            setTimeout(() => {
                const numberElement = document.querySelector(`[data-number="${number}"]`);
                numberElement.classList.add('winning');
                
                if (this.kenoGame.selectedNumbers.includes(number)) {
                    numberElement.style.animation = 'kenoWin 1s ease-in-out';
                }
            }, index * 100);
        });
    }
    
    calculateKenoPayout(hits, spots, bet) {
        // Simplified payout table
        const payouts = {
            1: { 1: 3, 2: 0, 3: 0, 4: 0, 5: 0 },
            2: { 2: 12, 3: 0, 4: 0, 5: 0 },
            3: { 3: 42, 4: 0, 5: 0 },
            4: { 4: 100, 5: 0 },
            5: { 5: 500 }
        };
        
        if (payouts[spots] && payouts[spots][hits]) {
            return bet * payouts[spots][hits];
        }
        
        return 0;
    }
    
    clearKenoSelection() {
        this.kenoGame.selectedNumbers = [];
        this.kenoGame.winningNumbers = [];
        
        document.querySelectorAll('.keno-number').forEach(el => {
            el.classList.remove('selected', 'winning');
        });
        
        this.updateKenoInfo();
        document.getElementById('kenoStatus').textContent = 'Select 1-20 numbers and play!';
    }
    
    updateKenoInfo() {
        document.getElementById('kenoSelected').textContent = this.kenoGame.selectedNumbers.length;
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
