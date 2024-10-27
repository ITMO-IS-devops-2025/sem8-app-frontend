import {User} from "../model/user/User";
import {Heading} from "@chakra-ui/react";

export function MainPage(props: {currentUser: User | undefined}) {
    if (props.currentUser == undefined) {
        return <div>
            <div>
                <Heading>Регистрируйся и присоединяйся к панпипе!</Heading>
            </div>
        </div>
    }

    return <div>
        <div>
            <Heading>the egyptian believed the most significant thing u could do in your life was dying</Heading>
        </div>
    </div>
}