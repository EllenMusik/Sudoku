import React, { BrowserRouter, Router, useStatic, useEffect, useNavigate } from "react";
import Home from "./home/page";
import "./global.css";
import Profile from "./profile/index";
import Game from "./game/index";
import Login from "./login/index";
import NotFound from "./404";


async function authenticateLogin(){
    const token = localStorage.getItem("token") || undefined;

    const [login, setLogin] = useStatic("login", false);

    const response = await fetch("http://localhost:5555/authenticate", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
            //"Authorization": "Bearer " + localStorage.getItem("token") || ""
        }
    });
    const data = await response.json();

    const auth: boolean = data.login || false;
    setLogin(auth);
}

export default function Root() {
    const navigate = useNavigate();

    useEffect(() => {
        authenticateLogin();
    }, []);

    return (
        <div className="p-4">
            <div className="navbar">
                <button className="homeButton" onClick={() => navigate("/")}>Sudoku</button>
            </div>
            <div className="container">
                <BrowserRouter>
                    <Router src="/" component={<Home />} />
                    <Router src="/profile" component={<Profile />} />
                    <Router src="/game" component={<Game />} />
                    <Router src="/login" component={<Login />} />
                    <Router src="/404" component={<NotFound />} default />
                </BrowserRouter>
            </div>
        </div>
    );
}
