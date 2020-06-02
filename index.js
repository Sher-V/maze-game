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

    addPlayer(player) {
        this.player = player;
        document.getElementsByClassName("row")[player._x]
            .childNodes[player._y].classList.add("active");

        window.addEventListener("keydown", (e) => {
            if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
                e.preventDefault();
                this.movePlayer(player, e.key);
            }
        }, false);
    }

    checkWin(player) {
        if (player._x === this._height - 1 && player._y === this._width - 1) {
            document.getElementsByClassName("row")[player._x]
                .childNodes[player._y].classList.remove("active");
            document.getElementsByClassName("row")[0]
                .childNodes[0].classList.add("active")
            /*            player._x = 0;
                        player._y = 0;*/
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    async solve() {
        const queueX = [], queueY = [],
            marked = Array.from(new Array(this._height), () => new Array(this._width).fill(null));
        queueX.push(this.player._x);
        queueY.push(this.player._y);
        debugger

        while (queueY.length) {
            const x = queueX.shift(), y = queueY.shift();
            for (let i = 0; i < 4; i++) {
                const newX = x + dr[i], newY = y + dc[i];
                if (this.isValid(newX, newY) && !marked[newX][newY] && !this.grid[x][y].walls[i]) {
                    marked[newX][newY] = true;
                    await this.sleep(10);
                    const elements = document.getElementsByClassName("active");
                    document.getElementsByClassName("row")[newX].childNodes[newY].classList.add("active");
                    if (newX === this._height - 1 && newY === this._width - 1) break;
                    queueX.push(newX);
                    queueY.push(newY);
                }
            }
        }
    }

    movePlayer(player, key) {
        switch (key) {
            case "ArrowUp":
                if (this.isValid(player._x - 1, player._y) && !this.grid[player._x][player._y].walls[0]) {
                    document.getElementsByClassName("row")[player._x]
                        .childNodes[player._y].classList.remove("active");
                    document.getElementsByClassName("row")[player._x - 1]
                        .childNodes[player._y].classList.add("active")
                    player._x -= 1;
                    this.checkWin(player);
                }
                break;
            case "ArrowRight":
                if (this.isValid(player._x, player._y + 1) && !this.grid[player._x][player._y].walls[1]) {
                    document.getElementsByClassName("row")[player._x]
                        .childNodes[player._y].classList.remove("active");
                    document.getElementsByClassName("row")[player._x]
                        .childNodes[player._y + 1].classList.add("active")
                    player._y += 1;
                    this.checkWin(player);
                }

                break;
            case "ArrowDown":
                if (this.isValid(player._x + 1, player._y) && !this.grid[player._x][player._y].walls[2]) {
                    document.getElementsByClassName("row")[player._x]
                        .childNodes[player._y].classList.remove("active");
                    document.getElementsByClassName("row")[player._x + 1]
                        .childNodes[player._y].classList.add("active")
                    player._x += 1;
                    this.checkWin(player);
                }
                break;
            case "ArrowLeft":
                if (this.isValid(player._x, player._y - 1) && !this.grid[player._x][player._y].walls[3]) {
                    document.getElementsByClassName("row")[player._x]
                        .childNodes[player._y].classList.remove("active");
                    document.getElementsByClassName("row")[player._x]
                        .childNodes[player._y - 1].classList.add("active")
                    player._y -= 1;
                    this.checkWin(player);
                }
                break;
        }
    }
}

class Player {
    constructor(x, y) {
        this._x = x;
        this._y = y;
    }


    set x(value) {
        this._x = value;
    }

    set y(value) {
        this._y = value;
    }
}

const maze = new Maze(18, 18);

maze.generateMaze();
maze.renderMaze();

maze.addPlayer(new Player(0, 0))

maze.solve()
