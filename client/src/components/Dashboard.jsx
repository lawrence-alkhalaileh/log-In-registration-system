import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Dashboard({ setAuth }) {

    const [name, setName] = useState('')

    useEffect(() => {
        const token = localStorage.getItem("token");
        const getName = async () => {
            try {
                const response = await fetch("http://localhost:5000/dashboard", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })

                const data = await response.json()
                setName(data.user_name)
            } catch (err) {
                console.log(err)
            }
        }

        getName()
    }, [])

    const logOut = (e) => {
        e.preventDefault()
        localStorage.removeItem("token")
        setAuth(false)
        toast.warning("Logged out successfully!")
    }
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-4">Dashboard {name}</h1>
            <button
                className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
                onClick={(e) => logOut(e)}
            >
                Log Out
            </button>
        </div>
    )
}

Dashboard.propTypes = {
    setAuth: PropTypes.func.isRequired,
};
