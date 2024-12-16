import React, {useState, useEffect} from "react";
import {useParams, useNavigate, Link} from "react-router-dom";
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
import {User} from "../../model/user/User";
import {Group} from "../../model/group/Group";
import {Habit} from "../../model/habit/Habit";
import {GroupHabitPersonal} from "../../model/habit/GroupHabitPersonal";
import {GroupController} from "../../controllers/GroupController";
import {ErrorResponse} from "../../controllers/BaseController";
import {UserController} from "../../controllers/UserController";

export function GroupPage(props: { currentUser: User | undefined }) {
    const {groupId} = useParams<{ groupId: string }>();
    const [group, setGroup] = useState<Group | null>(null);
    const [commonHabits, setCommonHabits] = useState<Habit[]>([]);
    const [personalHabits, setPersonalHabits] = useState<GroupHabitPersonal[]>([]);
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const [groupName, setGroupName] = useState<string>("");
    const [participants, setParticipant] = useState<User[]>([]);
    const [newParticipantLogin, setNewParticipantLogin] = useState<string>("");
    const [newParticipant, setNewParticipant] = useState<User>();
    const [addUserError, setAddUserError] = useState<string | null>(null);
    const [addUserSuccess, setAddUserSuccess] = useState<string | null>(null);

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

    useEffect(() => {
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

        if (userResponse.id in participants.map(participant => participant.userId)) {
            setAddUserError("Такой пользователь уже есть.");
            setAddUserSuccess(null);
            return;
        }

        setParticipant([...participants, {userId: userResponse.id, name: userResponse.name, login: newParticipantLogin}]);
        setAddUserSuccess(`Пользователь ${newParticipantLogin} успешно добавлен!`);
        setAddUserError(null);

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
                        {group.participants.map((participant) => (
                            <ListItem>
                                <Text>{participant.login}</Text>
                            </ListItem>
                        ))}
                    </List>
                    <List>
                        {participants.map((participant) => (
                            <ListItem>
                                <Text>{participant.login}</Text>
                            </ListItem>
                        ))}
                    </List>

                    <Heading size="sm" mt={2}>
                        Добавить участников:
                    </Heading>
                    <FormControl mt={2} width={'30%'}>
                        <Input
                            placeholder="Введите логин пользователя"
                            value={newParticipantLogin}
                            onChange={(e) => setNewParticipantLogin(e.target.value)}
                        />
                        <HStack spacing={4} mt={4}>
                            <Button colorScheme="teal" onClick={handleAddParticipant}>
                                Добавить
                            </Button>
                            <Button colorScheme="red" onClick={handleLeaveGroup}>
                                Выйти из группы
                            </Button>
                        </HStack>
                        {addUserError && <Text color="red.500" mt={2}>{addUserError}</Text>}
                        {addUserSuccess && <Text color="green.500" mt={2}>{addUserSuccess}</Text>}
                    </FormControl>

                    <Box mt = {4} display="flex" gap={8}>
                        {/* Общие привычки */}
                        <Box flex="1">
                            <Heading as="h2" size="md">
                                Общие привычки
                            </Heading>
                            <List spacing={3} mt = {4}>
                                {[...commonHabits].map((habit) => (
                                    <ListItem
                                        key={habit.id}
                                        p={2}
                                        bg="gray.50"
                                        borderRadius="md"
                                        cursor="pointer"
                                        onClick={() => navigate(`/group/${groupId}/group-common-habit/${habit.id}`)}
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
                        </Box>

                        {/* Индивидуальные привычки */}
                        <Box flex="1">
                            <Heading as="h2" size="md">
                                Индивидуальные привычки
                            </Heading>
                            <List spacing={3} mt = {4}>
                                {[...personalHabits].map((habit) => (
                                    <ListItem
                                        key={habit.id}
                                        p={2}
                                        bg="gray.50"
                                        borderRadius="md"
                                        cursor="pointer"
                                        onClick={() => navigate(`/group/${groupId}/group-personal-habit/${habit.id}`)}
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
                        </Box>
                    </Box>

                    <Button colorScheme="teal" onClick={handleAddHabit} mt={4}>
                        Создать привычку
                    </Button>
                </Box>
            )}
        </div>
    );
}