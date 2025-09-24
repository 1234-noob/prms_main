import { FC } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../modules/auth/core/Auth";
import { AuthPage } from "../modules/auth/AuthPage";
import { PrivateRoutes } from "./PrivateRoutes";

const { PUBLIC_URL } = { PUBLIC_URL: "" };//.env;

const AppRoutes: FC = () => {

    const { currentUser } = useAuth();
    // console.log(currentUser);

    return (
        <BrowserRouter basename={PUBLIC_URL}>
            <Routes>
                <Route path='error/*' element={<h1>Error</h1>} />

                {currentUser ? (<>
                    <Route path="*" element={<PrivateRoutes />} />
                    <Route index element={<Navigate to='/dashboard' />} />
                </>) : (<>

                    <Route path='auth/*' element={<AuthPage />} />
                    <Route path='*' element={
                        <Navigate to='/auth' />
                    }
                    />
                </>)}
            </Routes>
        </BrowserRouter>
    )
}

export { AppRoutes }