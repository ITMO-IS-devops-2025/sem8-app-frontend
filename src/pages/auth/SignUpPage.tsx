import {User} from "../../model/user/User";
import {useState} from "react";
import {NavigateOnLogin} from "../../utils/auth/NavigateOnLogin";
import {SignUpRequest} from "../../model/user/auth/SignUpRequest";
import {AuthController} from "../../controllers/AuthController";
import {ErrorResponse} from "../../controllers/BaseController";
import {Form} from "react-router-dom";
import {Box, Button, FormControl, FormLabel, Input, InputGroup, InputRightElement} from "@chakra-ui/react";

export function SignUpPage(props: { currentUser: User | undefined; setCurrentUser: (newPersonData: User) => void; }) {
    let [error, setError] = useState<string | null>(null);
    let [passwordMismatch, setPasswordMismatch] = useState(false);
    let navigate = NavigateOnLogin(props.currentUser);
    let [show, setShow] = useState(false);
    let handleClick = () => setShow(!show);

    async function handleForm(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const name = (event.currentTarget.elements.namedItem("name") as HTMLInputElement).value;
        const login = (event.currentTarget.elements.namedItem("login") as HTMLInputElement).value;
        const password = (event.currentTarget.elements.namedItem("password") as HTMLInputElement).value;
        const confirmPassword = (event.currentTarget.elements.namedItem("confirmPassword") as HTMLInputElement).value;

        if (password !== confirmPassword) {
            setPasswordMismatch(true);
            return;
        } else {
            setPasswordMismatch(false);
        }

        let signUpRequest = new SignUpRequest(name, login, password);

        let response = await new AuthController().signUp(signUpRequest);
        if (response instanceof ErrorResponse) {
            console.log(response.text);
            if(response.code == 400) {
                setError("Пароль слишком слабый! Пароль должен содержать не менее 6 символов, строчные и заглавные буквы, один спец символ -_@+");
            }
            if(response.code == 409) {
                setError("Пользователь с таким юзернеймом уже существует! Попробуйте другой юзернейм.");
            }
        } else {
            setError(null);
            navigate('/signIn');
        }
    }

    return <div className="form">
        <Box mt={4} className="page">
            <Form onSubmit={handleForm} className="auth-form">
                <FormControl isRequired>
                    <FormLabel>Введите ваше имя:</FormLabel>
                    <Input type='text' name="name"/>
                </FormControl>
                <FormControl isRequired mt={4}>
                    <FormLabel>Введите ваш юзернейм:</FormLabel>
                    <Input type='text' name="login"/>
                </FormControl>
                <FormControl isRequired mt={4}>
                    <FormLabel>Введите ваш пароль:</FormLabel>
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
                <FormControl isRequired mt={4}>
                    <FormLabel>Повторите ваш пароль:</FormLabel>
                    <InputGroup size='md'>
                        <Input
                            pr='4.5rem'
                            type={show ? 'text' : 'password'}
                            name="confirmPassword"
                        />
                        <InputRightElement width='4.5rem'>
                            <Button h='1.75rem' size='sm' onClick={handleClick}>
                                {show ? 'Hide' : 'Show'}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </FormControl>
                {passwordMismatch && <div className="errorMessage" style={{color: "red"}}>
                    Пароли не совпадают! Попробуйте снова.
                </div>}
                {error && <div className="errorMessage" style={{color: "red"}}>
                    {error}
                </div>}
                <Button colorScheme="pink" type="submit" mt={4}>Зарегистрироваться</Button>
            </Form>
        </Box>
    </div>
}