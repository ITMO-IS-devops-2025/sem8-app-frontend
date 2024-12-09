import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Heading,
    List,
    ListItem,
    Button,
    Flex,
    VStack,
    HStack,
    Text,
} from "@chakra-ui/react";
import { User } from "../../model/user/User";
import { Group } from "../../model/group/Group";
import { Habit } from "../../model/habit/Habit";
import { GroupHabitPersonal } from "../../model/habit/GroupHabitPersonal";
import { GroupController } from "../../controllers/GroupController";
import {ErrorResponse} from "../controllers/BaseController";
import {UserController} from "../controllers/UserController";

export function GroupPage(props: { currentUser: User | undefined }) {
    const { groupId } = useParams<{ groupId: string }>();
    const [group, setGroup] = useState<Group | null>(null);
    const [commonHabits, setCommonHabits] = useState<Habit[]>([]);
    const [personalHabits, setPersonalHabits] = useState<GroupHabitPersonal[]>([]);
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchGroupData() {
            if (!groupId) return;

            try {
                const groupController = new GroupController();

                // Загружаем данные группы
                const groupResponse = await groupController.getGroupById(groupId);
                if (!(groupResponse instanceof ErrorResponse)) {
                    setGroup(groupResponse);
                } else {
                    setError(true);
                }

                // Загружаем общие привычки
                const commonHabitsResponse = await groupController.getGroupCommonHabits(groupId);
                if (!(commonHabitsResponse instanceof ErrorResponse)) {
                    setCommonHabits(commonHabitsResponse);
                }

                // Загружаем индивидуальные привычки
                const personalHabitsResponse = await groupController.getGroupPersonalHabits(groupId);
                if (!(personalHabitsResponse instanceof ErrorResponse)) {
                    setPersonalHabits(personalHabitsResponse);
                }
            } catch {
                setError(true);
            }
        }

        fetchGroupData();
    }, [groupId]);

    const handleLeaveGroup = async () => {
        if (!groupId) return;

        try {
            const groupController = new GroupController();
            const response = await groupController.LeaveGroup(groupId);

            if (!(response instanceof Error)) {
                navigate("/groups"); // Возврат на страницу списка групп
            } else {
                alert("Не удалось покинуть группу.");
            }
        } catch {
            alert("Произошла ошибка при выходе из группы.");
        }
    };

    const handleAddHabit = () => {
        navigate(`/group/${groupId}/group-habit-creation`);
    };

    return (
        <div className="group-page">
            {error && <div className="error-message">Произошла ошибка при загрузке данных группы.</div>}

            {group && (
                <Box px={6}>
                    <Heading as="h1" size="lg" mt={4}>
                        Группа: {group.name}
                    </Heading>

                    <HStack spacing={4} mt={4}>
                        <Button colorScheme="blue" onClick={handleAddHabit}>
                            Добавить привычку
                        </Button>
                        <Button colorScheme="red" onClick={handleLeaveGroup}>
                            Удалить себя из группы
                        </Button>
                    </HStack>

                    <Heading>
                        Участники
                    </Heading>
                    <List spacing={3}>
                        {group.participants.map((user) => (
                            <ListItem key={user.userId}>
                                <Text>{user.name}</Text>
                            </ListItem>
                        ))}
                    </List>

                    <Flex mt={6} gap={6}>
                        {/* Общие привычки */}
                        <VStack align="start" w="50%">
                            <Heading as="h2" size="md">
                                Общие привычки
                            </Heading>
                            <List spacing={3}>
                                {commonHabits.map((habit) => (
                                    <ListItem
                                        key={habit.habitId}
                                        onClick={() => navigate(`/group-common-habit/${habit.habitId}`)}
                                    >
                                        <Text>{habit.name}</Text>
                                    </ListItem>
                                ))}
                            </List>
                        </VStack>

                        {/* Индивидуальные привычки */}
                        <VStack align="start" w="50%">
                            <Heading as="h2" size="md">
                                Индивидуальные привычки
                            </Heading>
                            <List spacing={3}>
                                {personalHabits.map((habit) => (
                                    <ListItem
                                        key={habit.habitId}
                                        onClick={() => navigate(`/group-personal-habit/${habit.habitId}`)}
                                    >
                                        <Text>{habit.name}</Text>
                                    </ListItem>
                                ))}
                            </List>
                        </VStack>
                    </Flex>
                </Box>
            )}
        </div>
    );
}