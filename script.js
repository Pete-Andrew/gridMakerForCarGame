const grid = document.querySelector('.grid');
const colorPicker = document.getElementById('color');
const output = document.getElementById('output');
const generateBtn = document.getElementById('generate');

// Create a 6x6 grid
const gridSize = 6;
const cellData = Array.from({ length: gridSize }, () =>
    Array(gridSize).fill(null)
);

for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.x = x;
        cell.dataset.y = y;

        //
        cell.addEventListener('click', () => {
            const color = colorPicker.value;
            cell.style.backgroundColor = color;
            cellData[y][x] = color; // Save color to grid data
        });
        grid.appendChild(cell);
    }
}

// Function to generate JSON objects
function generateJSON() {
    const visited = Array.from({ length: gridSize }, () =>
        Array(gridSize).fill(false)
    );
    const cars = [];

    function dfs(x, y, color, bounds) {
        if (
            x < 0 ||
            y < 0 ||
            x >= gridSize ||
            y >= gridSize ||
            visited[y][x] ||
            cellData[y][x] !== color
        ) {
            return;
        }
        visited[y][x] = true;
        bounds.minX = Math.min(bounds.minX, x);
        bounds.maxX = Math.max(bounds.maxX, x);
        bounds.minY = Math.min(bounds.minY, y);
        bounds.maxY = Math.max(bounds.maxY, y);
        dfs(x + 1, y, color, bounds);
        dfs(x - 1, y, color, bounds);
        dfs(x, y + 1, color, bounds);
        dfs(x, y - 1, color, bounds);
    }

    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            if (!visited[y][x] && cellData[y][x]) {
                const bounds = { minX: x, maxX: x, minY: y, maxY: y };
                dfs(x, y, cellData[y][x], bounds);
                cars.push({
                    x: bounds.minX * 150,
                    y: bounds.minY * 150,
                    width: (bounds.maxX - bounds.minX + 1) * 150,
                    height: (bounds.maxY - bounds.minY + 1) * 150,
                    carLeftEdge: bounds.minX * 150,
                    carRightEdge: (x*150)+(bounds.maxX - bounds.minX + 1) * 150,
                    carTop: bounds.minY * 150,
                    CarBottom: bounds.minY * 150 + ((bounds.maxY - bounds.minY + 1) * 150),

                    color: cellData[y][x],
                    orientation:
                        bounds.minX === bounds.maxX ? 'vrt' : 'hrz',
                    hasMoved: false,
                    initialPosition: {  carLeftEdge: x*150, 
                                        carRightEdge: (x*150)+(bounds.maxX - bounds.minX + 1) * 150,
                                        carTop: bounds.minY * 150,  
                                        carBottom: bounds.minY * 150 + ((bounds.maxY - bounds.minY + 1) * 150)}

// { x: 600, y: 600, width: 150, height: 300, carLeftEdge: 600, carRightEdge: 750, carTop: 600, carBottom: 900, color: 'brown', orientation: 'vrt', hasMoved: false, initialPosition: { carLeftEdge: 600, carRightEdge: 750, carTop: 600, carBottom: 900 }}
                });
            }
        }
    }

    output.textContent = JSON.stringify(cars, null, 2);
}

//listener on the 'create JSON' button, calls the generateJSON func. 
generateBtn.addEventListener('click', generateJSON);

// { x: 600, y: 600, width: 150, height: 300, carLeftEdge: 600, carRightEdge: 750, carTop: 600, carBottom: 900, color: 'brown', orientation: 'vrt', hasMoved: false, initialPosition: { carLeftEdge: 600, carRightEdge: 750, carTop: 600, carBottom: 900 }}