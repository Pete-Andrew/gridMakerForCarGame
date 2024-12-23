const grid = document.querySelector('.grid');
const colorPicker = document.getElementById('color');
const output = document.getElementById('output');
const generateBtn = document.getElementById('generate');

// Create a 6x6 grid
const gridSize = 6;
//This creates a 2D array (cellData) of size 6x6, initialized with null values. 
//IT DOES NOT draw the actual array to screen. 
//Array.from({ length: gridSize } creates an array of 6 elements e.g. [undefined, undefined, undefined, undefined, undefined, undefined]
//for each element in the array the call back is executed. 
//() => Array(gridSize).fill(null) Creates a new array of size gridSize (6 in this case) and fills the array with Null, e.g [null, null, null, null, null, null]
//each result of the callback becomes an element in the outer array.
//when this is run through the for loop below you end up with an array of 6 columns and rows, I've pasted this at the end of the JS as an example. 
//A callback function is simply a function passed as an argument to another function and executed at a later time (or for each element in this case).
//In Array.from, the callback function determines the value for each element in the array being created.
//the Array constructor does not need the 'new' prefix, unlike other constructors
const cellData = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));
console.log(cellData);

//this for loop draws the physical grid and pushes info to the cellData array created above
for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
        //You can add attributes (e.g. className, dataSet etc.) to const cell as it is not an object not a primitive value, objects. 
        //Primitive Values: Numbers, strings, booleans, null, undefined, and symbols.
        //you can modify the properties or methods of the object because the const keyword only prevents reassignment of the variable itself—not its contents.
        //div is a DOM element, a DOM element is an object
        const cell = document.createElement('div');
        //Assigns a class name cell to the <div>
        cell.className = 'cell';
        //Sets custom data-x and data-y attributes on the cell. These store the cell's coordinates (column and row index, respectively)
        //And pass them to the cellData array when clicked on
        cell.dataset.x = x;
        cell.dataset.y = y;

        //updates the cell colour values when clicked on and pushed the values to the cellData array. 
        cell.addEventListener('click', () => {
            const color = colorPicker.value;
            cell.style.backgroundColor = color;
            cellData[y][x] = color; // Save color to grid data, it colours the correct cell as the [y][x] are the cell co-ordinates
            //console.log(cellData[x][y]); //returns the #colour value when the colour is changed, cellData is the array that holds colour info. 
            console.log(cell.dataset); //gives the [y][x] value of the most recently clicked on cell.
            console.log(cellData); // visually shows the whole array in the console
        });
        grid.appendChild(cell);
    }
}

//Function to generate JSON objects

//const visited is a 2D array of the same size as the grid. It keeps track of which cells have already been processed.
//Initially, all values are set to false, meaning no cell has been visited yet.
function generateJSON() {
    const visited = Array.from({ length: gridSize }, () =>
        Array(gridSize).fill(false)
    );
    //The array that stores the JSON data
    const cars = [];

    //Depth-First Search (DFS) Function
    //Depth-first search (DFS) is an algorithm for traversing or searching tree or graph data structures. 
    //The algorithm starts at the root node and explores as far as possible along each branch before backtracking.
    function dfs(x, y, color, bounds) {
        if (
            x < 0 ||                    // Check if the cell is out of bounds
            y < 0 ||                    // Check if the cell is out of bounds
            x >= gridSize ||            // Check if the cell exceeds grid dimensions
            y >= gridSize ||            // Check if the cell exceeds grid dimensions
            visited[y][x] ||            // Check if the cell has already been processed
            cellData[y][x] !== color    // Check if the cell's color matches the target color
            // if any of these values are out of bounds then the function returns.
        ) {
            return;
        }

        visited[y][x] = true; // Mark the current cell as visited
        //updates the bounds of the car e.g. Update minimum/maximum x co-ordinate/y co-ordinate
        bounds.minX = Math.min(bounds.minX, x);
        bounds.maxX = Math.max(bounds.maxX, x);
        bounds.minY = Math.min(bounds.minY, y);
        bounds.maxY = Math.max(bounds.maxY, y);

        //recursively calls the dfs (Depth-First Search) function on neighboring cells
        dfs(x + 1, y, color, bounds); // Check the cell to the right
        dfs(x - 1, y, color, bounds); // Check the cell to the left
        dfs(x, y + 1, color, bounds); // Check the cell below
        dfs(x, y - 1, color, bounds); // Check the cell above
    }

    for (let y = 0; y < gridSize; y++) {  //nested for loops iterate through the cells of the grid
        for (let x = 0; x < gridSize; x++) {

            if (!visited[y][x] && cellData[y][x]) {
                const bounds = { minX: x, maxX: x, minY: y, maxY: y }; // Initialize bounding box
                
                dfs(x, y, cellData[y][x], bounds); // Groups connected cells 

                //pushes the object to the cars Array
                cars.push({
                    x: bounds.minX * 150,
                    y: bounds.minY * 150,
                    width: (bounds.maxX - bounds.minX + 1) * 150,
                    height: (bounds.maxY - bounds.minY + 1) * 150,
                    carLeftEdge: bounds.minX * 150,
                    carRightEdge: (x*150)+(bounds.maxX - bounds.minX + 1) * 150,
                    carTop: bounds.minY * 150,
                    carBottom: bounds.minY * 150 + ((bounds.maxY - bounds.minY + 1) * 150),
                    color: cellData[y][x],
                    orientation: bounds.minX === bounds.maxX ? 'vrt' : 'hrz',
                    hasMoved: false,
                    initialPosition: {  carLeftEdge: x*150, 
                                        carRightEdge: (x*150)+(bounds.maxX - bounds.minX + 1) * 150,
                                        carTop: bounds.minY * 150,  
                                        carBottom: bounds.minY * 150 + ((bounds.maxY - bounds.minY + 1) * 150)}

                });
            }
        }
    }

    //shows how the cellData array has been populated by colour values
    console.log(cellData);

    //returns the output to screen as a JSON object
    output.textContent = JSON.stringify(cars, null, 2);
}

//listener on the 'create JSON' button, calls the generateJSON func. 
generateBtn.addEventListener('click', generateJSON);

//example car object from the cars game. 
// { x: 600, y: 600, width: 150, height: 300, carLeftEdge: 600, carRightEdge: 750, carTop: 600, carBottom: 900, color: 'brown', orientation: 'vrt', hasMoved: false, initialPosition: { carLeftEdge: 600, carRightEdge: 750, carTop: 600, carBottom: 900 }}

//example array produced by the const cellData
// [
//     [null, null, null, null, null, null],
//     [null, null, null, null, null, null],
//     [null, null, null, null, null, null],
//     [null, null, null, null, null, null],
//     [null, null, null, null, null, null],
//     [null, null, null, null, null, null]
// ]