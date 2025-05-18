import { generateBSPMap } from './mapGeneration.js';


document.addEventListener('DOMContentLoaded', () => { // when dom is loaded load functions and assign varibles
// init variables
    const main = document.querySelector('main');
    const blockSize = 40; // block size in px
    let gridSize = 10; 
    let currentTool = 'wall'; 
    let maze = [];
    
    createMapMaker();
    initializeEmptyMap();
    
    function createMapMaker() {




        // Add event listeners to toolbar elements
        document.getElementById('gridSizeSelect').addEventListener('change', (e) => {
            gridSize = parseInt(e.target.value);// target.value here is the selected gridsize from the input dropdown
            initializeEmptyMap(); // will set map once updated
        });
        
        document.querySelectorAll('.tool-option').forEach(option => {
            option.addEventListener('click', (e) => {
                document.querySelectorAll('.tool-option').forEach(o => o.classList.remove('selected')); // removes selected from all
                e.target.classList.add('selected');
                currentTool = e.target.dataset.tool; // kinda complicated but assigns selected tool after clicked. if it contains classlist selected, we can place 
            });
        });
        
        document.getElementById('generateCodeBtn').addEventListener('click', generateMapCode);
        


    }
    
    function initializeEmptyMap() {
        // clear main element aka maze
        main.innerHTML = '';
        
        // creating grid
        main.style.display = 'grid';
        main.style.gridTemplateColumns = `repeat(${gridSize}, ${blockSize}px)`;
        main.style.gridTemplateRows = `repeat(${gridSize}, ${blockSize}px)`;
        
        // fill the maze array with 1s / walls
        maze = Array.from({ length: gridSize }, () => Array(gridSize).fill(1));
        
        // create cells using the css map-cell and walls
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                const cell = document.createElement('div');
                cell.classList.add('map-cell', 'wall');
                cell.dataset.x = x; // this gives cell a data atribute of x and y 
                cell.dataset.y = y;
                
                //cell click check.
                cell.addEventListener('click', () => handleCellClick(cell, x, y));
                cell.addEventListener('mousedown', (e) => {
                    // mousedown for dragging
                    if (e.buttons === 1) {
                        handleCellClick(cell, x, y);
                    }
                });
                cell.addEventListener('mouseover', (e) => {
                    // mouseover for paint effect thingy
                    if (e.buttons === 1) {
                        handleCellClick(cell, x, y);
                    }
                });
                
                main.appendChild(cell);
            }
        }
    }
    
    function handleCellClick(cell, x, y) {
        cell.classList.remove('wall', 'empty', 'player', 'enemy');
        
        // set tool to current tool nitialized at the start
        cell.classList.add(currentTool);
        
        // update maze array
        switch (currentTool) {
            case 'wall':
                maze[y][x] = 1;
                break;
            case 'empty':
                maze[y][x] = 0;
                break;
            case 'player':
                // remove previous player position if exists | VERY IMPORTANT -> prevents multiple players from spawning.
                for (let i = 0; i < gridSize; i++) {
                    for (let j = 0; j < gridSize; j++) {
                        if (maze[i][j] === 2) {
                            maze[i][j] = 0;
                            const playerCell = document.querySelector(`.map-cell[data-x="${j}"][data-y="${i}"]`);// acts super weird, but it kinda works
                            if (playerCell) { 
                                playerCell.classList.remove('player');
                                playerCell.classList.add('empty');
                            }
                        }
                    }
                }
                maze[y][x] = 2;
                break;
            case 'enemy':
                maze[y][x] = 3;
                break;
        }
    }
    
    function generateMapCode() {
        // check if the map contains a player
        let hasPlayer = false;
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                if (maze[y][x] === 2) {
                    hasPlayer = true;
                    break;
                }
            }
            if (hasPlayer) break;
        }
        
        if (!hasPlayer) {
            alert('must have player');
            return;
        }
        
        //same base64 encoding from script.js   
        const json = JSON.stringify(maze);
        const code = btoa(unescape(encodeURIComponent(json)));

        console.log(code)
        navigator.clipboard.writeText(code)
    }
    
    
});