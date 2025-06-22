import React, { useNavigate } from "react";
import "./sudoku.css"
import { useEffect } from "react";
import { useState } from "react";
import { generateSodoku, isValid } from "./sodokuGame";
// import { start } from "repl";

// import Timer from "./components/timer";

const token = localStorage.getItem("token") || undefined;
 

export interface box {
    value: number | undefined;
    state: "valid" | "invalid" | "empty" | "preset";
    highlight: boolean;
}

interface select {
    y: number;
    x: number;
}

let selected: select = { y: -1, x: -1 };

let generating: boolean = false;
export const updateGenerating = (value:boolean) => generating = value;

const checkSudoku = (setGameOver:(value:boolean) => void) =>
{
    const [grid, setGrid] = React.useStatic<box[][]>("grid", ([]));

    let done: boolean = true;
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            if(grid[i][j].value !== undefined && grid[i][j].value !== 0 && grid[i][j].state !== "preset"){
                if(!isValid(i, j, grid, grid[i][j].value)){
                    console.log("Invalid: ", grid[i][j], i, j);
                    grid[i][j].state = "invalid";
                    done = false;
                }
                else
                    grid[i][j].state = "valid";
            }
            else if (grid[i][j].state !== "preset")
                done = false; 
        }
    }
    if (done)
    {
        setTimeout(() => {
            setGameOver(true);
        }, 0)
        console.log("Done!");
    }
    else {
        setTimeout(() => {
            setGameOver(false);
        }, 0)
        console.log("keep going!");
    }
    setGrid(grid);
};

function highlightNumbers (e:any, i:number, j:number) {
    const [grid, setGrid] = React.useStatic<box[][]>("grid", ([]));

    selected.y = i;
    selected.x = j;

    if (!grid[i][j].value)
        return;
    let value = grid[i][j].value;
    for (let row = 0; row < 9; row++)
    {
        for (let col = 0; col < 9; col++)
        {
            if (grid[row][col].value === value)
                grid[row][col].highlight = true;
            else
                grid[row][col].highlight = false;
        }
    }
    setGrid(grid);
}

function inputChange(e:any, i:number, j:number) {
    const [grid, setGrid] = React.useStatic<box[][]>("grid", ([]));

    if (grid[i][j].state === "preset")
        return;
    grid[i][j].state = "empty";
    if (!isNaN(e[e.length - 1]))
        e =  e[e.length - 1];
    if(isNaN(e)) //checks if its not a number
    {
        if (!grid[i][j].value)
            e = "";
        else
            e = grid[i][j].value;
    }
    else if(e < 1)
        e = "";
    else
    {
        grid[i][j].value = parseInt(e);
        highlightNumbers(e, i, j);
        return;
    }
    grid[i][j].value = undefined;
    
    setGrid(grid);
}

function setColors (state: string, i:number, j:number, grid:box[][]) {

    let fieldColor = "rgb(121 195 218)";
    let fontColor = "black";

    if (grid[i][j].state === "invalid")
        fieldColor = "lightcoral";
    if (grid[i][j].state === "valid")
        fieldColor = "rgb(78, 175, 146)"
    if (grid[i][j].state === "preset")
        fieldColor = "cornflowerblue";
    if (grid[i][j].highlight)
        fontColor = "gold";

    return {
        color: fieldColor,
        fontColor: fontColor
    }
}

function setBorder (i:number, j:number) {
    let borderLeft = "";
    let borderTop = "";
    let borderBottom = "";
    let borderRight = "";

    if((i+1) % 3 === 0){
        borderBottom = "2px solid rgb(33, 44, 65)";
    }
    
    if((j+1) % 3 === 0){
        borderRight = "2px solid rgb(33, 44, 65)";
    }
    
    if(i % 3 === 0) borderTop = "2px solid rgb(33, 44, 65)";
    if(j % 3 === 0) borderLeft = "2px solid rgb(33, 44, 65)";

    return {
        borderLeft: borderLeft,
        borderTop: borderTop,
        borderBottom: borderBottom,
        borderRight: borderRight
    }
}

function SudokuGrid({ gameOver, setGameOver }:{ gameOver: boolean , setGameOver: (value:boolean) => void }) {
    const [grid, setGrid] = React.useStatic<box[][]>("grid", ([]));

    return (
        <div className="gridConatiner">
            {Array.from({ length: 9 }, (_, i) => 
                Array.from({ length: 9 }, (_, j) => {
                    
                    const row = grid[i];
                    if(row === undefined) grid[i] = [];
                    const col = grid[i][j];
                    if(col === undefined)
                        grid[i][j] = { state: "empty", value: undefined, highlight: false };
                    
                    const { color, fontColor } = setColors(grid[i][j].state, i, j, grid);
                    const { borderLeft, borderTop, borderBottom, borderRight } = setBorder(i, j);
                    
                    return (
                        <input
                            className="sodokuField"
                            
                            readOnly={grid[i][j].state === "preset"}
                            onChange={(e:any) => inputChange(e.target.value,i,j)}
                            onClick={(e:any) => highlightNumbers(e,i,j)}
                            value={grid[i][j].value || ""} 
                            maxLength={2} 
                            type="text" 
                            style={{backgroundColor: color, color: fontColor, borderLeft, borderTop, borderBottom, borderRight}}
                        />
                    );
                })
            )}
            {gameOver && <VictoryBanner setGameOver={setGameOver}/>}
        </div>
    )
}

// e:any, setDifficulty: (difficulty:number) => void
function DifficultyChange() {
    const [difficulty, setDifficulty] = React.useStatic("difficulty", 1);
    
    return (
        <label> Difficulty: 
            <select onChange={(e:any) => setDifficulty(e.target.value)}>
                <option value="1">testing</option>
                <option value="40">Easy</option>
                <option value="45">Medium</option>
                <option value="50">Hard</option>
                <option value="55">Expert</option>
            </select>
        </label>
    )
}

function VictoryBanner({setGameOver}:{setGameOver: (value:boolean) => void}) {
    const navigate = useNavigate();
    return (
        <div className="victory-banner">
            <h2>You Win!</h2>
            <p>Congratulations! You solved the Sudoku!</p>
            <p>Time:</p>
            {/* timer */}
            <button className="startButton" onClick={() => setGameOver(false)}>play again</button>
        </div>   
    )

}

const makeSodoku = () => {
    const [grid, setGrid] = React.useStatic<box[][]>("grid", ([]));
    const [difficulty, setDifficulty] = React.useStatic("difficulty", 1);

    console.log("generating = ", generating);
    if (!generating)
        generateSodoku(grid, difficulty, setGrid);
    //startTimer();
}
//inputChange(1,i,j)

function NumberInput() {
    const [grid, setGrid] = React.useStatic<box[][]>("grid", ([]));

    return (
        <div className="number-input">
            {Array.from({ length: 9 }, (_, i) =>
                <button className="numberButton" onClick={() => {
                    inputChange(i + 1, selected.y, selected.x);
                }}>{i + 1}</button>
            )}
            <button className="numberButton" onClick={() => {inputChange(0, selected.y, selected.x)}}>X</button>
        </div>
    )
}

function Timer({}) {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setSeconds((prev) => prev + 1);
        }, 1000)

        return () => {
            clearInterval(timer);
        }

    }, [])

    let min = Math.floor(seconds / 60).toString().padStart(2,'0');
    let sec = (seconds % 60).toString().padStart(2, '0');

    return (
        <div className="timer">
            <p>{min}:{sec}</p>
        </div>
    )
}


const App = () => {
    const [login, setLogin] = React.useStatic("login", false);
    const [gameOver, setGameOver] = useState(false);
    
    const navigate = useNavigate();

    if(!login){
        navigate("/login");
        return null;
    }

    return (
        <div className="game-container">
            <div className="start-container" >
                <DifficultyChange />
                <button className="startButton" onClick={makeSodoku}>Start!</button><br></br>
                <Timer/>
            </div>
            <SudokuGrid
                gameOver={gameOver}
                setGameOver={setGameOver}
            />
            <NumberInput/>
            <button className="basicButton" onClick={() => checkSudoku(setGameOver)}> Check! </button>
        </div>
    )
}

export default App;