import {useState, useEffect} from "react";
import {User} from "../model/user/User";
import {Group} from "../model/group/Group";
import {List, ListItem} from "@chakra-ui/react";
import {useParams} from "react-router-dom";
import {GroupController} from "../controllers/GroupController";
import {UserController} from "../controllers/UserController";

export function GroupPage(props: { currentUser: User | undefined }) {
    const {groupId} = useParams<{ groupId: string }>();  // Получаем ID группы из URL
    const [group, setGroup] = useState<Group | null>(null);
    const [participants, setParticipants] = useState<User[]>([]);
    const [error, setError] = useState(false);

    // Загружаем данные о группе и её участниках
    useEffect(() => {
        async function fetchGroupData() {
            if (!groupId) return;

            try {
                let response = await new GroupController().getGroupById(groupId);
                if (response instanceof Error) {
                    setError(true);
                } else if ("name" in response) {
                    setGroup(response);
                    if (response.participants && response.participants.length > 0) {
                        const participantsWithLogins = await Promise.all(
                            response.participants.map(async (participant) => {
                                const userResponse = await new UserController().getUserById(participant.userId);
                                if (userResponse instanceof Error) {
                                    setError(true);
                                }
                                else if ("login" in userResponse) {
                                    return {
                                        id: participant.userId,
                                        login: userResponse.login
                                    };
                                }
                            })
                        );
                        setParticipants(participantsWithLogins.filter((p) => p !== null) as User[]);
                    }
                }
            } catch (err) {
                setError(true);
            }
        }

        fetchGroupData();
    }, [groupId]);

    return (
        <div className="group-page">

            {error && <div className="error-message">Произошла ошибка при загрузке данных группы.</div>}

            {group && (
                <div>
                    <h1>Группа: {group.name}</h1>
                    <h2>Список участников:</h2>
                    <List spacing={3}>
                        {participants.map((participant) => (
                            <ListItem key={participant.id}>
                                {participant.login}
                            </ListItem>
                        ))}
                    </List>
                </div>
            )}
        </div>
    );
}
