import React, { useEffect, useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal()
{
    const dispatch = useDispatch();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [canLogIn, setCanLogIn] = useState(false);
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    const handleSubmit = (e) =>
    {
        e.preventDefault();
        setErrors({});
        return dispatch(sessionActions.login({ credential, password }))
            .then(closeModal)
            .catch(async (res) =>
            {
                const data = await res.json();
                if (data && data.errors)
                {
                    setErrors(data.errors);
                }
            });
    };

    useEffect(() =>
    {
        if (credential.length < 4 || password.length < 6)
        {
            setCanLogIn(false);
        } else
        {
            setCanLogIn(true);
        }
    }, [credential, password])

    function LoginDemoUser()
    {
        const demoUserInfo = {
            credential: 'Demo-lition',
            password: 'password'
        }

        return dispatch(sessionActions.login(demoUserInfo))
            .then(closeModal);
    }

    return (
        <>
            <h1>Log In</h1>

            <div className='login-form-demo'>
                <button type="button" onClick={LoginDemoUser}>Log in as Demo User</button>
            </div>

            <form onSubmit={handleSubmit}>
                {errors.message &&
                    (
                        <p>{errors.message}</p>
                    )
                }
                <label>
                    Username or Email
                    <input
                        type="text"
                        value={credential}
                        onChange={(e) => setCredential(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                {errors.credential && (
                    <p>{errors.credential}</p>
                )}
                <button
                    disabled={!canLogIn}
                    type="submit"
                    className={canLogIn ? 'login-form-button-active' : 'login-form-button-inactive'}>
                    Log In
                </button>

            </form>
        </>
    );
}

export default LoginFormModal;
