// This code is entirely writen by myself, however extensive research had to take place to understand BSP and how i could actualy impliment it with JS. most examples online are writen in c#, or python. It was still difficult to translate this into a well performing JS alernative
// I spent 1 month of developing before i got to a stage of refined code like this. 


export class Leaf {
    constructor(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.minSize = 1;
  
      this.left = null;
      this.right = null;
      this.room = null;
      this.corridors = [];
    }
  
    split() {
      if (this.left || this.right) return false;
  
      // decide split direction
      const splitH = Math.random() > 0.5;
      const max = splitH ? this.height : this.width;
  
      if (max <= this.minSize * 2 + 3) return false; // 
  
      const split = Math.floor(Math.random() * (max - this.minSize * 2 - 3)) + this.minSize; // just leave it works ....
  
      if (splitH) {
        this.left = new Leaf(this.x, this.y, this.width, split);
        this.right = new Leaf(this.x, this.y + split, this.width, this.height - split);
      } else {
        this.left = new Leaf(this.x, this.y, split, this.height);
        this.right = new Leaf(this.x + split, this.y, this.width - split, this.height);
      }
  
      return true;
    }
  
    createRooms(maze) {
      if (this.left || this.right) {
        if (this.left) this.left.createRooms(maze);
        if (this.right) this.right.createRooms(maze);
        if (this.left && this.right) this.createCorridor(maze, this.left.getRoomCenter(), this.right.getRoomCenter());
      } else {
        const roomSizeW = Math.floor(Math.random() * (this.width - 4)) + 3;
        const roomSizeH = Math.floor(Math.random() * (this.height - 4)) + 3;
        const roomX = Math.max(this.x + 1, Math.min(this.x + this.width - roomSizeW - 1, this.x + 1));
        const roomY = Math.max(this.y + 1, Math.min(this.y + this.height - roomSizeH - 1, this.y + 1));        
  
        this.room = { x: roomX, y: roomY, width: roomSizeW, height: roomSizeH };
  
        // Carve room
        for (let y = roomY; y < roomY + roomSizeH; y++) {
          for (let x = roomX; x < roomX + roomSizeW; x++) {
            maze[y][x] = 0;
          }
        }
      }
    }
  
    getRoomCenter() {
      if (this.room) {
        return {
          x: Math.floor(this.room.x + this.room.width / 2),
          y: Math.floor(this.room.y + this.room.height / 2),
        };
      } else {
        const leftCenter = this.left?.getRoomCenter();
        const rightCenter = this.right?.getRoomCenter();
        return leftCenter || rightCenter;
      }
    }
  
    createCorridor(maze, point1, point2) {
      if (!point1 || !point2) return;
      let x1 = point1.x;
      let y1 = point1.y;
      let x2 = point2.x;
      let y2 = point2.y;
  
      if (Math.random() < 0.5) {
        this.carveHorizontal(maze, x1, x2, y1);
        this.carveVertical(maze, y1, y2, x2);
      } else {
        this.carveVertical(maze, y1, y2, x1);
        this.carveHorizontal(maze, x1, x2, y2);
      }
    }
  
    carveHorizontal(maze, x1, x2, y) {
      for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
        maze[y][x] = 0;
      }
    }
  
    carveVertical(maze, y1, y2, x) {
      for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
        maze[y][x] = 0;
      }
    }
  }
  
  export function generateBSPMap(width, height, maxLeaves = 90) {
    // fill maze with walls
    const maze = Array.from({ length: height }, () => Array(width).fill(1));
    const root = new Leaf(0, 0, width, height);
    const leaves = [root];
  
    //split leavees
    let didSplit = true;
    while (didSplit && leaves.length < maxLeaves) {
      didSplit = false;
      for (let i = 0; i < leaves.length; i++) {
        const leaf = leaves[i];
        if (!leaf.left && !leaf.right && leaf.width > 1 && leaf.height > 1) {
          if (leaf.split()) {
            leaves.push(leaf.left, leaf.right);
            didSplit = true;
          }
        }
      }
    }
  
    //create rooms and corridors
    root.createRooms(maze);
  
    return {
      maze,
      playerStart: root.getRoomCenter()
    };
  }
  