import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    if(auth === undefined){
        const infor = JSON.parse(localStorage.getItem('userinfo')|| '{}');
        setAuth(infor)
    }
    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;