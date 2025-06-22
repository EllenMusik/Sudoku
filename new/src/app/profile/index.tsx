import React, { useNavigate } from "react";
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

    const [isLogged, setIsLogged] = React.useStatic("login", false);

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
        const navigate = useNavigate();

        localStorage.removeItem("token");
        localStorage.removeItem("uname");
        setTimeout(() => {
            setIsLogged(false);
            navigate("/");
        }, 0)

    }

    useEffect(() => {
        getProfile();
    }, []);

    return (
        <div className="profile">
            <h1>Welcome {localStorage.getItem("uname") || ""}</h1>
            <button onClick={ft_logout} >logout</button>
        </div>
    );
}

export default App;