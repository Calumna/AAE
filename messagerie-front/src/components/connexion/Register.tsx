import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {Button, TextField} from "@mui/material";
import {MessageData} from "../../types";

const Register: React.FC<{setUsernameGlobal: (usernameGlobal: string)=>void}> = ({ setUsernameGlobal}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const handleSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        setUsernameError(false);
        setPasswordError(false);

        if (username == '') {
            setUsernameError(true);
        }
        if (password == '') {
            setPasswordError(true);
        }

        if (username && password) {
            setUsernameGlobal(username);
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