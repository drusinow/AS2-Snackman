import { Leaf, generateBSPMap } from './mapGeneration.js';

    
    let upPressed = false;
    let downPressed = false;
    let leftPressed = false;
    let rightPressed = false;
    let playable = false;
    let playerSpeed = 8;
    const main = document.querySelector('main');
    const startbtn = document.querySelector('.start');
    const continuebtn = document.querySelector('.continue');
    const gameOverbtn = document.querySelector('.gameOver');
    const nextLevel = document.querySelector('.nextLevel');
    let startingPos;
    let enemyStates = [];
    let allowBotMove = true;
    let gameInterval = null;
    let numOfEnemies = 0;
    let enemiesPerRound = 3;


    let { maze, playerStart } = generateBSPMap(10, 10);   
    maze[playerStart.y][playerStart.x] = 2;
    renderMaze(maze);

    //Player = 2, Wall = 1, Enemy = 3, Point = 0
    // let maze = [
    //     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    //     [1, 0, 0, 1, 0, 0, 0, 0, 3, 1],
    //     [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    //     [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    //     [1, 0, 1, 1, 0, 2, 0, 0, 0, 1],
    //     [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    //     [1, 0, 0, 1, 0, 3, 0, 0, 0, 1],
    //     [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    //     [1, 3, 1, 0, 0, 0, 0, 0, 0, 1],
    //     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    // ];

    //loop to get starting player coordinates

    for(let i = 0; i < maze.length; i++) {
        for(let j = 0; j < maze[i].length; j++){
            if (maze[i][j] == 2){
                startingPos = [i,j];
            }
        }
    }
    console.log(startingPos);
    console.log(maze)

    //Populates the maze in the HTML
    function renderMaze(maze) {
        const main = document.querySelector('main');
        main.innerHTML = '';
        enemyStates = []; // reset enemy states for game restarts / level change
    
        const rows = maze.length;
        const cols = maze[0].length;
    
        // Set CSS grid based on maze dimensions
        main.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        main.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const block = document.createElement('div');
                block.classList.add('block');
    
                const cell = document.createElement('div');
                cell.classList.add('cell');
    
                switch (maze[y][x]) {
                    case 1: {
                        cell.classList.add('wall');
                        break;
                    }
                    case 2: {
                        const playerDiv = document.createElement('div');
                        playerDiv.id = 'player';
    
                        const mouth = document.createElement('div');
                        mouth.classList.add('mouth');
    
                        playerDiv.appendChild(mouth);
                        cell.appendChild(playerDiv);
                        break;
                    }
                    default:
                    // Create a point element inside the cell
                    const point = document.createElement('div');
                    point.classList.add('point');
                    cell.appendChild(point);
                    
                    if (Math.random() < 0.000065 && numOfEnemies < enemiesPerRound) { // works quite well, but isnt always well distributed
                        numOfEnemies++;
                        const enemy = document.createElement('div');
                        enemy.classList.add('enemy');
                        cell.appendChild(enemy); 

                        maze[y][x] = 3; // Update underlying maze array
                    }
                    
                    break;
                    

                }
    
                block.appendChild(cell);
                main.appendChild(block);
            }
        }
        
        const enemies = document.querySelectorAll('.enemy');
        console.log(enemies.length)
        enemies.forEach((enemy, index) => {
            enemyStates.push({
                element: enemy,
                direction: getRandomDirection(),
                lastChange: Date.now(),
                id: index
        });
        }) 
    }

    
    //Player movement
    function keyUp(event) {
        if (event.key === 'ArrowUp') {
            upPressed = false;
        } else if (event.key === 'ArrowDown') {
            downPressed = false;
        } else if (event.key === 'ArrowLeft') {
            leftPressed = false;
        } else if (event.key === 'ArrowRight') {
            rightPressed = false;
        }
    }

    function keyDown(event) {
        if (event.key === 'ArrowUp') {
            upPressed = true;
        } else if (event.key === 'ArrowDown') {
            downPressed = true;
        } else if (event.key === 'ArrowLeft') {
            leftPressed = true;
        } else if (event.key === 'ArrowRight') {
            rightPressed = true;
        }
    }


    //Score, Lives and levels
    const scoretext = document.querySelector('.score p');
    let score = 0;
    
    const levelText = document.querySelector('.level p');
    let level = 0;
    let bspMapSize = 10;


    function setlevel() { // should call every time a level is completed.

        if(level >= 5 && level <= 9){
            bspMapSize = 15
            enemiesPerRound = 5;
        }
        else if(level >= 10 && level <= 15){
            bspMapSize = 20
            enemiesPerRound = 8;
        }
        else if(level > 16){
            bspMapSize = 25
            enemiesPerRound = 15;
        }

       // gens a new maze but updates global maze variable for point recount in the getlevelpoints function
        const newMazeData = generateBSPMap(bspMapSize, bspMapSize);
        maze = newMazeData.maze;  
        playerStart = newMazeData.playerStart;
        
        maze[playerStart.y][playerStart.x] = 2;
        
    
        startingPos = [playerStart.y, playerStart.x];
        
        // Render maze and reset enemy states
        renderMaze(maze);

        
        updatePlayerReferences();
        
        // Update score for new level
        getLevelPoints();
        score = 0;
        scoretext.innerHTML = score;
        
        // Start game with new settings
        allowBotMove = true;
        playable = true;
        gameLoop();
    };
    
    function setlives(numOfLives) {
        for(let i = 0; i < numOfLives; i++){
            const life = document.createElement("li");
            liveslist.appendChild(life);
        }
        console.log("done");
    }
    const liveslist = document.querySelector('.lives ul');

    let livetoremove;
    for(let i = 0; i < liveslist.children.length; i++) { // get child of ul and set livetoremove to next li.
        livetoremove = liveslist.children[i];
    }


    //player movement and player
    let player = document.querySelector('#player'); // changed to let to handle placing player again after hit same with below.
    let playerMouth = player.querySelector('.mouth');
    const playerPos = player.getBoundingClientRect();
    let playerTop = 0;
    let playerLeft = 0;
    let moveLock = false;



    function gameLoop() {
        if (playable == true) {
            getLevelPoints()

        gameInterval = setInterval(function() {

            if (!player) {//makes sure player exists before running
                updatePlayerReferences();
                if (!player) return; // if no player again skip this frame
            }
            pointCheck();
            enemyHit();
            gameWin();
            enemyMove(allowBotMove);
            console.log("running game")
            //Movement
            if (moveLock == false) { // for when player gets hit
            if(downPressed) {
                let position = player.getBoundingClientRect();

                let futurePos = {
                    left: position.left,
                    right: position.right,
                    top: position.top + playerSpeed,
                    bottom: position.bottom + playerSpeed
                };

                if (!areColliding(futurePos)) { // if arecolliding returns false let the player move. -> takes future pos of player as param to prevent player getting stuck
                    playerTop += playerSpeed;
                    player.style.top = playerTop + 'px';
                }


                playerMouth.classList = 'down';
            }
            else if(upPressed) {
                let position = player.getBoundingClientRect();

                let futurePos = {
                    left: position.left,
                    right: position.right,
                    top: position.top - playerSpeed,
                    bottom: position.bottom - playerSpeed
                };

                if (!areColliding(futurePos)) {
                    playerTop -= playerSpeed;
                    player.style.top = playerTop + 'px';
                }

                playerMouth.classList = 'up';
            }
            else if(leftPressed) {
                let position = player.getBoundingClientRect();

                let futurePos = {
                    left: position.left - playerSpeed,
                    right: position.right - playerSpeed,
                    top: position.top,
                    bottom: position.bottom
                };
                if (!areColliding(futurePos)) {
                    playerLeft -= playerSpeed;
                    player.style.left = playerLeft + 'px';
                }

                playerMouth.classList = 'left';
            }
            else if(rightPressed) {
                let position = player.getBoundingClientRect();

                let futurePos = {
                    left: position.left + playerSpeed,
                    right: position.right + playerSpeed,
                    top: position.top ,
                    bottom: position.bottom
                };

                if (!areColliding(futurePos)) {
                playerLeft += playerSpeed;
                player.style.left = playerLeft + 'px';
                }
                playerMouth.classList = 'right';   
                
            }
        }
        }, 10);
        };
    };



    //FUNCTIONS ________________________________________________________________________
    function pointCheck() {
        let points = document.querySelectorAll('.point');
        let position = player.getBoundingClientRect();
        for (let i = 0; i < points.length; i++) {
            let pos = points[i].getBoundingClientRect();
            if (position.right > pos.left && position.left < pos.right && position.bottom > pos.top && position.top < pos.bottom) {
                points[i].classList.remove('point');
                score += 10;
                scoretext.innerHTML = score;
                }
            }
    };

    function gameWin() {
        let enemies = document.querySelectorAll('.enemy')
        if (score == (maxLevelPoints + (enemies.length * 10))) {
            nextLevel.style.display = 'flex';
            allowBotMove = false;
            moveLock = true;
        }
    }


    let isHit = false;
    function enemyHit(){
        let enemy = document.querySelectorAll('.enemy');
        let position = player.getBoundingClientRect();

        for (let i = 0; i < enemy.length; i++) {   
            let pos = enemy[i].getBoundingClientRect();
            if (position.right > pos.left && position.left < pos.right && position.bottom > pos.top && position.top < pos.bottom && isHit == false) {
                enemyHitFunctionality()
                }
            }
    }


    function areColliding(futurePos) {
        // let position = player.getBoundingClientRect();
        let wall = document.querySelectorAll('.wall');  

        for (let i = 0; i < wall.length; i++) {
            let pos = wall[i].getBoundingClientRect();
            if (futurePos.right > pos.left && futurePos.left < pos.right && futurePos.bottom > pos.top && futurePos.top < pos.bottom) {
                return true
                }
        }
        return false

    };

    function enemyHitFunctionality() {
        isHit = true;
        moveLock = true;
        console.log("HIT");
        console.log(liveslist.children.length)
        if (liveslist.children.length >= 1){
            continuebtn.style.display = "flex";

            lifeRemove();

            liveslist.removeChild(livetoremove);

            console.log("removed a life");

            void player.offsetWidth; // force reflow, ensures animation actually plays - offsetwidth(serves no functionality) used to recalculate layout/reflow
            player.classList.add('hit'); // add and play hit animation
            
            //once hit animation is finished -> 1.5s, remove hit classlist.
            player.addEventListener('animationend', () => {
                player.classList.remove('hit');
                
            //creates an empty block
            const newElement = document.createElement('div');
            newElement.classList.add('emptydiv');
            //uses replacechild to replace player with the emptydiv - if not it would break the entire maze.
            main.replaceChild(newElement, player);

            }, { once: true });
            allowBotMove = false;

        }
        else if(liveslist.children.length < 1){
            //display restart button
            // play death animation rather than hit animation
            gameOver();
        }

    };  

    //fucntion for handling the placement of the player into its starting position
    function placePlayer() {
        const [i, j] = startingPos; 
        const index = i * maze[0].length + j; // bit messy but gets the specific element which needs to be replaced. corresponds with the i,j
        const oldBlock = main.children[index]; // actuall 'block'
    
        // create new player block
        const block = document.createElement('div');
        block.classList.add('block');
        block.id = 'player';
    
        const mouth = document.createElement('div');
        mouth.classList.add('mouth');
        block.appendChild(mouth);
    
        // replace the old block with the new player block
        main.replaceChild(block, oldBlock);
    
        // update global player references
        player = block;
        playerMouth = mouth;
        playerLeft = 0;
        playerTop = 0;
        player.style.left = playerLeft + 'px';
        player.style.top = playerTop + 'px';

        player = document.querySelector('#player'); // new reference to the DOM element -> otherwise functions like enemyhit will be checking the old player dom element
        playerMouth = player.querySelector('.mouth');
        console.log("running");
    }


    function lifeRemove() {
        for(let i = 0; i < liveslist.children.length; i++) { // get child of ul and set livetoremove to next li.
            livetoremove = liveslist.children[i];
        }
    }

    function gameOver() {
        gameOverbtn.style.display = "flex";
        
        clearInterval(gameInterval);

        void player.offsetWidth; // force reflow, ensures animation actually plays - offsetwidth(serves no functionality) used to recalculate layout/reflow
        player.classList.add('dead'); // add and play hit animation
        
        //once hit animation is finished -> 1.5s, remove hit classlist.
        player.addEventListener('animationend', () => {
            player.classList.remove('dead');

            //creates an empty block
            const newElement = document.createElement('div');
            newElement.classList.add('emptydiv');
            //uses replacechild to replace player with the emptydiv - if not it would break the entire maze.
            main.replaceChild(newElement, player);

            }, { once: true });

    };



    let maxLevelPoints = 0;
    function getLevelPoints() {
        maxLevelPoints = 0;
        for(let i = 0; i < maze.length; i++) {
            for(let j = 0; j < maze[i].length; j++){
                if (maze[i][j] == 0){
                    maxLevelPoints += 10;
                }
            }
        }
    }
    let enemySpeed = playerSpeed * 0.7;

    function enemyMove(allow) {
        if (allow){
        const now = Date.now();
    
        enemyStates.forEach(state => {
            const enemy = state.element;
            let moveX = 0, moveY = 0;
    
            switch (state.direction) {
                case 'up': moveY = -enemySpeed; break;
                case 'down': moveY = enemySpeed; break;
                case 'left': moveX = -enemySpeed; break;
                case 'right': moveX = enemySpeed; break;
            }
    
            // Calculate future position
            const pos = enemy.getBoundingClientRect();
            const futurePos = {
                top: pos.top + moveY,
                bottom: pos.bottom + moveY,
                left: pos.left + moveX,
                right: pos.right + moveX
            };
    
            // Check collision or 2 seconds passed
            if (areColliding(futurePos) || now - state.lastChange >= 2000) {
                state.direction = getRandomDirection();
                state.lastChange = now;
            } else {
                enemy.style.top = (enemy.offsetTop + moveY) + 'px';
                enemy.style.left = (enemy.offsetLeft + moveX) + 'px';
            }
        });
    }
    }
    

    function getRandomDirection() {
        const directions = ['up', 'down', 'left', 'right'];
        return directions[Math.floor(Math.random() * directions.length)];
    }
    // reset everything about the player, for next level functioonality
    function updatePlayerReferences() {
        // update player references
        player = document.querySelector('#player');
        playerMouth = player ? player.querySelector('.mouth') : null;
        
        // reset player position
        playerLeft = 0;
        playerTop = 0;
        if (player) {
            player.style.left = playerLeft + 'px';
            player.style.top = playerTop + 'px';
        }
        
        // reset player state
        isHit = false;
        moveLock = false;
    }

//for leaderbaord we use .stringify and .parse, which are json functions that make handling the array of objects easier.

//set initial scoreboard values
const abc = [
    { name: 'Sam', score: 12 },
    { name: 'Kira', score: 10 },
    { name: 'Alex', score: 8 }
];

localStorage.setItem('leaderboard', JSON.stringify(abc))

    // load leaderboard from localStorage or initialize empty
    function loadLeaderboard() {
        return JSON.parse(localStorage.getItem('leaderboard')) || [];
    }

    // save leaderboard array back to localStorage
    function saveLeaderboard(leaderboard) {
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    }


    function updateLeaderboard(name, score) {
        let leaderboard = loadLeaderboard();
    
        // check to see if players name already exists
        const existingIndex = leaderboard.findIndex(entry => entry.name === name);
        if (existingIndex >= 0) {
        // updates the score of existing player 
        if (score > leaderboard[existingIndex].score) {
            leaderboard[existingIndex].score = score;
        }
        } else {
        // adds new player to the leaderboard
        leaderboard.push({ name, score });
        }

        // Sort descending by score
        leaderboard.sort((a, b) => b.score - a.score);

        leaderboard = leaderboard.slice(0, 5); // keeps only 5 players on leaderboard

        saveLeaderboard(leaderboard);

        // update leaderboard
        renderLeaderboard(leaderboard);
}

    function renderLeaderboard(leaderboard) {
        const ol = document.querySelector('.leaderboard ol');
        ol.innerHTML = ''; // clear existing list
    
        leaderboard.forEach(entry => {
        const li = document.createElement('li');
        // Format with dots for spacing
        li.textContent = `${entry.name}${'.'.repeat(15 - entry.name.length)}${entry.score}`;
        ol.appendChild(li);
        });
    }
    


    // make update score/lives function to clean up code

    //___________________________________________________________________________________

    function startgame(){
        startbtn.style.display = "none";
        score = 0;
        scoretext.innerHTML = score;
        console.log("start clicked")
        playable = true;
        gameLoop();
        getLevelPoints();
        setlives(2);
    };
    continuebtn.style.display = "none";
    gameOverbtn.style.display = "none";
    nextLevel.style.display = "none";


    // continuebtn.addEventListener('click', )
    startbtn.addEventListener('click', startgame)
    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);

    gameOverbtn.addEventListener('click', () => {
            // Reset game state
        level = 0;
        levelText.innerHTML = level;
        bspMapSize = 10;
        enemiesPerRound = 3;
        numOfEnemies = 0;
        
        renderMaze(maze);

        
        updatePlayerReferences();
        
        getLevelPoints();
        score = 0;
        scoretext.innerHTML = score;
        
        // Start game with new settings
        allowBotMove = true;
        playable = true;
        setlives(2);
        gameLoop();

        gameOverbtn.style.display = "none";
    });

    continuebtn.addEventListener('click', () => {
        continuebtn.style.display = "none";
        isHit = false;
        moveLock = false;
        allowBotMove = true;
        placePlayer();
});

    nextLevel.addEventListener('click', () => {

    if (level > 5) {
        const playerName = prompt('Enter your name for the leaderboard:');
        updateLeaderboard(playerName, level);
    }
        
    // Increment level
    level++;
    levelText.innerHTML = level;
    
    // Reset game state flags
    allowBotMove = true;
    moveLock = false;
    isHit = false;
    numOfEnemies = 0;
    
    // Clear existing game interval before starting a new one
    clearInterval(gameInterval);
    
    // Generate new level
    setlevel();
    
    // Hide next level button
    nextLevel.style.display = "none";
    });

//commands for common variables AKA console cheats :D
window.setLevel = function(value) {
    level = value;
};

window.toggleEnemyMovement = function() {
    allowBotMove = !allowBotMove;
    console.log(`Enemy movement is now ${allowBotMove ? 'enabled' : 'disabled'}`);
};

document.addEventListener('DOMContentLoaded', () => {
    const leaderboard = loadLeaderboard();
    renderLeaderboard(leaderboard);
});
