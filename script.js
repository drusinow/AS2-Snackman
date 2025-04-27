    let upPressed = false;
    let downPressed = false;
    let leftPressed = false;
    let rightPressed = false;
    let playable = false;
    let playerSpeed = 2;
    const main = document.querySelector('main');
    const startbtn = document.querySelector('.start');
    const continuebtn = document.querySelector('.continue')
    let startingLeft;
    let startingTop;

    //Player = 2, Wall = 1, Enemy = 3, Point = 0
    let maze = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 1, 0, 0, 0, 0, 3, 1],
        [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 0, 2, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 0, 0, 1, 0, 3, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
        [1, 3, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];



    //Populates the maze in the HTML
    for (let y of maze) {
        for (let x of y) {
            let block = document.createElement('div');
            block.classList.add('block');

            switch (x) {
                case 1:
                    block.classList.add('wall');
                    break;
                case 2:
                    block.id = 'player';
                    let mouth = document.createElement('div');
                    mouth.classList.add('mouth');
                    block.appendChild(mouth);
                    break;
                case 3:
                    block.classList.add('enemy');
                    break;
                default:
                    block.classList.add('point');
                    block.style.height = '1vh';
                    block.style.width = '1vh';
            }

            main.appendChild(block);
        }
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
    const scoretext = document.querySelector('.score p')
    let score = 0

    const liveslist = document.querySelector('.lives ul')

    let livetoremove;
    for(let i = 0; i < liveslist.children.length; i++) { // get child of ul and set livetoremove to next li.
        livetoremove = liveslist.children[i];
    }


    //player movement and player
    const player = document.querySelector('#player');
    const playerMouth = player.querySelector('.mouth');
    const playerPos = player.getBoundingClientRect();
    let playerTop = 0;
    let playerLeft = 0;



    console.log(startingTop)
    console.log(startingLeft)
    function gameLoop() {
        if (playable == true) {
            score = 0;
        setInterval(function() {
            pointCheck();
            enemyHit();
            //Movement
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

    function enemyHit(futurePos){
        let enemy = document.querySelectorAll('.enemy');
        let position = player.getBoundingClientRect();

        for (let i = 0; i < enemy.length; i++) {   
            let pos = enemy[i].getBoundingClientRect();
            if (position.right > pos.left && position.left < pos.right && position.bottom > pos.top && position.top < pos.bottom) {
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
        if (liveslist.children.length > 0){
            liveslist.removeChild(livetoremove);
            console.log("removed a life");
            continuebtn.style.display = "flex";
            // use saved player starting position to place player back to starting pos
            getPlayerMazePos()
            playerTop = startingTop;
            playerLeft = startingLeft;

            player.style.top = playerTop + 'px';
            player.style.left = playerLeft + 'px';
            console.log(startingLeft)
            console.log(startingTop)

            
        }
        else if(liveslist.children.length = 0){
            //display restart button
        }

    };  


    function getPlayerMazePos() {

        const blockSize = main.querySelector('.block').offsetWidth; // gets size of block, to get propper starting pos. startingpos = startinggridx * blocksize 
        let startingGridX = 0;
        let startingGridY = 0;

        for (let y = 0; y < maze.length; y++) {
            for (let x = 0; x < maze[y].length; x++) {
                if (maze[y][x] === 2) {
                    startingGridX = x;
                    startingGridY = y;
                    break;
                }
            }
            if (maze[y].includes(2)) break; // exit outer loop once found
        }

        startingLeft = startingGridX * blockSize;
        startingTop = startingGridY * blockSize;
        console.log(startingLeft)
        console.log(startingTop)
    };
    //___________________________________________________________________________________

    function startgame(){
        startbtn.style.display = "none";
        playable = true;
        gameLoop();
    };
    continuebtn.style.display = "none";

    // continuebtn.addEventListener('click', )
    startbtn.addEventListener('click', startgame)
    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);





    // // Function to enforce a 2-block perimeter around the player
    // function enforcePlayerPerimeter(maze, playerY, playerX) {
    //     const perimeterSize = 2; // 2-block radius
    //     for (let y = playerY - perimeterSize; y <= playerY + perimeterSize; y++) {
    //         for (let x = playerX - perimeterSize; x <= playerX + perimeterSize; x++) {
    //             if (
    //                 y >= 0 && y < maze.length &&         // Check bounds
    //                 x >= 0 && x < maze[0].length &&      // Check bounds
    //                 maze[y][x] === 3                     // If enemy is found in perimeter
    //             ) {
    //                 maze[y][x] = 0; // Replace enemy with a point
    //             }
    //         }
    //     }
    // }

    // // Find player position (assumes player exists in maze)
    // let playerY, playerX;
    // for (let y = 0; y < maze.length; y++) {
    //     const x = maze[y].indexOf(2);
    //     if (x !== -1) {
    //         playerY = y;
    //         playerX = x;
    //         break;
    //     }
    // }

    // // Apply perimeter rule
    // enforcePlayerPerimeter(maze, playerY, playerX);