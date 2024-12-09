import React, { useState, useEffect } from "react";
import { HabitController } from "../../controllers/HabitController";
import { HabitTemplate } from "../../model/habit/HabitTemplate";
import {
    Input,
    Button,
    Select,
    FormControl,
    FormLabel,
    Box,
    Heading,
    List,
    ListItem,
    Textarea,
    Tag,
    TagCloseButton,
    TagLabel,
    HStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { User } from "../../model/user/User";
import { UserController } from "@/controllers/UserController";
import {Periodicity} from "@/model/habit/Habit";

export function UserHabitCreationPage(props: { currentUser: User | undefined }) {
    const [habitTemplates, setHabitTemplates] = useState<HabitTemplate[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    // State для кастомной привычки
    const [customHabit, setCustomHabit] = useState({
        name: "",
        description: "",
        tags: [] as string[],
        periodicity: {
            value: "",
            type: 0,
        } as unknown as Periodicity,
        goal: "",
        resultType: "",
    });

    const [tagInput, setTagInput] = useState(""); // Для добавления новых тегов

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
            const response = await new UserController().createCustomHabit(
                customHabit.name,
                customHabit.description,
                customHabit.tags,
                customHabit.periodicity,
                customHabit.goal,
                customHabit.resultType);
            if (response instanceof Error) {
                setError(true);
            } else if ("id" in response) {
                navigate(`/user-habit/${response.id}`);
            }
        } catch (err) {
            setError(true);
        }
    };

    const handleInputChange = (field: string, value: any) => {
        setCustomHabit((prev) => ({ ...prev, [field]: value }));
    };

    const handlePeriodicityChange = (field: "value" | "type", value: string) => {
        setCustomHabit((prev) => ({
            ...prev,
            periodicity: { ...prev.periodicity, [field]: value },
        }));
    };

    const handleAddTag = () => {
        if (tagInput.trim()) {
            setCustomHabit((prev) => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()],
            }));
            setTagInput("");
        }
    };

    const handleRemoveTag = (tag: string) => {
        setCustomHabit((prev) => ({
            ...prev,
            tags: prev.tags.filter((t) => t !== tag),
        }));
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
                        <FormLabel>Описание</FormLabel>
                        <Textarea
                            placeholder="Введите описание"
                            value={customHabit.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                        />
                    </FormControl>

                    <FormControl mb={4}>
                        <FormLabel>Теги</FormLabel>
                        <HStack>
                            <Input
                                placeholder="Добавить тег"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                            />
                            <Button onClick={handleAddTag}>Добавить</Button>
                        </HStack>
                        <HStack mt={2} wrap="wrap">
                            {customHabit.tags.map((tag, index) => (
                                <Tag key={index} size="md" colorScheme="teal" borderRadius="full">
                                    <TagLabel>{tag}</TagLabel>
                                    <TagCloseButton onClick={() => handleRemoveTag(tag)} />
                                </Tag>
                            ))}
                        </HStack>
                    </FormControl>

                    <FormControl mb={4}>
                        <FormLabel>Периодичность</FormLabel>
                        <Input
                            placeholder="Значение (например, 3)"
                            value={customHabit.periodicity.value}
                            onChange={(e) => handlePeriodicityChange("value", e.target.value)}
                        />
                        <Select
                            mt={2}
                            value={customHabit.periodicity.type}
                            onChange={(e) => handlePeriodicityChange("type", e.target.value)}
                        >
                            <option value="">Выберите тип</option>
                            <option value="days">Дни</option>
                            <option value="weeks">Недели</option>
                            <option value="months">Месяцы</option>
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
                            <option value="">Выберите тип результата</option>
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
