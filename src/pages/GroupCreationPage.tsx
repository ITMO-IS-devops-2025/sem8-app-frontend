import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GroupController } from "../controllers/GroupController";
import { Input, Button } from "@chakra-ui/react";
import {User} from "../model/user/User";

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
                // После создания группы переходим на страницу группы
                console.log("group created", groupName);
                navigate(`/group/${response.id}`);
            }
        } catch (err) {
            setError("Произошла ошибка при создании группы");
        }
    };

    return (
        <div className="group-creation-page">
            <h1>Создать новую группу</h1>
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
        </div>
    );
}
