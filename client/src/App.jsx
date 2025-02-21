import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Notfound from "./components/Notfound";
import Register from "./components/Register";
import { ToastContainer } from 'react-toastify';



function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = (bool) => {
    setIsAuthenticated(bool)
  }


  useEffect(() => {
    const token = localStorage.getItem("token");
    const isAuth = async () => {
      try {
        const response = await fetch("http://localhost:5000/auth/is-verify", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        const data = await response.json()
        // setIsAuthenticated(data)
        data === true ? setIsAuthenticated(true) : setIsAuthenticated(false)
      } catch (err) {
        console.log(err)
      }
    }
    isAuth()
  }, [])

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Dashboard setAuth={setAuth} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" replace /> : <Login setAuth={setAuth} />}
          />
          <Route
            path="/register"
            element={!isAuthenticated ? <Register setAuth={setAuth} /> : <Navigate to="/login" replace />}
          />
          <Route path="*" element={<Notfound />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
}

export default App;
