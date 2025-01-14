const grid = document.querySelector('.grid');
const colorPicker = document.getElementById('color');
const output = document.getElementById('output');
const generateBtn = document.getElementById('generate');
const undo = document.getElementById('undo');
const redo = document.getElementById('redo');

let cellOrder = [];
let cellDataCopy;
let undoIndex = 0;
let cellOrderArrLength = cellOrder.length;

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

let cellData = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));
//console.log(cellData);

//BUG, need to add an undo button //undo button still has issues...
//need to add a 'copy all' button for the JSON out put
//need to add colour swatches 

function draw () {
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

            if (color == '#ffffff') {
                console.log("White");
                return; //exits the function if the cell is white e.g. null.
            };

            cellData[y][x] = color; // Save color to grid data, it colours the correct cell as the [y][x] are the cell co-ordinates
            //console.log(cellData[x][y]); //returns the #colour value when the colour is changed, cellData is the array that holds colour info. 
            //console.log("cell.dataset", cell.dataset); //gives the [y][x] value of the most recently clicked on cell.
            //console.log("cellData", cellData); // visually shows the whole array in the console
            
            //Create a deep copy of `cellData` and push it to `cellOrder`. 
            //If cellData is not deep copied then console logs of cellOrder will give the same value for each incidence of the array
            //as the console log will only reference the cellOrder array in it's current state (e.g. will not show past states). The deep copy solves this.  
            cellDataCopy = JSON.parse(JSON.stringify(cellData));
            //cell order is an array that holds a copy of the array each time a cell is added. 
            cellOrder.push(cellDataCopy);
            console.log("cellOrder:", cellOrder);
            cellOrderArrLength = cellOrder.length;
            console.log("cellOrderArrLength", cellOrderArrLength);
            undoIndex = cellOrderArrLength;
        });
        
        grid.appendChild(cell);
    }
}
}

//need to be able to move backwards and forwards in the cellOrder array.
//need a variable to hold where you are in the array ('undoIndex');
//need to run the 

function undoFunc() {
    //console.log("Undo clicked");
    if (undoIndex > 0) {
        //reduces the length of the undo index
        undoIndex--;
        console.log("cellOrder - holds past array info", cellOrder);
        console.log("undoIndex", undoIndex);
        console.log("cellOrder[undoIndex]", cellOrder[undoIndex]);

        // Clear the grid, removes all child elements from the gird
        grid.innerHTML = "";
      
        console.log("CellOrder length", cellOrder.length);

        // Repopulate the grid using the state from cellOrder[undoIndex]
        // Iterate through the 2D array stored in cellOrder[undoIndex] to reconstruct the grid.
        let previousState = cellOrder[undoIndex-1]; //-1 as the array is zero indexed
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.x = x;
                cell.dataset.y = y;

                //console.log(previousState); This churns out tons of console.logs
                // catches error if previous state is less than 1
                if(previousState == undefined) { 
                    draw();
                    return; //return stops the draw() being called loads of times.
                }
                // Apply the color from the previous state if it exists
                else if (previousState[y][x]) {
                    cell.style.backgroundColor = previousState[y][x];
                } 

                // Reattach the click event listener
                cell.addEventListener('click', () => {
                    const color = colorPicker.value;
                    cell.style.backgroundColor = color;
                    cellData[y][x] = color;

                    // Create a deep copy of `cellData` and push it to `cellOrder`
                    cellDataCopy = JSON.parse(JSON.stringify(cellData));
                    cellOrder.push(cellDataCopy);
                    console.log("cellOrder:", cellOrder);
                    cellOrderArrLength = cellOrder.length;
                    console.log("cellOrderArrLength", cellOrderArrLength);
                    undoIndex = cellOrderArrLength;
                });

                grid.appendChild(cell);
            }
        }

        // Update the cellData array to match the previous state
        cellData = JSON.parse(JSON.stringify(previousState));
    } else if (undoIndex == 0) {
        console.log("Nothing left to undo");
        grid.innerHTML = "";
        cellOrder = [];
        draw();
        
        
    }
}

// Add the undo button event listener
undo.addEventListener('click', undoFunc);

function redoFunc () {
    console.log("Re-do clicked");
    if(undoIndex < cellOrderArrLength) {
        undoIndex++;
        console.log("UndoIndex", undoIndex);
        
    } else {
        console.log("Cannot exceed cellOrderArrLength"); 
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
    //console.log(cellData);
    //console.log("cars", cars);

    // this replaces the simpler JSON output "output.textContent = JSON.stringify(cars, null, 2);" as it provides neater, more compact JSON
    function formatJSONByX(jsonObject) { //accepts JSON object as a value
        return JSON.stringify(jsonObject, (key, value) => { //JSON stringify called with 3 parameters, A custom replacer function (key, value) that alters the behavior of how arrays are processed.
            if (Array.isArray(value)) { //Checks if the current value being processed is an array
                return value.map(obj => //if true, it maps through the array
                    JSON.stringify(obj, null, 0).replace(/[\{\}]/g, '') // Each object in the array is stringified into a single-line JSON string. Remove curly braces temporarily for easier reformatting later
                );
            }
            return value; //Returns the original value unchanged if it's not an array.
        }, 2) // Indentation set to 2 for default pretty-printing.
 
        //uses regular expressions to tidy the JSON. 
        .replace(/"\[|\]"/g, '') // Remove surrounding quotes from the array
        .replace(/\\/g, '') // Remove escape characters
        .replace(/,{"x"/g, ',\n  {"x"') // Add new line before each "x" value
        .replace(/^\s*{\s*/gm, '{ ') // Align properties horizontally within objects
        .replace(/\s*}\s*$/gm, ' }'); // Close the horizontal alignment
    }
    
    // Use the custom function to format the JSON
    output.textContent = formatJSONByX(cars);
    
    //returns the output to screen as a JSON object - Depreciated for the above system.
    //This can run as a single line replacing the entire formatJSONByX function, but then you end up with a long string of JSON
    //output.textContent = JSON.stringify(cars, null, 2);
}

draw();

//creates an object that holds all the colours, colour names are the same as the element ID
const colorMapping = {
    redBtn: '#ff0000',
    greenBtn: '#00c500',
    blueBtn: '#0000ff',
    pinkBtn: '#ffc0cb',
    yellowBtn: '#ffff00',
    darkGreenBtn: '#006400',
    lightBlueBtn: '#87cefa',
    orangeBtn: '#ffa500',
    darkPurpleBtn: '#7e00a5',
    lightPurpleBtn: '#ff00f2',
    brownBtn:'#a52a2a',
    greyBtn:'#808080',
    oliveBtn:'#808000',
    nullBtn: '#ffffff',
};

//Object.Keys(colorMapping) - Returns the names of the enumerable string properties and methods of an object. 
//you can then perform a .forEach(using the button ID => )
Object.keys(colorMapping).forEach(btnId => {
    const button = document.getElementById(btnId);
    button.addEventListener('click', () => {
        colorPicker.value = colorMapping[btnId]; //takes the ID from the HTML button name and uses it to find the correct pair/colour in the colorMapping object
    });
});

//This function works as replacement for the following set up that would have to be created for each colour:

// redBtn.addEventListener('click', redBtnClick);
// function redBtnClick() {
//     colorPicker.value = '#ff0000';
// }


//BUG, need a copy JSON button


//listener on the 'create JSON' button, calls the generateJSON func. 
generateBtn.addEventListener('click', generateJSON);

//Undo event listener
undo.addEventListener('click', undoFunc)
//Redo event listener
//redo.addEventListener('click', redoFunc)

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