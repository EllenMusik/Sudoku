import React from "react";
import { useEffect } from "react";
import "./register.css"

const App = () => {

    async function register(e: any) {
        e.preventDefault();

        const name = e.target.uname.value;
        const password = e.target.pass.value;
        const password2 = e.target.pass2.value;

        if (password !== password2) {
            console
            alert("Passwords do not match");
            return;
        }

        const response = await fetch("http://localhost:5555/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                uname: name,
                password: password
            })
        });

        const data = await response.json();
        if (data.message === "registration sucessfull"){
            alert("Registration successful");
            window.location.href = "/login";
        }
        console.log(data);
    }


    return (
        <div className="container">
            <h1>Register</h1>

            <form onSubmit={(e:any) => register(e)}>
                <input className="loginput" type="text" id="uname" placeholder="name" />
                <input className="loginput" type="password" id="pass" placeholder="choose password" />
                <input className="loginput" type="password" id="pass2" placeholder="repeat password" />                
                <button type="submit">Register</button>
            </form>

        </div>
    );
};

export default App;