import React, {useEffect, useState} from "react";
import {User} from "../../model/user/User";
import {Heading, Button, List, ListItem, Box, HStack, Tag, TagLabel, TagCloseButton} from "@chakra-ui/react";
import {HabitController} from "../../controllers/HabitController";
import {Link, useNavigate} from "react-router-dom";
import {Habit} from "../../model/habit/Habit";
import {UserController} from "../../controllers/UserController";

export function MainPage(props: { currentUser: User | undefined }) {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    async function fetchHabits() {
        try {
            const response = await new UserController().getHabits();
            if (response instanceof Error) {
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

    useEffect(() => {
        if (props.currentUser) {
            fetchHabits();
        }
    }, [props.currentUser]);


    if (props.currentUser === undefined) {
        return (
            <div>
                <Heading>Регистрируйся и присоединяйся к панпипе!</Heading>
            </div>
        );
    }

    return (
        <Box mt={4} px={6}>
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
                                    <Link to={`/group/${habit.id.toString()}`}>
                                        <Box mt={1}>
                                            <div>Периодичность: {habit.periodicity.value} {habit.periodicity.type}</div>
                                            <div>Цель: {habit.goal}</div>
                                            <div>Тип результата: {habit.resultType}</div>
                                        </Box>
                                    </Link>
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
