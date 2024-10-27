import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {User} from "../../model/user/User";

export function NavigateOnLogin(currentUser: User | undefined) {
    let navigate = useNavigate()
    useEffect(() => {
        if (currentUser !== undefined) navigate('/');
    });
    return navigate
}

export function NavigateOnLogout(currentUser: User | undefined) {
    let navigate = useNavigate()
    useEffect(() => {
        if (currentUser === undefined) navigate('/signIn');
    });
    return navigate
}