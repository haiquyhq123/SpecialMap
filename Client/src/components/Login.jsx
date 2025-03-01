import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";


function Login() {
    const [redirect, setRedirect] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = (data) => {
        const userData = JSON.parse(localStorage.getItem(data.email));
        if (userData) { // getItem can return actual value or null
            if (userData.password === data.password) {
                console.log('Login successful');
                setRedirect(true);
            } else {
                console.log('Invalid email or password');
            }
        } else {
            console.log('Invalid email or password');
        }
    };

    if (redirect) {
        return <Navigate to="/main" />;
    }

    return (
        <div className="Login-Form">
            <p className="title">Login Form</p>
            <form className="Login-Form" onSubmit={handleSubmit(onSubmit)}>
                <label>Email:</label>
                <input type="email" {...register("email", { required: true })} />
                {errors.email && <span style={{ color: "red" }}>*Email* is mandatory</span>}
                <label>Password:</label>
                <input type="password" {...register("password", { required: true })} />
                {errors.password && <span style={{ color: "red" }}>*Password* is mandatory</span>}
                <input type={"submit"} style={{ backgroundColor: "#a1eafb" }} />
            </form>
            <a href="./register">Not have account yet?</a>
        </div>
    );
}

export default Login;