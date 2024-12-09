import React, { useState, useEffect } from "react";
import { HabitController } from "../controllers/HabitController";
import { HabitTemplate } from "../model/habit/HabitTemplate";
import {Input, Button, Select, FormControl, FormLabel, Box, Heading, List, ListItem} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {User} from "../model/user/User";
import {UserController} from "../controllers/UserController";

export function HabitCreationPage(props: { currentUser: User | undefined }) {
    const [habitTemplates, setHabitTemplates] = useState<HabitTemplate[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    // Загружаем все шаблоны привычек
    useEffect(() => {
        async function fetchHabitTemplates() {
            try {
                const response = await new HabitController().getHabitTemplates();
                if (response instanceof Error) {
                    setError(true);
                } else if ("templates" in response){
                    // @ts-ignore
                    setHabitTemplates(response.templates);
                }
            } catch (err) {
                setError(true);
            }
        }
        fetchHabitTemplates();
    }, []);

    const handleCreateHabit = async () => {
        if (!selectedTemplate) {
            setError(true);
            return;
        }

        try {
            const response = await new UserController().createHabitFromTemplate(selectedTemplate);
            if (response instanceof Error) {
                setError(true);
            } else if ("habitId" in response){
                navigate(`/habit/${response.habitId}`);
            }
        } catch (err) {
            setError(true);
        }
    };

    return (
        <div className="habit-creation-page">
            <Box px={6}>
                <FormControl mb={4}>
                    <Heading size="md" mt={6}>Шаблоны привычек</Heading>
                    <List spacing={3}>
                        {habitTemplates.map((template) => (
                            <ListItem
                                key={template.templateId}
                                p={2}
                                bg={selectedTemplate === template.templateId ? "teal.100" : "white"}
                                borderRadius="md"
                                cursor="pointer"
                                onClick={() => setSelectedTemplate(template.templateId)}
                            >
                                <strong>{template.name}</strong>
                                <Box mt={1} >
                                    <div>Периодичность: {template.periodicity}</div>
                                    <div>Цель: {template.goal}</div>
                                    <div>Тип результата: {template.resultType}</div>
                                </Box>

                            </ListItem>
                        ))}
                    </List>
                </FormControl>

                <Button
                    colorScheme="teal"
                    onClick={handleCreateHabit}
                    isDisabled={!selectedTemplate} // Кнопка активна только если выбран шаблон
                >
                    Создать привычку
                </Button>
            </Box>
        </div>
    );
}
