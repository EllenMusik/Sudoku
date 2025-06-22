import React, { useNavigate, useStatic } from "react";
import { useEffect } from "react";
import "./login.css"

const App = () => {
    const navigate = useNavigate();
    const [isLogged, setIsLogged] = useStatic("login", false);

    async function login(e: any) {
        e.preventDefault();

        const name = e.target.uname.value;
        const password = e.target.pass.value;
        try {
            const response = await fetch("http://localhost:5555/login", {
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

            if (data.token) {
                /* Store the token in localStorage */
                localStorage.setItem("token", data.token);
                localStorage.setItem("uname", name);
                console.log("Token stored successfully");
                // window.location.href = "/profile";
                setIsLogged(true);
                navigate("/profile");
                return ;
            } 
            else {
                console.log("Login failed");
            }
            console.log(data);
        }
        catch (error) {
            console.error("Error during login:", error);
        }
    }


    return (
        <div className="container">
            <h1>Login</h1>

            <form onSubmit={(e:any) => login(e)}>
                <input className="loginput" type="text" id="uname" placeholder="name" /> 
                <input className="loginput" type="password" id="pass" placeholder="password" /> 
                <button type="submit">login</button>
            </form>

        </div>
    );
};

export default App;