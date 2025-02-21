import PropTypes from "prop-types";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Register({ setAuth }) {
    const [inputs, setInputs] = useState({
        email: "",
        password: "",
        firstName: ""
    })

    function handleChange(e) {
        setInputs({ ...inputs, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault()

        try {

            const body = { email: inputs.email, password: inputs.password, name: inputs.firstName }

            const response = await fetch('http://localhost:5000/auth/register', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            const data = await response.json()

            if (data.token) {
                localStorage.setItem("token", data.token)
                setAuth(true)
            } else {
                console.log(data);
                toast.error(data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
                <h1 className="mb-6 text-center text-2xl font-bold text-gray-700">Register</h1>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input
                        onChange={(e) => handleChange(e)}
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring"
                        value={inputs.email}
                    />
                    <input
                        onChange={(e) => handleChange(e)}
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring"
                        value={inputs.password}
                    />
                    <input
                        onChange={(e) => handleChange(e)}
                        type="text"
                        name="firstName"
                        placeholder="Your Name"
                        className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring"
                        value={inputs.firstName}
                    />
                    <button
                        type="submit"
                        className="w-full rounded-lg bg-blue-600 p-3 text-white hover:bg-blue-700"
                    >
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    )
}

Register.propTypes = {
    setAuth: PropTypes.func.isRequired,
};