import React, { useState, useStatic, useNavigate } from 'react';


const App = () => {

    const navigate = useNavigate();
    const [login, setLogin] = useStatic("login", false);

    return (
        <div className="">
            {login && <button onClick={() => navigate("../profile")}>Profile</button>}
            {login && <button onClick={() => navigate("../game")}>Game</button>}
            {!login && <button onClick={() => navigate("../login")}>Login</button>}
        </div>
    );
};

export default App;