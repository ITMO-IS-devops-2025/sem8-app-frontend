import React, { useState, useEffect } from "react";
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
    Text, FormControl, Input,
} from "@chakra-ui/react";
import { User } from "../../model/user/User";
import { Group } from "../../model/group/Group";
import { Habit } from "../../model/habit/Habit";
import { GroupHabitPersonal } from "../../model/habit/GroupHabitPersonal";
import { GroupController } from "../../controllers/GroupController";
import {ErrorResponse} from "../../controllers/BaseController";
import {UserController} from "../../controllers/UserController";

export function GroupPage(props: { currentUser: User | undefined }) {
    const { groupId } = useParams<{ groupId: string }>();
    const [group, setGroup] = useState<Group | null>(null);
    const [commonHabits, setCommonHabits] = useState<Habit[]>([]);
    const [personalHabits, setPersonalHabits] = useState<GroupHabitPersonal[]>([]);
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const [groupName, setGroupName] = useState<string>("");
    const [partLogins, setPartLogins] = useState<string[]>([]);
    const [newParticipantLogin, setNewParticipantLogin] = useState<string>("");
    const [addUserError, setAddUserError] = useState<string | null>(null);
    const [addUserSuccess, setAddUserSuccess] = useState<string | null>(null);

    useEffect(() => {
        async function fetchGroupData() {
            if (!groupId) return;

            try {
                const groupController = new GroupController();

                // Загружаем данные группы
                const groupResponse = await groupController.getGroupById(groupId);
                if (groupResponse instanceof ErrorResponse) {
                    setError(true);
                } else {
                    setGroup(groupResponse);
                }

                // Загружаем общие привычки
                const commonHabitsResponse = await groupController.getGroupCommonHabits(groupId);
                if (commonHabitsResponse instanceof ErrorResponse) {
                    setError(true);
                } else if ("habits" in commonHabitsResponse) {
                    // @ts-ignore
                    setCommonHabits(commonHabitsResponse.habits);
                }

                // Загружаем индивидуальные привычки
                const personalHabitsResponse = await groupController.getGroupPersonalHabits(groupId);
                if (personalHabitsResponse instanceof ErrorResponse) {
                    setError(true);
                } else if ("habits" in personalHabitsResponse) {
                    // @ts-ignore
                    setPersonalHabits(personalHabitsResponse.habits);
                }

            } catch {
                setError(true);
            }
        }

        fetchGroupData();
        if (group) { setPartLogins(group.participants.map((it) => (it.login))) }

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

    const handleAddParticipant = async () => {
        if (!newParticipantLogin) return;

        const userController = new UserController();

        // Ищем пользователя по логину
        const userResponse = await userController.getUserByLogin(newParticipantLogin);
        if (userResponse instanceof ErrorResponse) {
            setAddUserError("Пользователь с таким логином не найден.");
            setAddUserSuccess(null);
            return;
        }

        if (userResponse.login in partLogins) {
            setAddUserError("Такой пользователь уже есть.");
            setAddUserSuccess(null);
            return;
        }

        // Добавляем пользователя во временный список участников
        setPartLogins([...partLogins, userResponse.login]);
        setAddUserSuccess(`Пользователь ${newParticipantLogin} успешно добавлен!`);
        setAddUserError(null);
        setNewParticipantLogin("");

        await new GroupController().addUserToGroup(groupId!!, userResponse.id)
    };

    return (
        <div className="group-page">
            {error && <div className="error-message">Произошла ошибка при загрузке данных группы.</div>}

            {group && (
                <Box px={6}>
                    <Heading as="h1" size="xl" mt={4}>
                        {group.name}
                    </Heading>

                    <Heading as="h1" size="md" mt={4}>
                        Участники:
                    </Heading>

                    <List>
                        {partLogins.map((user) => (
                            <ListItem>
                                <Text>user</Text>
                            </ListItem>
                        ))}
                    </List>

                    <Heading size="sm" mt={4}>
                        Добавить участников:
                    </Heading>
                    <FormControl mt={2}>
                        <Input
                            placeholder="Введите логин пользователя"
                            value={newParticipantLogin}
                            onChange={(e) => setNewParticipantLogin(e.target.value)}
                        />
                        <Button colorScheme="teal" mt={2} onClick={handleAddParticipant}>
                            Добавить
                        </Button>
                        {addUserError && <Text color="red.500" mt={2}>{addUserError}</Text>}
                        {addUserSuccess && <Text color="green.500" mt={2}>{addUserSuccess}</Text>}
                    </FormControl>

                    <HStack spacing={4} mt={4}>
                        <Button colorScheme="teal" onClick={handleAddHabit}>
                            Создать привычку
                        </Button>

                        <Button colorScheme="red" onClick={handleLeaveGroup}>
                            Выйти из группы
                        </Button>
                    </HStack>



                    <Flex mt={6} gap={6}>
                        {/* Общие привычки */}
                        <VStack align="start" w="50%">
                            <Heading as="h2" size="md">
                                Общие привычки
                            </Heading>
                            <List spacing={3}>
                                {[...commonHabits].map((habit) => (
                                    <ListItem
                                        key={habit.id}
                                        onClick={() => navigate(`/group/${groupId}/group-common-habit/${habit.id}`)}
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
                                {[...personalHabits].map((habit) => (
                                    <ListItem
                                        key={habit.id}
                                        onClick={() => navigate(`/group/${groupId}/group-personal-habit/${habit.id}`)}
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