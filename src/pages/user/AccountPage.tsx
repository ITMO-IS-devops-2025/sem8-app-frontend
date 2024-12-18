import React, {useEffect, useState} from "react";
import {User} from "../../model/user/User";
import {
    Heading,
    Button,
    Box,
    Text,
    FormLabel,
    Input,
    FormControl,
    InputRightElement,
    InputGroup
} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import {UserController} from "../../controllers/UserController";
import {ErrorResponse} from "../../controllers/BaseController";
import {useToast} from "@chakra-ui/icons";

export function AccountPage(props: { currentUser: User | undefined; setCurrentUser: (newPersonData: User) => void; }) {
    const [error, setError] = useState(false);
    let navigate = useNavigate();
    const [newName, setNewName] = useState<string>();
    const [prevPassword, setPrevPassword] = useState<string>();
    const [newPassword, setNewPassword] = useState<string>();
    const [passwordError, setPasswordError] = useState<string>()
    const toast = useToast();
    let [show, setShow] = useState(false)
    let handleClick = () => setShow(!show)

    async function handleNameChange() {
        if (!newName) {
            setError(true);
            return;
        }

        try {
            const response = await new UserController().changeUserName(newName);
            if (response instanceof ErrorResponse) {
                setError(true);
            } else {
                if (props.currentUser) {
                    props.currentUser.name = newName;
                }
                setNewName("");
            }
        } catch (err) {
            setError(true);
        }
    }

    async function handlePasswordChange() {
        if (!prevPassword || !newPassword) {
            setPasswordError("Пароль не должен быть пустым")
            return;
        }
        try {
            const response = await new UserController().changeUserPassword(prevPassword, newPassword);
            if (response instanceof ErrorResponse) {
                if (response.code === 401) {
                    setPasswordError("Неправильный пароль!")
                } else {
                    setPasswordError("Пароль слишком слабый! Пароль должен содержать не менее 6 символов, строчные и заглавные буквы, один спец символ -_@+")
                }
                setError(true);
            } else {
                toast({
                    title: "Пароль успешно изменен.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                setPrevPassword("");
                setNewPassword("");
                setPasswordError("")
            }
        } catch (err) {
            setError(true);
        }
    }

    async function fetchCurrentUser() {
        try {
            const response = await new UserController().getCurrentUser();
            if (response instanceof ErrorResponse) {
                console.log(response)
                if (response.code == 401) {
                    navigate('/signIn')
                }
            } else  {
                console.log("Запрашиваем пользвователя", response)
                // @ts-ignore
                props.setCurrentUser(response)
            }
        } catch (err) {
            if (props.currentUser === undefined) navigate('/signIn')
        }
    }
    useEffect(() => {
        if (props.currentUser === undefined) {
            fetchCurrentUser()
        }
    }, [props.currentUser]);

    return (
        <Box mt={4} className="page">
            <div className="page-box">
                <Heading>{props.currentUser?.name}</Heading>
                <div>
                    <Heading size="md" mt={4}>
                        Поменять имя
                    </Heading>
                    <FormControl mb={4}>
                        <FormLabel>Новое имя</FormLabel>
                        <Input
                            placeholder="Введите новое имя"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                    </FormControl>
                    <Button colorScheme="teal" onClick={handleNameChange}>
                        Сохранить
                    </Button>
                </div>
                <div>
                    <Heading size="md" mt={8}>
                        Поменять пароль
                    </Heading>
                    <FormControl mb={4}>
                        <FormLabel>Старый пароль</FormLabel>
                        <InputGroup size='md'>
                            <Input
                                placeholder="Введите старый пароль"
                                value={prevPassword}
                                type={show ? 'text' : 'password'}
                                onChange={(e) => setPrevPassword(e.target.value)}
                            />
                            <InputRightElement width='4.5rem'>
                                <Button h='1.75rem' size='sm' onClick={handleClick}>
                                    {show ? 'Hide' : 'Show'}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>
                    <FormControl mb={4}>
                        <FormLabel>Новый пароль</FormLabel>
                        <InputGroup size='md'>
                            <Input
                                placeholder="Введите новый пароль"
                                value={newPassword}
                                type={show ? 'text' : 'password'}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <InputRightElement width='4.5rem'>
                                <Button h='1.75rem' size='sm' onClick={handleClick}>
                                    {show ? 'Hide' : 'Show'}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>
                    <Text color="red.500"> {passwordError} </Text>
                    <Button colorScheme="teal" onClick={handlePasswordChange}>
                        Сохранить
                    </Button>
                </div>
            </div>
        </Box>
    );
}