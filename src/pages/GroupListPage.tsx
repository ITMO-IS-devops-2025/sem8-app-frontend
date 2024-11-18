import React, {useEffect, useState} from "react";
import {GroupController} from "../controllers/GroupController";
import {Group} from "../model/group/Group";
import {List, ListItem, Button, Box, Heading} from "@chakra-ui/react";
import {Link, useNavigate} from "react-router-dom";

import {User} from "../model/user/User";
import {Card} from "@chakra-ui/react"

export function GroupListPage(props: { currentUser: User | undefined }) {
    const [groups, setGroups] = useState<Group[]>([]);
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchGroups() {
            try {
                const response = await new GroupController().getGroups();
                if (response instanceof Error) {
                    setError(true);
                } else if (Array.isArray(response)) {
                    setGroups(response);
                }
            } catch (err) {
                setError(true);
            }
        }

        fetchGroups();
    }, []);

    return (
        <div className="group-list-page">
            <Heading size="md" mt={6} px={6}>Ваши группы:</Heading>
            {error && <div className="error-message">Произошла ошибка при загрузке данных групп.</div>}
            <List spacing={3} px={6}>
                {groups.map((group) => (
                    <ListItem key={group.id}
                              p={2}
                              bg="gray.50"
                              borderRadius="md"
                              cursor="pointer"
                              onClick={() => navigate(`/group/${group.id}`)}
                    >
                        <strong>{group.name}</strong>
                        <Box mt={1}>
                            <div>Участники: {group.participants?.length}</div>
                        </Box>
                    </ListItem>
                ))}
            </List>

            <Box mt={4} px={6}>
                <Button colorScheme="teal" onClick={() => navigate("/group-creation")}>
                    Создать группу
                </Button>
            </Box>


        </div>
    );
}
