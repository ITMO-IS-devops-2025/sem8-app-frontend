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
    TagCloseButton,
    TagLabel,
    HStack, Tag, Text,   NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from "@chakra-ui/react";
import {Link, useNavigate} from "react-router-dom";
import { User } from "../../model/user/User";
import { UserController } from "../../controllers/UserController";
import {Habit, Periodicity} from "../../model/habit/Habit";
import {ErrorResponse} from "../../controllers/BaseController";
import {NavigateOnLogout} from "../../utils/auth/NavigateOnLogin";

export function UserHabitCreationPage(props: { currentUser: User | undefined; setCurrentUser: (newPersonData: User) => void; }) {
    const [habitTemplates, setHabitTemplates] = useState<HabitTemplate[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [error, setError] = useState(false);
    let navigate = NavigateOnLogout(props.currentUser)
    // State для кастомной привычки
    const [customHabit, setCustomHabit] = useState({
        name: "",
        description: "",
        tags: [] as {id: string, name: string}[],
        periodicity: {
            value: "",
            type: 0,
        } as unknown as Periodicity,
        goal: "",
        resultType: "",
    });

    const [allTags, setTags] = useState<{id: string, name: string}[]>([]);

    useEffect(() => {
        async function fetchHabitTemplates() {
            try {
                const response = await new HabitController().getHabitTemplates();
                if (response instanceof ErrorResponse) {
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

    useEffect(() => {
        async function fetchTags() {
            try {
                const response = await new HabitController().getHabitsTags();
                if (response instanceof ErrorResponse) {
                    setError(true);
                } else if ("tags" in response) {
                    // @ts-ignore
                    setTags(response.tags);
                }
            } catch (err) {
                setError(true);
            }
        }
        fetchTags();
    }, []);

    async function fetchCurrentUser() {
        try {
            const response = await new UserController().getCurrentUser();
            if (response instanceof ErrorResponse) {
                console.log(response)
                if (response.code == 401) {
                    navigate('/signIn')
                }
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

    const handleCreateHabitFromTemplate = async () => {
        if (!selectedTemplate) {
            setError(true);
            return;
        }

        try {
            const response = await new UserController().createHabitFromTemplate(selectedTemplate);
            if (response instanceof ErrorResponse) {
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
            if (customHabit.resultType == "Boolean") {
                customHabit.goal = "True"
            }
            const response = await new UserController().createHabit(
                customHabit.name,
                customHabit.description,
                customHabit.tags.map(tag => tag.id),
                customHabit.periodicity,
                customHabit.goal,
                customHabit.resultType);
            if (response instanceof ErrorResponse) {
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

    const handleAddTag = (id: string, name: string) => {
        setCustomHabit((prev) => {
            if (prev.tags.some(tag => tag.id === id)) {
                return prev; // Если тег уже есть, возвращаем текущее состояние
            }
            return {
                ...prev,
                tags: [...prev.tags, { id, name }]
            };
        });
    };


    const handleRemoveTag = (id: string, name: string) => {
        setCustomHabit((prev) => ({
            ...prev,
            tags: prev.tags.filter((t) => t.id !== id),
        }));
    };

    return (
        <div className="habit-creation-page">
            <Box px={6} display="flex" gap={8} className="page">
                {/* Боковая панель с шаблонами */}
                <Box flex="1">
                    <FormControl mb={4}>
                        <Heading size="md" mt={6}>Шаблоны привычек</Heading>
                        <List spacing={3}>
                            {habitTemplates.map((template) => (
                                <ListItem
                                    key={template.id}
                                    p={2}
                                    bg={selectedTemplate === template.id ? "teal.100" : "white"}
                                    borderRadius="md"
                                    cursor="pointer"
                                    onClick={() => setSelectedTemplate(template.id)}
                                >
                                    <strong>{template.name}</strong>
                                    <Box mt={1}>
                                        <div>Периодичность тип: {template.periodicity.type}</div>
                                        <div>Периодичность значение: {template.periodicity.value}</div>
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
                    <FormControl mb={4} isRequired>
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
                        <List spacing={3} mt={4}>
                            {allTags.map((tag) => (
                                <ListItem key={tag.id}
                                          cursor="pointer"
                                          onClick={() => handleAddTag(tag.id, tag.name)}>
                                    {tag.name}
                                </ListItem>
                            ))}
                        </List>

                        <HStack mt={2} wrap="wrap">
                            {customHabit.tags.map((tag, index) => (
                                <Tag key={index} size="md" colorScheme="teal" borderRadius="full" cursor="pointer">
                                    <TagLabel>{tag.name}</TagLabel>
                                    <TagCloseButton onClick={() => handleRemoveTag(tag.id, tag.name)} />
                                </Tag>
                            ))}
                        </HStack>
                    </FormControl>

                    <FormControl mb={4}>
                        <FormLabel>Периодичность</FormLabel>
                        <NumberInput
                            defaultValue={2.5}
                            value={customHabit.periodicity.value}
                            onChange={(e) => handlePeriodicityChange("value", e)}>
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                        <Select
                            mt={2}
                            value={customHabit.periodicity.type}
                            onChange={(e) => handlePeriodicityChange("type", e.target.value)}
                        >
                            <option value="">Выберите тип</option>
                            <option value="Day">День</option>
                            <option value="Week">Неделя</option>
                            <option value="Month">Месяц</option>
                        </Select>
                    </FormControl>

                    <FormControl mb={4}>
                        <FormLabel>Тип результата</FormLabel>
                        <Select
                            value={customHabit.resultType}
                            onChange={(e) => handleInputChange("resultType", e.target.value)}
                        >
                            <option value="">Выберите тип результата</option>
                            <option value="Boolean">Да/Нет</option>
                            <option value="Float">Число</option>
                        </Select>
                    </FormControl>

                    <FormControl mb={4}>
                        <FormLabel>Цель</FormLabel>
                        <NumberInput value={customHabit.goal}
                                     onChange={(e) => handleInputChange("goal", e)}
                                     isDisabled={customHabit.resultType !== "Float"}>
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </FormControl>



                    <Button colorScheme="blue" onClick={handleCreateCustomHabit}>
                        Создать кастомную привычку
                    </Button>
                </Box>
            </Box>
        </div>
    );
}
