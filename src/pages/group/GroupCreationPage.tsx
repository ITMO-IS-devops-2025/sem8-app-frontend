import React, { useState } from "react";
import { GroupController } from "../../controllers/GroupController";
import { UserController } from "../../controllers/UserController";
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
import { User } from "../../model/user/User";
import {ErrorResponse} from "../../controllers/BaseController";
import {NavigateOnLogout} from "../../utils/auth/NavigateOnLogin";

export function GroupCreationPage(props: { currentUser: User | undefined }) {

    let navigate = NavigateOnLogout(props.currentUser)

    const [groupName, setGroupName] = useState<string>("");
    const [participants, setParticipants] = useState<User[]>([]);
    const [partLogins, setPartLogins] = useState<string[]>([])
    const [newParticipantLogin, setNewParticipantLogin] = useState<string>("");
    const [addUserError, setAddUserError] = useState<string | null>(null);
    const [addUserSuccess, setAddUserSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);


    const handleCreateGroup = async () => {
        if (!groupName) {
            setError("Название группы не может быть пустым");
            return;
        }

        if (error != null) {
            return
        }

        const groupController = new GroupController();
        const response = await groupController.createGroup(groupName, []);

        if (response instanceof ErrorResponse) {
            setError("Ошибка при создании группы");
            return;
        }

        const participantIds = participants.map(it => it.id)
        for (const participantId of participantIds) {
            await groupController.addUserToGroup(response.id, participantId);
        }

        navigate(`/group/${response.id}`);
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
        setParticipants([...participants, userResponse]);
        setPartLogins([...partLogins, userResponse.login])
        setAddUserSuccess(`Пользователь ${newParticipantLogin} успешно добавлен!`);
        setAddUserError(null);
        setNewParticipantLogin("");
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
                        <ListItem key={participant.id}>{participant.name}</ListItem>
                    ))}
                </List>

                <Button colorScheme="teal" mt={6} onClick={handleCreateGroup}>
                    Создать группу
                </Button>
            </Box>
        </div>
    );
}