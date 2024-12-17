import React, {useEffect, useState} from "react";
import {User} from "../../model/user/User";
import {Heading, Button, List, ListItem, Box, FormLabel, Input, FormControl, InputRightElement, InputGroup} from "@chakra-ui/react";
import {HabitController} from "../../controllers/HabitController";
import {Link, useNavigate} from "react-router-dom";
import {Habit} from "../../model/habit/Habit";
import {UserController} from "../../controllers/UserController";
import {ErrorResponse} from "../../controllers/BaseController";
import {useToast} from "@chakra-ui/icons";
import {NavigateOnLogout} from "../../utils/auth/NavigateOnLogin";

export function MainPage(props: { currentUser: User | undefined; setCurrentUser: (newPersonData: User) => void; }) {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const [newName, setNewName] = useState<string>();
    const [prevPassword, setPrevPassword] = useState<string>();
    const [newPassword, setNewPassword] = useState<string>();
    const toast = useToast();
    let [show, setShow] = useState(false)
    let handleClick = () => setShow(!show)

    async function fetchHabits() {
        try {
            const response = await new UserController().getHabits();
            if (response instanceof ErrorResponse) {
                setError(true);
            } else if ("habits" in response) {
                console.log("+", response)
                // @ts-ignore
                setHabits(response.habits);
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
        if (props.currentUser == undefined) {
            fetchCurrentUser()
        }
        if (props.currentUser) {
            fetchHabits();
        }
    }, [props.currentUser]);



    return (
        <Box mt={4} px={6} className="page">
            <div>
                <Heading as="h1" size="lg" mt={4}>
                    Список ваших привычек:
                </Heading>
                {error && <div>Произошла ошибка при загрузке привычек.</div>}

                {habits.length > 0 ? (
                    <div>
                        <List spacing={3} mt={4}>
                            {habits.map((habit) => (
                                <ListItem
                                    key={habit.id}
                                    p={2}
                                    bg="gray.50"
                                    borderRadius="md"
                                    cursor="pointer"
                                    onClick={() => navigate(`/user-habit/${habit.id}`)}
                                >
                                    <strong>{habit.name}</strong>
                                        <Box mt={1}>
                                            <div>Периодичность: {habit.periodicity.value} {habit.periodicity.type}</div>
                                            <div>Цель: {habit.goal}</div>
                                            <div>Тип результата: {habit.resultType}</div>
                                        </Box>
                                </ListItem>
                            ))}
                        </List>
                    </div>
                ) : (
                    <Box mt={1}>
                        <div>У вас нет привычек. Создайте одну!</div>
                    </Box>
                )}

                <Button colorScheme="teal" onClick={() => navigate("/user-habit-creation")} mt={4}>
                    Создать привычку
                </Button>

            </div>
        </Box>
    );
}
