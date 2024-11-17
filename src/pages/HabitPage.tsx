import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { HabitController } from "../controllers/HabitController";
import { Habit } from "../model/habit/Habit";
import { List, ListItem, Text, Box, Heading } from "@chakra-ui/react";
import {User} from "../model/user/User";

export function HabitPage(props: { currentUser: User | undefined }) {
    const { habitId } = useParams<{ habitId: string }>();  // Получаем ID привычки из URL
    const [habit, setHabit] = useState<Habit | null>(null);
    const [error, setError] = useState(false);

    // Загружаем данные о привычке
    useEffect(() => {
        async function fetchHabitData() {
            if (!habitId) return;

            try {
                const response = await new HabitController().getHabitById(habitId);
                if (response instanceof Error) {
                    setError(true);
                } else {
                    setHabit(response);
                }
            } catch (err) {
                setError(true);
            }
        }
        fetchHabitData();
    }, [habitId]);

    return (
        <div className="habit-page">
            {error && <div className="error-message">Произошла ошибка при загрузке данных привычки.</div>}

            {habit && (
                <Box px={6}>
                    <Heading as="h1">Привычка: {habit.name}</Heading>
                    <Text fontSize="xl">Периодичность: {habit.periodicity}</Text>
                    <Text fontSize="xl">Цель: {habit.goal}</Text>
                    <Text fontSize="xl">Тип результата: {habit.resultType}</Text>

                    <Heading as="h2" size="mt" mt={4}>Оценки:</Heading>
                    <List spacing={3} >
                        {habit.marks?.map((mark, index) => (
                            <ListItem key={index}>
                                <Text>Дата: {mark.timestamp.toLocaleString()}</Text>
                                <Text>Результат: {mark.result.value}</Text>
                            </ListItem>
                        ))}
                    </List>

                </Box>
            )}
        </div>
    );
}
