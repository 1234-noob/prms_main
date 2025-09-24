import { createContext, Dispatch, FC, SetStateAction, useContext, useState } from "react"
import { AuthModel, UserModel } from "./_model"
import * as authHelper from "./AuthHelpers"
import { WithChildren } from "../../../../_nilesh/helper/react18MigrationHelper"

type AuthContextProps = {
    auth: AuthModel | undefined
    saveAuth: (auth: AuthModel | undefined) => void
    currentUser: UserModel | undefined
    setCurrentUser: Dispatch<SetStateAction<UserModel | undefined>>
    logout: () => void
}

const initAuthContextPropsState = {
    auth: authHelper.getAuth(),
    saveAuth: () => { },
    currentUser: undefined,
    setCurrentUser: () => { },
    logout: () => { },
}


const AuthContext = createContext<AuthContextProps>(initAuthContextPropsState);
const useAuth = () => {
    return useContext(AuthContext)
}

const AuthProvider: FC<WithChildren> = ({ children }) => {
    const [auth, setAuth] = useState<AuthModel | undefined>(authHelper.getAuth())
    const [currentUser, setCurrentUser] = useState<UserModel | undefined>()
    const saveAuth = (auth: AuthModel | undefined) => {
        // console.log(auth);
        
        setAuth(auth)
        if (auth) {
            authHelper.setAuth(auth)
        } else {
            authHelper.removeAuth()
        }
    }

    const logout = () => {
        saveAuth(undefined)
        setCurrentUser(undefined)
    }

    return (
        <AuthContext.Provider value={{ auth, saveAuth, currentUser, setCurrentUser, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthProvider, useAuth }