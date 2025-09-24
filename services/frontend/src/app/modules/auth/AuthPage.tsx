import { Route, Routes } from "react-router-dom"
import { Login } from "./components/Login"

const AuthPage = () => (
    <Routes>
        <Route path="login" element={<Login />} />
        <Route index element={<Login />} />
    </Routes>
)

export { AuthPage }