import React from "react";
import "./sudoku.css"
import { useEffect } from "react";
import { generateSodoku, isValid } from "./sodokuGame";

export interface box {
    value: number | undefined;
    state: "valid" | "invalid" | "empty" | "preset";
    highlight: boolean;
}

const App = () => {
    const [grid, setGrid] = React.useState<box[][]>([]);
    const [difficulty, setDifficulty] = React.useState<number>(40);

    function inputChange(e:any, i:number, j:number){
        grid[i][j].state = "empty";
        if (!isNaN(e.target.value[e.target.value.length - 1]))
            e.target.value =  e.target.value[e.target.value.length - 1];
        if(isNaN(e.target.value)) //checks if its not a number
        {
            if (!grid[i][j].value)
                e.target.value = "";
            else
                e.target.value = grid[i][j].value;
        }
        else if(e.target.value < 1)
            e.target.value = "";
        else
        {
            grid[i][j].value = parseInt(e.target.value);
            highlightNumbers(e, i, j);
        }
    }


    const check = () => {
        for(let i = 0; i < 9; i++){
            for(let j = 0; j < 9; j++){
                if(grid[i][j].value !== undefined && grid[i][j].value !== 0 && grid[i][j].state !== "preset"){
                    if(!isValid(i, j, grid, grid[i][j].value)){
                        console.log("Invalid: ", grid[i][j], i, j);
                        grid[i][j].state = "invalid";
                    }
                    else
                        grid[i][j].state = "valid";
                }
            }
        }
        setGrid(grid);
        console.log("Valid");
    };

    function highlightNumbers (e:any, i:number, j:number) {
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

    const makeSodoku = () => {
        generateSodoku(grid, difficulty, setGrid);
    }

    function selectDifficulty(e: any) {
        setDifficulty(e.target.value);
    }

    return (
        <div className="container">
            <label> Difficulty: <select onChange={(e) => selectDifficulty(e)} name="difficulty" id="difficulty">
                <option value="40">Easy</option>
                <option value="50">Medium</option>
                <option value="57">Hard</option>
                <option value="65">Expert</option>
            </select></label>
            <br></br>
            <button onClick={makeSodoku}>Random</button><br></br><br></br>

            <div className="gridConatiner"> 
                {Array.from({ length: 9 }, (_, i) => 
                    Array.from({ length: 9 }, (_, j) => {
                        
                        const row = grid[i];
                        if(row === undefined) grid[i] = [];
                        const col = grid[i][j];
                        if(col === undefined)
                            grid[i][j] = { state: "empty", value: undefined, highlight: false };

                        let color = "skyblue";
                        let fontColor = "black";
                        if (grid[i][j].state === "invalid")
                            color = "lightcoral";
                        if (grid[i][j].state === "valid")
                            color = "seagreen"
                        if (grid[i][j].state === "preset")
                            color = "cornflowerblue";
                        if (grid[i][j].highlight)
                            fontColor = "crimson";
                                              
                        let borderLeft = "";
                        let borderTop = "";
                        let borderBottom = "";
                        let borderRight = "";
                      
                        if((i+1) % 3 === 0){
                            borderBottom = "2px solid black";
                        }
                        
                        if((j+1) % 3 === 0){
                            borderRight = "2px solid black";
                        }
                      
                        if(i % 3 === 0) borderTop = "2px solid black";
                        if(j % 3 === 0) borderLeft = "2px solid black";

                        return (
                            <input
                                readOnly={grid[i][j].state === "preset"}
                                onChange={(e) => inputChange(e,i,j)}
                                onClick={(e) => highlightNumbers(e,i,j)}
                                value={grid[i][j].value || ""} 
                                maxLength={2} 
                                type="text" 
                                className="sodokuField" 
                                style={{backgroundColor: color, color: fontColor, borderLeft, borderTop, borderBottom, borderRight}}
                            />
                        );
                    })
                )}
            </div>

            <button onClick={check}>Check!</button>
        </div>
    );
};

export default App;
