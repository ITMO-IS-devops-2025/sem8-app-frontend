import {User} from "../../model/user/User";
import {useState} from "react";
import {NavigateOnLogin} from "../../utils/auth/NavigateOnLogin";
import {SignUpRequest} from "../../model/user/auth/SignUpRequest";
import {AuthController} from "../../controllers/AuthController";
import {ErrorResponse} from "../../controllers/BaseController";
import {Form} from "react-router-dom";
import {Box, Button, FormControl, FormLabel, Input} from "@chakra-ui/react";

export function SignUpPage(props: { currentUser: User | undefined; setCurrentUser: (newPersonData: User) => void; }) {
    let [error, setError] = useState(false)
    let navigate = NavigateOnLogin(props.currentUser)

    async function handleForm(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        let signUpRequest = new SignUpRequest((event.currentTarget.elements.namedItem("name") as HTMLInputElement).value,
            (event.currentTarget.elements.namedItem("login") as HTMLInputElement).value,
            (event.currentTarget.elements.namedItem("password") as HTMLInputElement).value)

        let response = await new AuthController().signUp(signUpRequest)
        if (response instanceof ErrorResponse) {
            console.log(response.text)
            setError(true)
        } else {
            navigate('/signIn')
        }
    }

    return <div className="form">
        <Box mt={4} px={6}>
            <Form onSubmit={handleForm}>
                <FormControl isRequired width={'30%'}>
                    <FormLabel>Введите ваше имя: </FormLabel>
                    <Input type='text' name="name"/>
                </FormControl>
                <FormControl isRequired mt={4} width={'30%'}>
                    <FormLabel>Введите ваш юзернейм: </FormLabel>
                    <Input type='text' name="login"/>
                </FormControl>
                <FormControl isRequired mt={4} width={'30%'}>
                    <FormLabel>Введите ваш пароль: </FormLabel>
                    <Input type='text' name="password"/>
                </FormControl>
                <Button colorScheme="pink" type={"submit"} mt={4}>Зарегистрироваться</Button>
                {error ? <div className="errorMessage">
                    Пользователь с таким юзернеймом уже есть! извините!!
                </div> : ""}
            </Form>
        </Box>
    </div>
}