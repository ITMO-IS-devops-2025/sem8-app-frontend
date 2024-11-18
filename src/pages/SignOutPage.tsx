import {User} from "../model/user/User";
import {NavigateOnLogout} from "../utils/auth/NavigateOnLogin";
import {AuthController} from "../controllers/AuthController";

export function SignOutPage(props: { currentUser: User | undefined; setCurrentUser: (newPersonData: undefined) => void; }) {
    let navigate = NavigateOnLogout(props.currentUser)
    const clickHandler = async (_: React.MouseEvent<HTMLButtonElement>) => {
        await new AuthController().signOut()
        props.setCurrentUser(undefined);
        // localStorage.removeItem("token")
        navigate('/')
    }

    return <div>
        <button onClick={clickHandler}>Выйти реально??</button>
    </div>
}