import React, {useEffect, useState} from "react";
import {Button, TextField} from "@mui/material";

const Register: React.FC<{setUsernameGlobal: (usernameGlobal: string)=>void}> = ({ setUsernameGlobal}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [registering, setRegistering] = useState(false);

    useEffect(() => {
        if (registering) {
            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username: username, password: password})
            };
            fetch('http://localhost:8080/signUp', requestOptions)
                .then(response => response.json())
                .then(
                    (result) => {
                        if(result){
                            setUsernameGlobal(username);
                            setRegistering(false);
                        }
                        else{
                            setUsernameError(true);
                            setPasswordError(true);
                            setRegistering(false);
                        }

                    },
                    () => {
                        setUsernameError(true);
                        setPasswordError(true);
                        setRegistering(false);
                    }
                );
        }
    }, [registering, password, setUsernameGlobal, username])

    const handleSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        setUsernameError(false);
        setPasswordError(false);

        if (username === '') {
            setUsernameError(true);
        }
        if (password === '') {
            setPasswordError(true);
        }

        if (username && password) {
            setRegistering(true);
        }
    }

    return (
        <React.Fragment>
            <form autoComplete="off" onSubmit={handleSubmit}>
                <h2>Register Form</h2>
                <TextField
                    label="Username"
                    onChange={e => setUsername(e.target.value)}
                    required
                    variant="outlined"
                    color="secondary"
                    type="text"
                    sx={{mb: 3}}
                    fullWidth
                    value={username}
                    error={usernameError}
                />
                <TextField
                    label="Password"
                    onChange={e => setPassword(e.target.value)}
                    required
                    variant="outlined"
                    color="secondary"
                    type="password"
                    value={password}
                    error={passwordError}
                    fullWidth
                    sx={{mb: 3}}
                />
                <Button variant="outlined" color="secondary" type="submit">Register</Button>

            </form>
        </React.Fragment>
    );
}

export default Register;