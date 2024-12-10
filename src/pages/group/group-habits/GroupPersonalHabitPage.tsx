import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import {HabitController} from "../../../controllers/HabitController";
import {Habit} from "../../../model/habit/Habit";
import {List, ListItem, Text, Box, Heading, Input, Button, Checkbox} from "@chakra-ui/react";
import {User} from "../../../model/user/User";
import {UserController} from "../../../controllers/UserController";
import {GroupController} from "../../../controllers/GroupController";
import {Textarea} from "@chakra-ui/icons";
import {GroupHabitPersonal} from "../../../model/habit/GroupHabitPersonal";
import {Statistic} from "../../../model/habit/Statistics";

export function GroupPersonalHabitPage(props: { currentUser: User | undefined }) {
    const {habitId, groupId} = useParams<{ habitId: string; groupId: string }>();
    const [habit, setHabit] = useState<GroupHabitPersonal>();
    const [error, setError] = useState(false);
    const [markValues, setMarkValues] = useState<{ [key: string]: string | null }>({});
    const [comments, setComments] = useState<{ [key: string]: string }>({});
    const [statistics, setStatistics] = useState<Statistic | null>(null);

    useEffect(() => {
        async function fetchHabitData() {
            if (!habitId || !groupId) return;

            try {
                const response = await new GroupController().getGroupPersonalHabitById(groupId, habitId);
                if (response instanceof Error) {
                    setError(true);
                } else if ("name" in response) {
                    setHabit(response);
                    const statsResponse = await new GroupController().getCommonHabitStatistics(groupId, habitId);
                    if (statsResponse instanceof Error) {
                        console.error("Ошибка при загрузке статистики:", statsResponse);
                    } else {
                        setStatistics(statsResponse as Statistic);
                    }
                }
            } catch (err) {
                setError(true);
            }
        }

        fetchHabitData();
    }, [habitId]);

    const handleValueChange = (markId: string, value: string | null) => {
        setMarkValues((prev) => ({...prev, [markId]: value}));
    };

    const handleCommentChange = (markId: string, comment: string) => {
        setComments((prev) => ({...prev, [markId]: comment}));
    };

    const handleSubmit = async (markId: string, timestamp: Date) => {
        if (!habitId || !markValues[markId]) return;

        try {
            const newValue = markValues[markId];
            const comment = comments[markId] || "";
            await new HabitController().changeHabitMark(habitId, markId, String(newValue), comment);
            setHabit((prev) =>
                prev ? {
                        ...prev,
                        marks: prev.marks?.map((mark) =>
                            mark.timestamp === timestamp ?
                                {
                                    ...mark,
                                    personalMarks: mark.personalMarks?.map((personalMark) =>
                                        personalMark.id == markId ?
                                            {
                                                ...personalMark,
                                                result: {value: newValue, comment: comment}
                                            }
                                            : personalMark
                                    ),
                                }
                                : mark
                        ),
                    }
                    : prev
            );
            setMarkValues((prev) => ({...prev, [markId]: null}));
            setComments((prev) => ({...prev, [markId]: ""}));
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
                    <List spacing={3}>
                        {habit.marks?.map((mark, index) => (
                            <ListItem key={index}>
                                <Text>Дата: {mark.timestamp.toLocaleString()}</Text>
                                {mark.personalMarks?.map((personalMark, index1) => (
                                    <ListItem key={index1}>
                                        <Text>Пользователь: {personalMark.userId}</Text>
                                        {personalMark.result === null ? (
                                            <>
                                                {habit.resultType === "Boolean" && (
                                                    <Checkbox
                                                        isChecked={!!markValues[personalMark.id]}
                                                        onChange={(e) =>
                                                            handleValueChange(personalMark.id, e.target.checked.toString())
                                                        }
                                                    >
                                                        Выполнено
                                                    </Checkbox>
                                                )}
                                                {habit.resultType === "Float" && (
                                                    <Input
                                                        type="number"
                                                        value={String(markValues[personalMark.id] || "")}
                                                        onChange={(e) =>
                                                            handleValueChange(personalMark.id, e.target.value)
                                                        }
                                                    />
                                                )}
                                                <Textarea
                                                    mt={2}
                                                    placeholder="Комментарий"
                                                    value={comments[personalMark.id] || ""}
                                                    onChange={(e) =>
                                                        handleCommentChange(personalMark.id, e.target.value)
                                                    }
                                                />
                                                <Button
                                                    mt={2}
                                                    colorScheme="blue"
                                                    onClick={() => handleSubmit(personalMark.id, mark.timestamp)}
                                                >
                                                    Сохранить
                                                </Button>
                                            </>
                                        ) : (
                                            <div>
                                                <Text>Результат: {personalMark.result.value}</Text>
                                                <Text>Комментарий: {personalMark.comment}</Text>
                                            </div>
                                        )}
                                    </ListItem>
                                ))}
                            </ListItem>
                        ))}
                    </List>

                </Box>
            )}
        </div>
    );
}
