import React from "react";
import "./sudoku.css"
import { useEffect } from "react";
import { useState } from "react";
import { generateSodoku, isValid } from "./sodokuGame";
// import { start } from "repl";

// import Timer from "./components/timer";

export interface box {
    value: number | undefined;
    state: "valid" | "invalid" | "empty" | "preset";
    highlight: boolean;
}

let generating: boolean = false;
export const updateGenerating = (value:boolean) => generating = value;

const App = () => {
    const [grid, setGrid] = React.useState<box[][]>([]);
    const [difficulty, setDifficulty] = React.useState<number>(1);
    const token = localStorage.getItem("token") || undefined;
    const [login, setLogin] = React.useState<boolean>(false);
    const [finished, setFinished] = React.useState<boolean>(false);
    // const [seconds, setSeconds] = useState<number>(0);
    // const [minutes, setMinutes] = useState<number>(0);
    const [time, setTime] = useState<string>("00:00");

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
            return;
        }
        grid[i][j].value = undefined;
        
    }

    const check = () => {
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
            }
        }
        if (done)
        {
            setFinished(true);
            console.log("Done!");
        }
        else{
            setFinished(false);
            console.log("keep going!");
        }
        setGrid(grid);
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
        console.log("generating = ", generating);
        if (!generating)
            generateSodoku(grid, difficulty, setGrid);
        startTimer();
    }

    function selectDifficulty(e: any) {
        setDifficulty(e.target.value);
    }

    async function authenticateLogin(){
        const response = await fetch("http://localhost:5555/authenticate", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
                //"Authorization": "Bearer " + localStorage.getItem("token") || ""
            }
        });
        const data = await response.json();

        const auth: boolean = data.login;
        setLogin(auth);
      
        console.log(data);
    }

    useEffect(() => {
        authenticateLogin();
    }, []);

    async function addTime() {
        const timeData = time.split(":");

        const minutes = parseInt(timeData[0]);
        const seconds = parseInt(timeData[1]);

        console.log("min: ", minutes, "sec: ", seconds);
        let mode = "";
        console.log("difficulty: ", difficulty);
        if (difficulty == 40)
            mode = "easy";
        else if (difficulty == 45)
            mode = "medium";
        else if (difficulty == 50)
            mode = "hard";
        else if (difficulty == 55)
            mode = "expert";
        else if (difficulty == 1)
            mode = "testing";
        else
            mode = "unknown";
        const response = await fetch("http://localhost:5555/addTime", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                "uname": localStorage.getItem("uname"),
                "time": minutes * 60 + seconds,
                "mode": mode
            })
        });
        console.log(mode);
        const data = await response.json();
        console.log(data);
    }

    // function startTimer() {
    //     let timer: number = 0;
    //     const interval = setInterval(() => {
    //         console.log(minutes, ":", seconds);
    //         setSeconds(timer % 60);
    //         setMinutes(Math.floor(timer / 60));
    //         timer++;
    //         if (finished)
    //             clearInterval(interval);
    //     }, 1000);
    //     console.log("timer: ", timer);
    //     return (timer: number) => clearInterval(interval);
    // }

    

    return (
        <div className="container">
            <h1> Sudoku </h1>
            {!login && (
                <div>
                    <button onClick={() => window.location.href = "/login"}>login</button>
                    <button onClick={() => window.location.href = "/register"}>register</button>
                </div>
            )}
            {login && (
            <div className="test">
            <label> Difficulty: 
                <select onChange={(e:any) => selectDifficulty(e)}>
                    <option value="1">testing</option>
                    <option value="40">Easy</option>
                    <option value="45">Medium</option>
                    <option value="50">Hard</option>
                    <option value="55">Expert</option>
                </select>
            </label>
            
            <button onClick={makeSodoku}>Start!</button><br></br>

            <div className="gridConatiner"> 
                {Array.from({ length: 9 }, (_, i) => 
                    Array.from({ length: 9 }, (_, j) => {
                        
                        const row = grid[i];
                        if(row === undefined) grid[i] = [];
                        const col = grid[i][j];
                        if(col === undefined)
                            grid[i][j] = { state: "empty", value: undefined, highlight: false };

                        let color = "rgb(121 195 218)";
                        let fontColor = "black";
                        if (grid[i][j].state === "invalid")
                            color = "lightcoral";
                        if (grid[i][j].state === "valid")
                            color = "rgb(78, 175, 146)"
                        if (grid[i][j].state === "preset")
                            color = "cornflowerblue";
                        if (grid[i][j].highlight)
                            fontColor = "gold";
                                              
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

                        return (
                            <input
                                readOnly={grid[i][j].state === "preset"}
                                onChange={(e:any) => inputChange(e,i,j)}
                                onClick={(e:any) => highlightNumbers(e,i,j)}
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

            <div className="mainContainer">
            <button onClick={check}>Check!</button> 
            
                <button onClick={addTime}>set Time</button> 
            <input className="timeInput" type="timer" value={time} onChange={(e: any) => setTime(e.target.value)}></input>
            
            <button onClick={() => window.location.href = "/profile"}>profile</button>
            </div>
            </div>
        )}
        

            
            
        </div>
    );
};

export default App;
