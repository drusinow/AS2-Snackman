let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;
let playable = false;
let playerSpeed = 2;
const main = document.querySelector('main');
const startbtn = document.querySelector('.start');


//Player = 2, Wall = 1, Enemy = 3, Point = 0
let maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 0, 1, 0, 0, 0, 0, 3, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
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
const playerpos = player.getBoundingClientRect();
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
            let posdown = position.bottom + 2;

            let btmL = document.elementFromPoint(position.left, posdown);
            let btmR = document.elementFromPoint(position.right, posdown);

            if (btmL.classList.contains('wall') == false && btmR.classList.contains('wall') == false) {
                playerTop += playerSpeed;
                player.style.top = playerTop + 'px';
            }


            playerMouth.classList = 'down';
        }
        else if(upPressed) {
            let position = player.getBoundingClientRect();
            let posup = position.top - 2;

            let topL = document.elementFromPoint(position.left, posup);
            let topR = document.elementFromPoint(position.right, posup);

            if (topL.classList.contains('wall') == false && topR.classList.contains('wall') == false) {
                playerTop -= playerSpeed;
                player.style.top = playerTop + 'px';
            }

            playerMouth.classList = 'up';
        }
        else if(leftPressed) {
            let position = player.getBoundingClientRect();
            let posleft = position.left - 2;

            let leftT = document.elementFromPoint(posleft, position.top);
            let leftB = document.elementFromPoint(posleft, position.bottom);
            
            if (leftT.classList.contains('wall') == false && leftB.classList.contains('wall') == false) {
                playerLeft -= playerSpeed;
                player.style.left = playerLeft + 'px';
            }

            playerMouth.classList = 'left';
        }
        else if(rightPressed) {
            let position = player.getBoundingClientRect();
            let posright = position.right + 2;

            let rightT = document.elementFromPoint(posright, position.top);
            let rightB = document.elementFromPoint(posright, position.bottom);
            
            if (rightT.classList.contains('wall') == false && rightB.classList.contains('wall') == false) {
            playerLeft += playerSpeed;
            player.style.left = playerLeft + 'px';
            }
            playerMouth.classList = 'right';   
            
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
                liveslist.removeChild(livetoremove);
            }
        }
}


function areColliding() {
    let position = player.getBoundingClientRect();
    let wall = querySelectorAll('wall');
    
    for (let i = 0; i < wall.length; i++) {
        let pos = wall[i].getBoundingClientRect();
        if (position.right > pos.left && position.left < pos.right && position.bottom > pos.top && position.top < pos.bottom) {
            return true
           }
           return false
    }
};

//___________________________________________________________________________________

function startgame(){
    startbtn.style.display = "none";
    playable = true;
    gameLoop();
};


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