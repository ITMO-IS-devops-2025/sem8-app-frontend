import {useEffect, useState} from "react";
import {GroupController} from "../controllers/GroupController";
import {Group} from "../model/group/Group";
import {List, ListItem, Button} from "@chakra-ui/react";
import {Link} from "react-router-dom";
import {User} from "../model/user/User";

export function GroupListPage(props: { currentUser: User | undefined }) {
    const [groups, setGroups] = useState<Group[]>([]);
    const [error, setError] = useState(false);

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
            <h1>Список ваших групп</h1>
            {error && <div className="error-message">Произошла ошибка при загрузке данных групп.</div>}

            <List spacing={3}>
                {groups.map((group) => (
                    <ListItem key={group.id}>
                        <Link to={`/group/${group.id}`}>
                            {group.name} - {group.participants?.length} участников
                        </Link>
                    </ListItem>
                ))}
            </List>

            <Button colorScheme="teal" mt={4} as={Link} to="/group-creation">
                Создать новую группу
            </Button>
        </div>
    );
}
