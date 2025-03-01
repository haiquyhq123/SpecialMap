import React from "react";
import { useForm } from "react-hook-form";

function Register() {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        if (data.password !== data.retypePassword) {
            console.log("Passwords do not match");
            return;
        }

        // Save to local storage
        localStorage.setItem(data.email, JSON.stringify({ 
            name: data.name, 
            phone: data.phone, 
            password: data.password 
        }));
        console.log(JSON.parse(localStorage.getItem(data.email)));

        // Send data to backend
        try {
            const response = await fetch('http://10.144.112.60:3000/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    password: data.password
                })
            });

            if (!response.ok) {
                throw new Error('Failed to register');
            }

            const result = await response.json();
            console.log('Registration successful:', result);
        } catch (error) {
            console.error('Error registering user:', error);
        }
    };

    return (
        <div className="Register-Form">
            <p className="title">Registration Form</p>

            <form className="Register-Form" onSubmit={handleSubmit(onSubmit)}>
                <label>Name:</label>
                <input type="text" {...register("name", { required: true })} />
                {errors.name && <span style={{ color: "red" }}>*Name* is mandatory</span>}

                <label>Email:</label>
                <input type="email" {...register("email", { required: true })} />
                {errors.email && <span style={{ color: "red" }}>*Email* is mandatory</span>}

                <label>Phone:</label>
                <input type="tel" {...register("phone", { required: true })} />
                {errors.phone && <span style={{ color: "red" }}>*Phone* is mandatory</span>}

                <label>Password:</label>
                <input type="password" {...register("password", { required: true })} />
                {errors.password && <span style={{ color: "red" }}>*Password* is mandatory</span>}

                <label>Retype Password:</label>
                <input type="password" {...register("retypePassword", { required: true })} />
                {errors.retypePassword && <span style={{ color: "red" }}>*Retype Password* is mandatory</span>}

                <input type="submit" style={{ backgroundColor: "#a1eafb" }} />
            </form>
            <a href="/">Back To Log In</a>
        </div>
    );
}

export default Register;