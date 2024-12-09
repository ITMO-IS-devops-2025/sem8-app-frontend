import React, { useState, useEffect } from "react";
import { HabitController } from "../../controllers/HabitController";
import { HabitTemplate } from "../../model/habit/HabitTemplate";
import { Input, Button, Select, FormControl, FormLabel, Box, Heading, List, ListItem } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { User } from "../../model/user/User";
import { UserController } from "@/controllers/UserController";

export function UserHabitCreationPage(props: { currentUser: User | undefined }) {
    const [habitTemplates, setHabitTemplates] = useState<HabitTemplate[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const [customHabit, setCustomHabit] = useState({
        name: "",
        description : "",
        tags : [],
        periodicity: {
            value : "",
            type : ""
        },
        goal: "",
        resultType: "",
    });

    useEffect(() => {
        async function fetchHabitTemplates() {
            try {
                const response = await new HabitController().getHabitTemplates();
                if (response instanceof Error) {
                    setError(true);
                } else if ("templates" in response) {
                    // @ts-ignore
                    setHabitTemplates(response.templates);
                }
            } catch (err) {
                setError(true);
            }
        }
        fetchHabitTemplates();
    }, []);

    const handleCreateHabitFromTemplate = async () => {
        if (!selectedTemplate) {
            setError(true);
            return;
        }
        try {
            const response = await new UserController().createHabitFromTemplate(selectedTemplate);
            if (response instanceof Error) {
                setError(true);
            } else if ("id" in response) {
                navigate(`/user-habit/${response.id}`);
            }
        } catch (err) {
            setError(true);
        }
    };

    const handleCreateCustomHabit = async () => {
        try {
            const response = await new UserController().createCustomHabit(customHabit);
            if (response instanceof Error) {
                setError(true);
            } else if ("id" in response) {
                navigate(`/user-habit/${response.id}`);
            }
        } catch (err) {
            setError(true);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setCustomHabit((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="habit-creation-page">
            <Box px={6} display="flex" gap={8}>
                {/* Боковая панель с шаблонами */}
                <Box flex="1">
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
                                    <Box mt={1}>
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
                        onClick={handleCreateHabitFromTemplate}
                        isDisabled={!selectedTemplate}
                    >
                        Создать привычку по шаблону
                    </Button>
                </Box>

                {/* Форма для кастомной привычки */}
                <Box flex="1">
                    <Heading size="md" mt={6}>Создать кастомную привычку</Heading>
                    <FormControl mb={4}>
                        <FormLabel>Название привычки</FormLabel>
                        <Input
                            placeholder="Введите название"
                            value={customHabit.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                        />
                    </FormControl>

                    <FormControl mb={4}>
                        <FormLabel>Периодичность</FormLabel>
                        <Select
                            value={customHabit.periodicity}
                            onChange={(e) => handleInputChange("periodicity", e.target.value)}
                        >
                            <option value="daily">Ежедневно</option>
                            <option value="weekly">Еженедельно</option>
                            <option value="monthly">Ежемесячно</option>
                        </Select>
                    </FormControl>

                    <FormControl mb={4}>
                        <FormLabel>Цель</FormLabel>
                        <Input
                            placeholder="Введите цель"
                            value={customHabit.goal}
                            onChange={(e) => handleInputChange("goal", e.target.value)}
                        />
                    </FormControl>

                    <FormControl mb={4}>
                        <FormLabel>Тип результата</FormLabel>
                        <Select
                            value={customHabit.resultType}
                            onChange={(e) => handleInputChange("resultType", e.target.value)}
                        >
                            <option value="Boolean">Да/Нет</option>
                            <option value="Float">Числовой</option>
                        </Select>
                    </FormControl>

                    <Button colorScheme="blue" onClick={handleCreateCustomHabit}>
                        Создать кастомную привычку
                    </Button>
                </Box>
            </Box>
        </div>
    );
}
