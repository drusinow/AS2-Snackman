    let upPressed = false;
    let downPressed = false;
    let leftPressed = false;
    let rightPressed = false;
    let playable = false;
    let playerSpeed = 2;
    const main = document.querySelector('main');
    const startbtn = document.querySelector('.start');
    const continuebtn = document.querySelector('.continue')
    let startingPos;

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

    //loop to get starting player coordinates

    for(let i = 0; i < maze.length; i++) {
        for(let j = 0; j < maze[i].length; j++){
            if (maze[i][j] == 2){
                startingPos = [i,j];
            }
        }
    }
    console.log(startingPos);


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

    function enemyHit(){
        let enemy = document.querySelectorAll('.enemy');
        let position = player.getBoundingClientRect();

        for (let i = 0; i < enemy.length; i++) {   
            let pos = enemy[i].getBoundingClientRect();
            if (position.right > pos.left && position.left < pos.right && position.bottom > pos.top && position.top < pos.bottom) {
                continuebtn.style.display = "flex";
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
            console.log(liveslist)
            console.log(liveslist.children.length)
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


        }
        else if(liveslist.children.length = 0){
            //display restart button
            // play death animation rather than hit animation
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

    continuebtn.addEventListener('click', () => {
        continuebtn.style.display = "none";
        placePlayer();
});





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