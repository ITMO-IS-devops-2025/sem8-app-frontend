import React, { useEffect, useState } from "react";
import { User } from "../model/user/User";
import { Heading, Button, List, ListItem, Box } from "@chakra-ui/react";
import { HabitController } from "../controllers/HabitController";
import { useNavigate } from "react-router-dom";
import {Habit} from "@/model/habit/Habit";

export function MainPage(props: { currentUser: User | undefined }) {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    async function fetchHabits() {
        try {
            const response = await new HabitController().getHabits();
            if (response instanceof Error) {
                setError(true);
            } else if (Array.isArray(response.habits)){
                setHabits(response.habits);
            }
        } catch (err) {
            setError(true);
        }
    }

    useEffect(() => {
        //if (props.currentUser) {
            fetchHabits();
        //}
    }, [props.currentUser]);


    /*if (props.currentUser === undefined) {
        return (
            <div>
                <Heading>Регистрируйся и присоединяйся к панпипе!</Heading>
            </div>
        );
    }*/

    return (
        <div>
            <Heading>Добро пожаловать, {props.currentUser?.login}!</Heading>

            <Box mt={4}>
                <Button colorScheme="teal" onClick={() => navigate("/habit-creation")}>
                    Создать привычку
                </Button>
                <Button colorScheme="blue" onClick={() => navigate("/groups")} ml={4}>
                    Перейти в группы
                </Button>
            </Box>

            {error && <div>Произошла ошибка при загрузке привычек.</div>}

            {habits.length > 0 ? (
                <div>
                    <Heading size="md" mt={6}>Ваши привычки:</Heading>
                    <List spacing={3}>
                        {habits.map((habit) => (
                            <ListItem
                                key={habit.id}
                                p={2}
                                bg="gray.50"
                                borderRadius="md"
                                cursor="pointer"
                                onClick={() => navigate(`/habit/${habit.id}`)}
                            >
                                <strong>{habit.name}</strong>
                                <Box mt={1}>
                                    <div>Периодичность: {habit.periodicity}</div>
                                    <div>Цель: {habit.goal}</div>
                                    <div>Тип результата: {habit.resultType}</div>
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                </div>
            ) : (
                <div>У вас нет привычек. Создайте одну!</div>
            )}
        </div>
    );
}
