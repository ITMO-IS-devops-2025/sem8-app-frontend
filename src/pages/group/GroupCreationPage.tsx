import React, {useEffect, useState} from "react";
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
import {Navigate, useNavigate} from "react-router-dom";

export function GroupCreationPage(props: { currentUser: User | undefined; setCurrentUser: (newPersonData: User) => void; }) {

    const navigate = useNavigate();
    const [groupName, setGroupName] = useState<string>("");
    const [participants, setParticipants] = useState<User[]>([]);
    const [newParticipantLogin, setNewParticipantLogin] = useState<string>("");
    const [addUserError, setAddUserError] = useState<string | null>(null);
    const [addUserSuccess, setAddUserSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);


    async function fetchCurrentUser() {
        try {
            const response = await new UserController().getCurrentUser();
            if (response instanceof ErrorResponse) {
                console.log(response)
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

    const handleCreateGroup = async () => {
        if (!groupName) {
            setError("Название группы не может быть пустым");
            return;
        }

        if (error != null) {
            return
        }

        const groupController = new GroupController();
        const response = await groupController.createGroup(groupName, participants.map(part => ({userId: part.userId})));


        if (response instanceof ErrorResponse) {
            setError("Ошибка при создании группы");
            return;
        }

        navigate(`/group/${response.id}`);
    };

    const handleAddParticipant = async () => {
        if (!newParticipantLogin) return;

        if (newParticipantLogin == props.currentUser?.login) {
            setAddUserError("Нельзя добавить себя повторно");
            setAddUserSuccess(null);
            return;
        }

        const userController = new UserController();

        // Ищем пользователя по логину
        const userResponse = await userController.getUserByLogin(newParticipantLogin);
        if (userResponse instanceof ErrorResponse) {
            setAddUserError("Пользователь с таким логином не найден.");
            setAddUserSuccess(null);
            return;
        }

        if (userResponse.userId in participants.map(participant => participant.userId)) {
            setAddUserError("Такой пользователь уже есть.");
            setAddUserSuccess(null);
            return;
        }

        if (!userResponse.userId) {
            setAddUserError("id пользователя null");
            return;
        }

        setParticipants([...participants, userResponse]);
        setAddUserSuccess(`Пользователь ${newParticipantLogin} успешно добавлен!`);
        setAddUserError(null);
    };

    return (
        <div className="page">
            <Box px={6} className="page-box">
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

                <List>
                    <ListItem>
                        <Text>{props.currentUser?.login}</Text>
                    </ListItem>
                    {participants.map((participant) => (
                        <ListItem>
                            <Text>{participant.login}</Text>
                        </ListItem>
                    ))}
                </List>

                <Button colorScheme="teal" mt={6} onClick={handleCreateGroup}>
                    Создать группу
                </Button>
            </Box>
        </div>
    );
}