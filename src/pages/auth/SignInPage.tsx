import {User} from "../../model/user/User";
import {useState} from "react";
import {SignInRequest} from "../../model/user/auth/SignInRequest";
import {NavigateOnLogin} from "../../utils/auth/NavigateOnLogin";
import {AuthController} from "../../controllers/AuthController";
import {ErrorResponse} from "../../controllers/BaseController";
import {Form} from "react-router-dom";
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement
} from "@chakra-ui/react";
import {UserController} from "../../controllers/UserController";

export function SignInPage(props: { currentUser: User | undefined; setCurrentUser: (newPersonData: User) => void; }) {
    let [error, setError] = useState(false)
    let navigate = NavigateOnLogin(props.currentUser)

    // Эта часть для кнопки типа показать пароль
    // могу показать как у меня было но у меня была другая версия чакры
    let [show, setShow] = useState(false)
    let handleClick = () => setShow(!show)

    async function handleForm(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        let signInRequest = new SignInRequest(
            (event.currentTarget.elements.namedItem("login") as HTMLInputElement).value,
            (event.currentTarget.elements.namedItem("password") as HTMLInputElement).value
        )

        let response = await new AuthController().signIn(signInRequest)
        if (response instanceof ErrorResponse) {
            setError(true);
        } else {
            //console.log(response.userId)
            let user = await new UserController().getUserById(response.id);
            if (user instanceof ErrorResponse) {
                setError(true);
            } else {
                user.userId = response.id;
                props.setCurrentUser(user);
                // localStorage.setItem("token", response.token)
                navigate('/');
            }
        }

    }

    return <div>
        <Box mt={4} px={6}>
            <Form onSubmit={handleForm}>
                <FormControl isRequired width={'30%'}>
                    <FormLabel>Введите ваш юзернейм: </FormLabel>
                    <Input type='text' name="login"/>
                </FormControl>
                <FormControl isRequired mt={4} width={'30%'}>
                    <FormLabel>Введите ваш пароль: </FormLabel>
                    <InputGroup size='md'>
                        <Input
                            pr='4.5rem'
                            type={show ? 'text' : 'password'}
                            name="password"
                        />
                        <InputRightElement width='4.5rem'>
                            <Button h='1.75rem' size='sm' onClick={handleClick}>
                                {show ? 'Hide' : 'Show'}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </FormControl>
                <Button colorScheme="pink" type={"submit"} mt={4}>Войти</Button>
                {error ? <div className="errorMessage">
                    Неправильное имя пользователя или пароль!!
                </div> : ""}
            </Form>
        </Box>
    </div>
}