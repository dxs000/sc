import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import RouteFallback from "../components/ui/RouteFallback";
import type { RootState } from "../store/store";
import type { JSX } from "react";

interface Props{
    children: JSX.Element;
}

const PublicRoute = ({children}:Props) => {
    const {isAuthenticated, loading} = useSelector(
        (state: RootState) => state.auth
    );

    if(loading) {
        return <RouteFallback />
    }

    if(isAuthenticated) {
        return <Navigate to="/" replace/>
    }

    return children
};

export default PublicRoute
