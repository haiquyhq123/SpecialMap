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

    const onSubmit = async (data) => {
        try {
            const response = await fetch(`http://10.144.112.60:3000/api/user?email=${data.email}&password=${data.password}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const userData = await response.json();
            console.log(userData);
            console.log(JSON.stringify(userData));
            if (userData && userData.status === "success") {
                console.log('Login successful');
                setRedirect(true);
            } else {
                console.log('Invalid email or password');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            // Fallback to local storage verification
            const localUserData = JSON.parse(localStorage.getItem(data.email));
            if (localUserData && localUserData.password === data.password) {
                console.log('Login successful (local storage)');
                setRedirect(true);
            } else {
                console.log('Invalid email or password');
            }
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
                <input type="submit" style={{ backgroundColor: "#a1eafb" }} />
            </form>
            <a href="./register">Not have account yet?</a>
        </div>
    );
}

export default Login;