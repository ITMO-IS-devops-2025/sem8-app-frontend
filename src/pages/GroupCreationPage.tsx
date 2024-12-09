import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GroupController } from "../controllers/GroupController";
import { UserController } from "../controllers/UserController";
import {
    Input,
    Button,
    FormControl,
    FormLabel,
    Box,
    Heading,
    List,
    ListItem,
    Text,
} from "@chakra-ui/react";
import { User } from "../model/user/User";

export function GroupCreationPage(props: { currentUser: User | undefined }) {
    const [groupName, setGroupName] = useState<string>("");
    const [participants, setParticipants] = useState<User[]>([]);
    const [newParticipantLogin, setNewParticipantLogin] = useState<string>("");
    const [addUserError, setAddUserError] = useState<string | null>(null);
    const [addUserSuccess, setAddUserSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleCreateGroup = async () => {
        if (!groupName) {
            setError("Название группы не может быть пустым");
            return;
        }

        try {
            const groupController = new GroupController();
            const response = await groupController.createGroup(groupName, []);

            if (response instanceof Error || !("groupId" in response)) {
                setError("Ошибка при создании группы");
                return;
            }

            const groupId = response.groupId;

            // Добавляем участников в группу
            for (const participant of participants) {
                await groupController.addUserToGroup(groupId as string, participant.id as string);
            }

            navigate(`/group/${groupId}`);
        } catch (err) {
            setError("Произошла ошибка при создании группы");
        }
    };

    const handleAddParticipant = async () => {
        if (!newParticipantLogin) return;

        try {
            const userController = new UserController();

            // Ищем пользователя по логину
            const userResponse = await userController.getUserByLogin(newParticipantLogin);

            // Проверяем, что возвращено именно User
            if (!("id" in userResponse)) {
                setAddUserError("Пользователь с таким логином не найден.");
                setAddUserSuccess(null);
                return;
            }

            // Добавляем пользователя во временный список участников
            setParticipants((prev) => [...prev, userResponse]);
            setAddUserSuccess("Пользователь успешно добавлен!");
            setAddUserError(null);
            setNewParticipantLogin("");
        } catch (err) {
            setAddUserError("Произошла ошибка при добавлении пользователя.");
            setAddUserSuccess(null);
        }
    };

    return (
        <div className="group-creation-page">
            <Box px={6}>
                <Heading size="md" mb={3}>
                    Создать новую группу
                </Heading>
                {error && <Text color="red.500" mb={3}>{error}</Text>}
                <FormControl mb={4}>
                    <FormLabel>Название группы</FormLabel>
                    <Input
                        placeholder="Введите название группы"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                    />
                </FormControl>

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

                <Heading size="sm" mt={4}>
                    Список участников:
                </Heading>
                <List spacing={3} mt={2}>
                    {participants.map((participant) => (
                        <ListItem key={participant.id}>{participant.login}</ListItem>
                    ))}
                </List>

                <Button colorScheme="teal" mt={6} onClick={handleCreateGroup}>
                    Создать группу
                </Button>
            </Box>
        </div>
    );
}