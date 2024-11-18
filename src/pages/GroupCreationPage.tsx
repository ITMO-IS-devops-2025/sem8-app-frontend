import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GroupController } from "../controllers/GroupController";
import {Input, Button, Select, FormControl, FormLabel, Box, Heading, List, ListItem} from "@chakra-ui/react";
import {User} from "../model/user/User";
import {Group} from "../model/group/Group"

export function GroupCreationPage(props: { currentUser: User | undefined }) {
    const [groupName, setGroupName] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleCreateGroup = async () => {
        if (!groupName) {
            setError("Название группы не может быть пустым");
            return;
        }

        try {
            const response = await new GroupController().createGroup(groupName);
            if (response instanceof Error) {
                setError("Ошибка при создании группы");
            } else {
                console.log(response);
                //navigate(`/group/${response.id}`);
            }
        } catch (err) {
            setError("Произошла ошибка при создании группы");
        }
    };

    return (
        <div className="group-creation-page" >
            <Box px={6}>
                <Heading size="md" mb={3}>Создать новую групп</Heading>
                {error && <div className="error-message">{error}</div>}
                <Input
                    placeholder="Введите название группы"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    mb={4}
                />
                <Button colorScheme="teal" onClick={handleCreateGroup}>
                    Создать группу
                </Button>
            </Box>
        </div>
    );
}
