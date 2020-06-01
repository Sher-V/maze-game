const dr = [-1, 0, 1, 0];
const dc = [0, 1, 0, -1];

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.walls = [true, true, true, true];
    }
}

class Maze {
    constructor(width, height) {
        this._width = width;
        this._height = height;
        this.grid = [[]];
    }

    isValid(x, y) {
        return x >= 0 && y >= 0 && x < this._height && y < this._width;
    }

    randNum(value) {
        return Math.floor(Math.random() * value);
    }

    hasNeighbours(current, seen) {
        for (let i = 0; i < 4; i++) {
            const point = {x: current.x + dr[i], y: current.y + dc[i]};
            if (this.isValid(point.x, point.y) && !seen[point.x][point.y]) {
                return true;
            }
        }
        return false;
    }

    generateMaze() {
        const seen = Array.from(new Array(this._height), () => new Array(this._width).fill(false));
        this.grid = seen.map((row, i) => row.map((cell, j) => new Point(i, j)));
        const stack = [];
        const startCell = this.grid[this.randNum(this._height)][this.randNum(this._width)];

        seen[startCell.x][startCell.y] = true;

        stack.push(startCell);

        while (stack.length) {
            const current = stack.pop();
            if (this.hasNeighbours(current, seen)) {
                stack.push(current);

                let x, y, randNum;
                do {
                    randNum = this.randNum(4);
                    x = current.x + dr[randNum];
                    y = current.y + dc[randNum];
                }
                while (!this.isValid(x, y) || seen[x][y])

                current.walls[randNum] = false;
                if (randNum - 2 >= 0)
                    this.grid[x][y].walls[randNum - 2] = false;
                else
                    this.grid[x][y].walls[randNum + 2] = false;

                seen[x][y] = true;
                stack.push(this.grid[x][y]);
            }
        }
    }

    renderMaze() {
        this.grid.forEach(row => {
            let rowDiv = document.createElement("div");
            rowDiv.className = "row";
            document.getElementById("maze").append(rowDiv);
            row.forEach((cell) => {
                let cellDiv = document.createElement("div");
                cellDiv.classList.add("cell");
                cell.walls.forEach((wallNum, index) => {
                    if (wallNum)
                        switch (index) {
                            case 0:
                                cellDiv.classList.add("topBorder");
                                break;
                            case 1:
                                cellDiv.classList.add("rightBorder");
                                break;
                            case 2:
                                cellDiv.classList.add("bottomBorder");
                                break;
                            case 3:
                                cellDiv.classList.add("leftBorder");
                                break;
                        }
                })
                rowDiv.append(cellDiv);
            })
        })
    }
}

const maze = new Maze(5, 5);

maze.generateMaze();

maze.renderMaze();

