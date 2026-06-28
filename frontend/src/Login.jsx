import { useState } from "react";

function Login({ setIsLoggedIn }) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const handleLogin = async () => {

    const response = await fetch(
        "http://localhost:5000/login",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
            }),
        }
    );
    console.log("Sending:", {
  username,
  password,
});

    const data = await response.json();
    console.log(data);

    if (data.success) {

    alert("Login Successful ✅");

    setIsLoggedIn(true);

} else {

        alert("Invalid Username or Password ❌");

    }

};

    return (

        <div
            style={{
                width: "350px",
                margin: "100px auto",
                textAlign: "center",
            }}
        >

            <h1>🔐 Admin Login</h1>

            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) =>
                    setUsername(e.target.value)
                }
                style={{
                    width: "100%",
                    padding: "10px",
                    marginBottom: "15px",
                }}
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) =>
                    setPassword(e.target.value)
                }
                style={{
                    width: "100%",
                    padding: "10px",
                    marginBottom: "20px",
                }}
            />

            <button onClick={handleLogin}>

    Login

</button>

        </div>

    );

}

export default Login;