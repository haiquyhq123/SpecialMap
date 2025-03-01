import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import "./RegisterFeature";

function LoginFeature() {
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
                console.log(userData.name + " You Are Successfully Logged In");
                setRedirect(true);
            } else {
                console.log("Email or Password is not matching with our record");
            }
        } else {
            console.log("Email or Password is not matching with our record");
        }
    };

    if (redirect) {
        return <Navigate to="/main" />;
    }

    return (
        <div className="Form-Login">
            <p className="title">Login Form</p>
            <form className="App" onSubmit={handleSubmit(onSubmit)}>
                <input type="email" {...register("email", { required: true })} />
                {errors.email && <span style={{ color: "red" }}>
                    *Email* is mandatory </span>}
                <input type="password" {...register("password", { required: true })} />
                {errors.password && <span style={{ color: "red" }}>*Password* is mandatory</span>}
                <input type={"submit"} style={{ backgroundColor: "#a1eafb" }} />
            </form>
            <a href="./register">Not have account yet?</a>
        </div>
    );
}

export default LoginFeature;