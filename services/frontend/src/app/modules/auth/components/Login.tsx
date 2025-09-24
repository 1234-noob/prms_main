import { Link } from "react-router-dom";
import { GridShape } from "../../../../_nilesh/layout/component/common/GridShape";
// import Button from "../../../../_nilesh/layout/component/ui/Button";
import { Checkbox } from "../../../../_nilesh/layout/component/form/input/Checkbox";
import { Input } from "../../../../_nilesh/layout/component/form/input/InputField";
import { useState } from "react";
import { useAuth } from "../core/Auth";
import { FC } from "react";
import Button from "../../../../_nilesh/layout/component/ui/button/Button";

// Optional: Add a custom Label component import if you have one
// import { Label } from "./components/Label";

const backgroundStyle = {
    backgroundImage: 'linear-gradient(to right bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0) 50%), url("/images/background/building-bg.jpg")',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    backgroundAttachment: 'fixed',
};

const additionalStyles = {
    height: 'min-content',
    backdropFilter: 'blur(10px)',
};

const Login: FC = () => {
    const { saveAuth, setCurrentUser } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [email, setEmail] = useState<string>();
    const submitAuth = () => {
        if (email != undefined) {
            saveAuth({
                refresh_token: "string",
                access_token: "string",
                access_token_expiry: 2,
                token_type: {
                    value: "effe"
                },
                user_name: "string",
                merchant_id: 2
            }
            )

            setCurrentUser({
                id: 1,
                email: email,
                name:'Gera Imperium',
                phone: "+91 9664085446",
                role: "admin",
                profile_picture: "string"
            })
        }
    }
    return (
        <>
            <div className="relative flex w-full h-screen px-4 py-6 overflow-hidden bg-white z-1 dark:bg-gray-900 sm:p-0 ">
                <div className="flex flex-col flex-1 p-6 rounded-2xl sm:rounded-none sm:border-0 sm:p-8" style={backgroundStyle}>
                    <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                        <div className="p-5 rounded-4xl" style={additionalStyles}>
                            <div className="mb-5 sm:mb-8">
                                <p className="text-sm text-white/80">
                                    Enter your email and password to sign in!
                                </p>
                            </div>
                            <div>
                                <form>
                                    <div className="space-y-6">
                                        <div>
                                            {/* Use native HTML label */}
                                            <label className="block text-white text-sm font-semibold">
                                                Email <span className="text-error-500">*</span>
                                            </label>
                                            <Input login={true} value={email} onChange={(e) => {
                                                setEmail(e.target.value)

                                            }} placeholder="nilesh@dexpertsystem.com" />
                                        </div>
                                        <div>
                                            {/* Use native HTML label */}
                                            <label className="block text-white text-sm font-semibold">
                                                Password <span className="text-error-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    login={true}
                                                    placeholder="Enter your password"
                                                />
                                                <span
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                                >
                                                    {/* Optional: Add password visibility icons if needed */}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Checkbox checked={isChecked} onChange={setIsChecked} />
                                                <span className="block font-normal text-white/70 text-theme-sm dark:text-gray-400">
                                                    Keep me logged in
                                                </span>
                                            </div>
                                            <Link
                                                to="/"
                                                className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                                            >
                                                Forgot password?
                                            </Link>
                                        </div>
                                        <div>
                                            <Button className="w-full" size="sm"
                                                onClick={submitAuth}
                                            >
                                                Sign in
                                            </Button>
                                        </div>
                                    </div>
                                </form>

                                <div className="mt-5">
                                    <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                                        Don't have an account? {""}
                                        <Link
                                            to="/signup"
                                            className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                                        >
                                            Sign Up
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative items-center justify-center flex-1 hidden p-8 z-1 bg-brand-400 dark:bg-white/5 lg:flex">
                    <GridShape />
                    <div className="flex flex-col items-center max-w-xs">
                        <Link to="/" className="block mb-4">
                            <img src="https://dexpertsystems.in/assets/logo/web_icon.png" alt="Logo" />
                        </Link>
                        <p className="text-center text-white/90 dark:text-white/90">
                            
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export { Login };
