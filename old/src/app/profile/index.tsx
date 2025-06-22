import React from "react";
import { useEffect } from "react";
import "./profile.css"

interface User {
    uname: string;
    password: string;
    easy: number[];
    medium: number[];
    hard: number[];
    expert: number[];
    testing: number[];
}


const App = () => {
    // user specific profile site
    const [easy, setEasy] = React.useState<number[]>([]);
    const [medium, setMedium] = React.useState<number[]>([]);
    const [hard, setHard] = React.useState<number[]>([]);
    const [expert, setExpert] = React.useState<number[]>([]);
    const [testing, setTesting] = React.useState<number[]>([]);

    async function getProfile() {
        const response = await fetch(`http://localhost:5555/profile?uname=${localStorage.getItem("uname")}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token") || ""
            }
        });

        const data = await response.json();
        if (response.status === 401) {
            window.location.href = "/";
        }
        const user: User = data.user;
        setEasy(user.easy);
        setMedium(user.medium);
        setHard(user.hard);
        setExpert(user.expert);
        setTesting(user.testing);
        console.log("hey!", data);
    }

    const ft_logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("uname");
        window.location.href = "/";
    }

    useEffect(() => {
        getProfile();
    }, []);

    return (
        <div className="profile">
        <div>
            <h1>Welcome {localStorage.getItem("uname") || ""}</h1>
            <button onClick={ft_logout} >logout</button>
            <button onClick={() => window.location.href = "/" }>Home</button>
        
            <h2>Scores</h2>
                <div className="score">
                    <h3>Easy</h3>
                    <div>
                        {easy.map((item) => (
                            <div>
                                <p>{item}</p>
                            </div>
                        ))}
                    </div>
                    <h3>Medium</h3>
                    <div>
                        {medium.map((item) => (
                            <div>
                                <p>{item}</p>
                            </div>
                        ))}
                    </div>
                    <h3>Hard</h3>
                    <div>
                        {hard.map((item) => (
                            <div>
                                <p>{item}</p>
                            </div>
                        ))}
                    </div>
                    <h3>Expert</h3>
                    <div>
                        {expert.map((item) => (
                            <div>
                                <p>{item}</p>
                            </div>
                        ))}
                    </div>
                    <h3>Testing</h3>
                    <div>
                        {testing.map((item) => (
                            <div>
                                <p>{item}</p>
                            </div>
                        ))}
                    </div>
                </div>
        </div>
        </div>
    );
}

export default App;