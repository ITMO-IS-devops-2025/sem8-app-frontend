import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { HabitController } from "../../../controllers/HabitController";
import { Habit } from "../../../model/habit/Habit";
import {List, ListItem, Text, Box, Heading, Input, Button, Checkbox, HStack, Tag, TagLabel} from "@chakra-ui/react";
import { User } from "../../../model/user/User";
import {UserController} from "@/controllers/UserController";
import {GroupController} from "../../../controllers/GroupController";
import {Textarea} from "@chakra-ui/icons";
import {Statistic} from "../../../model/habit/Statistics";
import {ErrorResponse} from "../../../controllers/BaseController";

export function GroupCommonHabitPage(props: { currentUser: User | undefined }) {
    const { habitId, groupId } = useParams<{ habitId: string; groupId: string }>();
    const [habit, setHabit] = useState<Habit>();
    const [error, setError] = useState(false);
    const [markValues, setMarkValues] = useState<{ [key: string]: string | null }>({});
    const [comments, setComments] = useState<{ [key: string]: string }>({});
    const [statistics, setStatistics] = useState<Statistic| null>(null);

    useEffect(() => {
        async function fetchHabitData() {
            if (!habitId || !groupId) return;

            try {
                const response = await new GroupController().getGroupCommonHabitById(groupId, habitId);
                if (response instanceof ErrorResponse) {
                    setError(true);
                } else if ("name" in response){
                    setHabit(response);
                    if (response.isTemplated) {
                        const statsResponse = await new GroupController().getCommonHabitStatistics(groupId, habitId);
                        if (statsResponse instanceof ErrorResponse) {
                            console.error("Ошибка при загрузке статистики:", statsResponse);
                        } else {
                            setStatistics(statsResponse as Statistic);
                        }
                    }
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

    const handleCommentChange = (markId: string, comment: string) => {
        setComments((prev) => ({ ...prev, [markId]: comment }));
    };

    const handleSubmit = async (markId: string) => {
        if (!habitId || !markValues[markId]) return;

        try {
            const newValue = markValues[markId];
            const comment = comments[markId] || "";
            await new HabitController().changeHabitMark(habitId, markId, String(newValue), comment);
            setHabit((prev) =>
                prev? {
                        ...prev,
                        marks: prev.marks?.map((mark) =>
                            mark.id === markId ? { ...mark, result: { value: newValue, comment: comment } } : mark
                        ),
                    }
                    : prev
            );
            setMarkValues((prev) => ({ ...prev, [markId]: null }));
            setComments((prev) => ({ ...prev, [markId]: "" }));
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
                    <Text fontSize="xl">Описание: {habit.description}</Text>
                    <Text fontSize="xl">Тэги: </Text>
                    <HStack mt={2} wrap="wrap">
                        {habit.tags.map((tag, index) => (
                            <Tag key={index} size="md" colorScheme="teal" borderRadius="full">
                                <TagLabel fontSize="l">{tag}</TagLabel>
                            </Tag>
                        ))}
                    </HStack>
                    <Text fontSize="xl">Периодичность: {habit.periodicity.value} {habit.periodicity.type}</Text>
                    <Text fontSize="xl">Цель: {habit.goal}</Text>
                    <Text fontSize="xl">Тип результата: {habit.resultType}</Text>
                    {habit.isTemplated && statistics !== null && (
                        <Box mt={4} p={4} borderWidth="1px" borderRadius="lg">
                            <Heading as="h2" size="md">Статистика:</Heading>
                            <Text fontSize="lg">Доля (чего-то я хз): {statistics.value}</Text>
                        </Box>
                    )}
                    <Heading as="h2" size="mt" mt={4}>Оценки:</Heading>
                    <List spacing={3} >
                        {habit.marks?.map((mark, index) => (
                            <ListItem key={index}>
                                <Text>Дата: {new Date(mark.timestamp).toLocaleString("ru-RU", {
                                    timeZone: "UTC",
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}</Text>
                                {mark.result === null ? (
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
                                        <Textarea
                                            mt={2}
                                            placeholder="Комментарий"
                                            value={comments[mark.id] || ""}
                                            onChange={(e) =>
                                                handleCommentChange(mark.id, e.target.value)
                                            }
                                        />
                                        <Button
                                            mt={2}
                                            colorScheme="blue"
                                            onClick={() => handleSubmit(mark.id)}
                                        >
                                            Сохранить
                                        </Button>
                                    </>
                                ) : (
                                    <div>
                                        <Text>Результат: {mark.result.value}</Text>
                                        <Text>Комментарий: {mark.result.comment}</Text>
                                    </div>
                                )}
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}
        </div>
    );
}
