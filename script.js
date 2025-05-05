import { Leaf, generateBSPMap } from './mapGeneration.js';

    
    let upPressed = false;
    let downPressed = false;
    let leftPressed = false;
    let rightPressed = false;
    let playable = false;
    let playerSpeed = 2;
    const main = document.querySelector('main');
    const startbtn = document.querySelector('.start');
    const continuebtn = document.querySelector('.continue')
    const gameOverbtn = document.querySelector('.gameOver')
    let startingPos;
    let enemyStates = [];
    let allowBotMove = true;
    let gameInterval = null;


    const { maze, playerStart } = generateBSPMap(20, 20);
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
                    case 3: {
                        const enemy = document.createElement('div');
                        enemy.classList.add('enemy');
                        cell.appendChild(enemy);
                        break;
                    }
                    default:
                    // Create a point element inside the cell
                    const point = document.createElement('div');
                    point.classList.add('point');
                    cell.appendChild(point);
                    
                    // Randomly decide if this point should become an enemy
                    if (Math.random() < 0.05) {
                        const enemy = document.createElement('div');
                        enemy.classList.add('enemy');
                        cell.removeChild(point);
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
        enemies.forEach((enemy, index) => {
            enemyStates.push({
                element: enemy,
                direction: getRandomDirection(),
                lastChange: Date.now(),
                id: index
        });
        }) 
    }

    function defaultCase() {
        
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


    //Score And Lives
    const scoretext = document.querySelector('.score p');
    let score = 0;

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
            score = 0;
        gameInterval = setInterval(function() {
            pointCheck();
            enemyHit();
            gameWin();
            enemyMove(allowBotMove);
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

    //Game Logic 


    function gameLogic() {
        //If player hits an enemy, play death animaiton, remove a life, then start again with current map.
        //if player gets all points, next level
        // game over when out of lives or all points collected
        


    }

    //FUNCTIONS ________________________________________________________________________
    function pointCheck() {
        let points = document.querySelectorAll('.point');
        let position = player.getBoundingClientRect();
        for (let i = 0; i < points.length; i++) {
            let pos = points[i].getBoundingClientRect();
            if (position.right > pos.left && position.left < pos.right && position.bottom > pos.top && position.top < pos.bottom) {
                points[i].classList.remove('point');
                score += 10;
                console.log(score)
                scoretext.innerHTML = score;
                }
            }
    };

    function gameWin() {
        if (score == maxLevelPoints) {
            startbtn.style.display = 'flex';
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
        if (liveslist.children.length > 1){
            continuebtn.style.display = "flex";

            lifeRemove()

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
        else if(liveslist.children.length <= 1){
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
    

    //___________________________________________________________________________________

    function startgame(){
        startbtn.style.display = "none";
        playable = true;
        gameLoop();
        getLevelPoints();
    };
    continuebtn.style.display = "none";
    gameOverbtn.style.display = "none";


    // continuebtn.addEventListener('click', )
    startbtn.addEventListener('click', startgame)
    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);

    continuebtn.addEventListener('click', () => {
        continuebtn.style.display = "none";
        isHit = false;
        moveLock = false;
        allowBotMove = true;
        placePlayer();
});
