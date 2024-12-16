import React, {useEffect, useState} from "react";
import {GroupController} from "../../controllers/GroupController";
import {Group} from "../../model/group/Group";
import {List, ListItem, Button, Box, Heading} from "@chakra-ui/react";
import {Link} from "react-router-dom";
import {User} from "../../model/user/User";
import {ErrorResponse} from "../../controllers/BaseController";
import {NavigateOnLogout} from "../../utils/auth/NavigateOnLogin";

export function GroupListPage(props: { currentUser: User | undefined }) {
    const [groups, setGroups] = useState<Group[]>([]);
    const [error, setError] = useState(false);
    NavigateOnLogout(props.currentUser)

    async function fetchGroups() {
        try {
            const response = await new GroupController().getGroups();
            if (response instanceof ErrorResponse) {
                setError(true);
            } else if ("groups" in response) {
                // @ts-ignore
                setGroups(response.groups);
            }
        } catch (err) {
            setError(true);
        }
    }

    useEffect(() => {
        if (props.currentUser) {
            fetchGroups();
        }
    }, [props.currentUser]);

    if (props.currentUser === undefined) {
        return (
            <div>
                <Heading px={6}>Регистрируйся и присоединяйся к панпипе!</Heading>
            </div>
        );
    }

    return (
        <Box mt={4} px={6} className="page">
            <div className="group-list-page">

                <Heading as="h1" size="lg" mt={4}>
                    Список ваших групп:
                </Heading>
                {error && <div className="error-message">Произошла ошибка при загрузке данных групп.</div>}

                <List spacing={3} mt={4}>
                    {groups.map((group) => (
                        <ListItem key={group.id}>
                            <Link to={`/group/${group.id.toString()}`}>
                                {group.name}
                            </Link>
                        </ListItem>
                    ))}
                </List>

                <Button colorScheme="teal" mt={4} as={Link} to="/group-creation">
                    Создать новую группу
                </Button>
            </div>
        </Box>
    );
}
