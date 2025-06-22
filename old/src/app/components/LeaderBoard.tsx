import React from "react";
import { useEffect } from "react";
import { useState } from "react";

interface ILeaderBoard{
    name: string;
    time: number;
}

export default function LeaderBoard() {
    const [board, setBoard] = useState<ILeaderBoard[]>([]);
    
    async function fetchData(){
        const response = await fetch("http://localhost:5555/leaderboard");
        const data = await response.json();
        setBoard(data);
    }

    useEffect(() => {
        fetchData();
    },[])


    return (
        <div>
            <h1>LeaderBoard</h1>
            {board.map((item) => (
                <div>
                    <p>{item.name} - {item.time}</p>
                </div>
            ))}


        </div>
    );
}
