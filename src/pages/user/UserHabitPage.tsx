import React, { useState, useEffect } from "react";
import {useNavigate, useParams} from "react-router-dom";
import { HabitController } from "../../controllers/HabitController";
import { Habit } from "../../model/habit/Habit";
import {
    List,
    ListItem,
    Text,
    Box,
    Heading,
    Input,
    Button,
    Checkbox,
    Tag,
    TagLabel,
    TagCloseButton, HStack
} from "@chakra-ui/react";
import { User } from "../../model/user/User";
import {UserController} from "../../controllers/UserController";
import {Statistic} from "../../model/habit/Statistics";
import {Textarea} from "@chakra-ui/icons";
import {ErrorResponse} from "../../controllers/BaseController";
import {NavigateOnLogout} from "../../utils/auth/NavigateOnLogin";

export function UserHabitPage(props: { currentUser: User | undefined; setCurrentUser: (newPersonData: User) => void; }) {
    const { habitId } = useParams<{ habitId: string }>();
    const [habit, setHabit] = useState<Habit>();
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const [markValues, setMarkValues] = useState<{ [key: string]: string | null }>({});
    const [comments, setComments] = useState<{ [key: string]: string }>({});
    const [statistics, setStatistics] = useState<Statistic | null>(null);
    const [editingMarks, setEditingMarks] = useState<{ [key: string]: boolean }>({});

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

    useEffect(() => {
        async function fetchHabitData() {
            if (!habitId) return;

            try {
                const response = await new UserController().getHabitById(habitId);
                if (response instanceof ErrorResponse) {
                    setError(true);
                } else if ("name" in response){
                    setHabit(response);
                    if (response.isTemplated) {
                        const statsResponse = await new UserController().getStatistics(habitId);
                        if (statsResponse instanceof ErrorResponse) {
                            console.error("Ошибка при загрузке статистики:", statsResponse);
                        } else {
                            setStatistics(statsResponse);
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
        if (!habitId) return;

        try {
            var newValue = "";
            if (!markValues[markId]){
                // @ts-ignore
                if(habit.resultType == "Boolean"){
                    newValue ="false";
                }
                else if(habit?.resultType == "Float"){
                    newValue = "0";
                }
            }
            else {
                // @ts-ignore
                newValue = markValues[markId];
            }
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
        <div className="page">
            {error && <div className="error-message">Произошла ошибка при загрузке данных привычки.</div>}

            {habit && (
                <Box px={6} width={ '60%' }>
                    <Heading as="h1">{habit.name}</Heading>
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
                        <Box mt={4} p={4}>
                            <Heading as="h2" size="md">Статистика:</Heading>
                            <Text fontSize="lg">Вы справляетесть успешнее, чем {statistics.value * 100}% пользователей!</Text>
                        </Box>
                    )}
                    <Heading as="h2" size="mt" mt={10}>Оценки:</Heading>
                    <List spacing={3} >
                        {habit.marks?.map((mark, index) => (
                            <ListItem key={index} mb={20}>
                                <Text>Дата: {new Date(mark.timestamp).toLocaleString("ru-RU", {
                                    timeZone: "UTC",
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}</Text>
                                {mark.result === null || editingMarks[mark.id] ? (
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
                                            onClick={() => {
                                                handleSubmit(mark.id);
                                                setEditingMarks((prev) => ({ ...prev, [mark.id]: false }));
                                            }}
                                        >
                                            Сохранить
                                        </Button>
                                        <Button
                                            mt={2}
                                            ml={2}
                                            onClick={() =>
                                                setEditingMarks((prev) => ({ ...prev, [mark.id]: false }))
                                            }
                                        >
                                            Отмена
                                        </Button>
                                    </>
                                ) : (
                                    <Box>
                                        <Text>Результат: {mark.result.value}</Text>
                                        <Text>Комментарий: {mark.result.comment}</Text>
                                        <Button
                                            mt={2}
                                            colorScheme="blue"
                                            onClick={() =>
                                                setEditingMarks((prev) => ({ ...prev, [mark.id]: true }))
                                            }
                                        >
                                            Редактировать
                                        </Button>
                                    </Box>
                                )}
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}
        </div>
    );
}
