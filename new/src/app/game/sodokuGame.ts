//const gridArray: number[][] = [];
// interface box {
//     value: number;
//     state: "valid" | "invalid" | "empty";
// }
import {box, updateGenerating} from "./index";

function isValid(row: number, col: number, gridArray: box[][], num: number | undefined) {

    for(let i = 0; i < 9; i++){
        if(gridArray[row][i].value != undefined && gridArray[row][i].value === num && i !== col)
            return false;
        if(gridArray[i][col].value === num && gridArray[i][col].value != undefined && i !== row) 
            return false;
    }

    
    const startRow = row - row % 3;
    const startCol = col - col % 3;
    for(let i = 0; i < 3; i++)
    {
        for(let j = 0; j < 3; j++)
        {
            if(gridArray[i + startRow][j + startCol].value === num && gridArray[i + startRow][j + startCol].value != undefined && i + startRow !== row && j + startCol !== col)
                return false;
        }
    }
    return true;
}

function shuffle(array: number[]): number[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const sodoku: box[][] = [];
const sodokuCopy: box[][] = [];

async function generateSolution(setGrid: (box: box[][]) => void) {    
    for (let row = 0; row < 9; row++)
    {
        for (let col = 0; col < 9; col++)
        {
            if (sodoku[row][col].value === undefined)
            {
                const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
                for (const i of numbers) {
                    if (isValid(row, col, sodoku, i)) {
                        sodoku[row][col].value = i;
                        sodokuCopy[row][col].value = Math.floor(Math.random() * 9) + 1;
                        setGrid(sodokuCopy);
                        await new Promise(f => setTimeout(f, 10));
                        if (await generateSolution(setGrid) === true)
                            return (true);
                    }
                    sodoku[row][col].value = undefined;
                    sodokuCopy[row][col].value = undefined
                }
                return (false);
            }
        }
    }
    return (true);
}

function deleteNumbers(amount: number, grid: box[][], setGrid: (box: box[][]) => void) {
    let row = Math.floor(Math.random() * 9);
    let col = Math.floor(Math.random() * 9);
    for (let i = 0; i < amount; i++)
    {
        while (grid[row][col].state === "empty"){
            console.log("reroll");
            row = Math.floor(Math.random() * 9);
            col = Math.floor(Math.random() * 9);
        }
        grid[row][col].state = "empty";
        grid[row][col].value = 0;
        setGrid(grid);
    }
    setGrid(grid);
    console.log(grid);
}

async function generateSodoku(grid: box[][], difficulty: number, setGrid: (box: box[][]) => void)
{
    updateGenerating(true);
    for (let row = 0; row < 9; row++) {
        sodoku[row] = [];
        sodokuCopy[row] = [];
        for (let col = 0; col < 9; col++) {
            sodoku[row][col] = { state: "preset", value: undefined, highlight: false };
            sodokuCopy[row][col] = { state: "preset", value: undefined, highlight: false };
        }
    }
    await generateSolution(setGrid);
    deleteNumbers(difficulty, sodoku, setGrid);
    updateGenerating(false);
}


export {isValid, generateSodoku};