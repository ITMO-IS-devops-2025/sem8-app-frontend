import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { HabitController } from "../controllers/HabitController";
import { Habit } from "../model/habit/Habit";
import { List, ListItem, Text, Box, Heading, Input, Button, Checkbox } from "@chakra-ui/react";
import { User } from "../model/user/User";

export function HabitPage(props: { currentUser: User | undefined }) {
    const { habitId } = useParams<{ habitId: string }>();
    const [habit, setHabit] = useState<Habit>();
    const [error, setError] = useState(false);
    const [markValues, setMarkValues] = useState<{ [key: string]: string | null }>({});

    // Загружаем данные о привычке
    useEffect(() => {
        async function fetchHabitData() {
            if (!habitId) return;

            try {
                const response = await new HabitController().getHabitById(habitId);
                if (response instanceof Error) {
                    setError(true);
                } else if ("name" in response){
                    setHabit(response);
                }
            } catch (err) {
                setError(true);
            }
        }
        fetchHabitData();
    }, [habitId]);

    const handleValueChange = (markId: string, value: string | null) => {
        setMarkValues((prev) => ({ ...prev, [markId]: value }));
    };

    const handleSubmit = async (markId: string) => {
        if (!habitId || !markValues[markId]) return;

        try {
            const newValue = markValues[markId];
            await new HabitController().changeHabitMark(habitId, markId, String(newValue));
            setHabit((prev) =>
                prev? {
                        ...prev,
                        marks: prev.marks?.map((mark) =>
                            mark.id === markId ? { ...mark, result: { value: newValue } } : mark
                        ),
                    }
                    : prev
            );
            setMarkValues((prev) => ({ ...prev, [markId]: null }));
        } catch (err) {
            console.error("Ошибка при обновлении отметки:", err);
        }
    };

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
                                {mark.result.value === null ? (
                                    <>
                                        {habit.resultType === "Boolean" && (
                                            <Checkbox
                                                isChecked={!!markValues[mark.id]}
                                                onChange={(e) =>
                                                    handleValueChange(mark.id, e.target.checked.toString())
                                                }
                                            >
                                                Выполнено
                                            </Checkbox>
                                        )}
                                        {habit.resultType === "Float" && (
                                            <Input
                                                type="number"
                                                value={String(markValues[mark.id] || "")}
                                                onChange={(e) =>
                                                    handleValueChange(mark.id, e.target.value)
                                                }
                                            />
                                        )}
                                        <Button
                                            mt={2}
                                            colorScheme="blue"
                                            onClick={() => handleSubmit(mark.id)}
                                        >
                                            Сохранить
                                        </Button>
                                    </>
                                ) : (
                                    <Text>Результат: {mark.result.value}</Text>
                                )}
                            </ListItem>
                        ))}
                    </List>

                </Box>
            )}
        </div>
    );
}
