import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";


const RequireAuth = ({allowedRoles}) =>{
    const {auth ,setAuth} = useAuth();
    if(auth === undefined){
        const infor = JSON.parse(localStorage.getItem('userinfo')|| '{}');
        setAuth(infor)
    }
    const location = useLocation();
        return (
            auth?.roles?.find(role=> allowedRoles?.includes(role))
            ?<Outlet/> :
            auth?.user?<Navigate to='/unauthorized' state={{from:location}} replace/>:
            <Navigate to="/login" state={{from:location}} replace/>
        )
}

export default RequireAuth;