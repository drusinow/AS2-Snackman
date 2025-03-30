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
    [1, 0, 2, 1, 0, 0, 0, 0, 3, 1],
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

const player = document.querySelector('#player');
const playerMouth = player.querySelector('.mouth');
const playerpos = player.getBoundingClientRect();
let playerTop = 0;
let playerLeft = 0;


function isColliding(player, object) {
    return (
        player.x < object.x + object.width &&
        player.x + player.width > object.x &&
        player.y < object.y + object.height &&
        player.y + player.height > object.y
    );
}

function movement() {
    if (playable == true) {
    setInterval(function() {
        if(downPressed) {

            let position = player.getBoundingClientRect();
            let newBottom = position.bottom + 2;
            let btmL = document.elementFromPoint(position.left, newBottom);
            let btmR = document.elementFromPoint(position.right, newBottom);

            if (btmL.classList.contains('wall') == false && btmR.classList.contains('wall') == false) {
                playerTop += playerSpeed;
                player.style.top = playerTop + 'px';
                }
            playerMouth.classList = 'down';
        }
        else if(upPressed) {
            let position = player.getBoundingClientRect();
            let newTop = position.top - 1;
            let topL = document.elementFromPoint(position.left, newTop);
            let topR = document.elementFromPoint(position.right, newTop);

            if (topL.classList.contains('wall') == false && topR.classList.contains('wall') == false) {
                playerTop -= playerSpeed;
                player.style.top = playerTop + 'px';
                }
            
            playerMouth.classList = 'up';
        }
        else if(leftPressed) {
            let position = player.getBoundingClientRect();
            let newLeft = position.left - 2;
            let leftT = document.elementFromPoint(newLeft, position.top);
            let leftB = document.elementFromPoint(newLeft, position.bottom);

            if (leftT.classList.contains('wall') == false && leftB.classList.contains('wall') == false) {
                playerLeft -= playerSpeed;
                player.style.left = playerLeft + 'px';
                }

            playerMouth.classList = 'left';
        }
        else if(rightPressed) {
            let position = player.getBoundingClientRect();
            let newRight = position.right + 1;

            let rightT = document.elementFromPoint(newRight, position.top);
            let rightB = document.elementFromPoint(newRight, position.bottom);

            if (rightT.classList.contains('wall') == false && rightB.classList.contains('wall') == false) {
                playerLeft += playerSpeed;
                player.style.left = playerLeft + 'px';
            }

            playerMouth.classList = 'right';
        }
    }, 10);
    };
};

function startgame(){
    startbtn.style.display = "none";
    playable = true;
    movement()
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