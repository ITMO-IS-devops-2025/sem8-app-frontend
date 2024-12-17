import React, { useState, useEffect } from "react";
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
import {useNavigate, useParams} from "react-router-dom";
import { UserController } from "../../../controllers/UserController";
import {Periodicity} from "../../../model/habit/Habit";
import {GroupController} from "../../../controllers/GroupController";
import {User} from "../../../model/user/User";
import {HabitTemplate} from "../../../model/habit/HabitTemplate";
import {HabitController} from "../../../controllers/HabitController";
import {ErrorResponse} from "../../../controllers/BaseController";
import {NavigateOnLogout} from "../../../utils/auth/NavigateOnLogin";

export function GroupHabitCreationPage(props: { currentUser: User | undefined;setCurrentUser: (newPersonData: User) => void; }) {
    const { groupId } = useParams<{ groupId: string }>();
    const [habitTemplates, setHabitTemplates] = useState<HabitTemplate[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [error, setError] = useState(false);
    const [habitType, setHabitType] = useState<"personal" | "group" | "">("");
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
    const navigate = useNavigate();

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

    const handleCreateHabitFromTemplate = async () => {
        if (!selectedTemplate || !groupId) {
            setError(true);
            return;
        }

        try {
            const groupController = new GroupController();
            const response =
                habitType === "group"
                    ? await groupController.createCommonHabitFromTemplate(groupId, selectedTemplate)
                    : await groupController.createPersonalHabitFromTemplate(groupId, selectedTemplate);

            if (response instanceof ErrorResponse) {
                setError(true);
            } else if (habitType == 'personal') {
                navigate(`/group/${groupId}/group-personal-habit/${response.id}`);
            } else if (habitType == 'group') {
                navigate(`/group/${groupId}/group-common-habit/${response.id}`);
            }
        } catch (err) {
            setError(true);
        }
    };

    const handleCreateCustomHabit = async () => {
        if (!habitType || !groupId) {
            setError(true);
            return;
        }

        try {
            if (customHabit.resultType == "Boolean") {
                customHabit.goal = "True"
            }
            const response =
                habitType === "group"
                    ? await new GroupController().createCommonHabit( groupId,
                        customHabit.name,
                        customHabit.description,
                        customHabit.tags.map(tag => tag.id),
                        customHabit.periodicity,
                        customHabit.goal,
                        customHabit.resultType)
                    : await new GroupController().createPersonalHabit( groupId,
                        customHabit.name,
                        customHabit.description,
                        customHabit.tags.map(tag => tag.id),
                        customHabit.periodicity,
                        customHabit.goal,
                        customHabit.resultType
                    );
            if (response instanceof ErrorResponse) {
                setError(true);
            } else if (habitType == 'personal') {
                navigate(`/group/${groupId}/group-personal-habit/${response.id}`);
            } else if (habitType == 'group') {
                navigate(`/group/${groupId}/group-common-habit/${response.id}`);
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
        setCustomHabit((prev) => ({
            ...prev,
            tags: [...prev.tags, {id, name}]
        }));
    };

    const handleRemoveTag = (id: string, name: string) => {
        setCustomHabit((prev) => ({
            ...prev,
            tags: prev.tags.filter((t) => t.id !== id),
        }));
    };

    return (
        <div className="page">
            <Box px={6}>
                {/* Выбор типа зачета */}
                <FormControl mb={4}>
                    <FormLabel>Тип зачета</FormLabel>
                    <Select
                        placeholder="Выберите тип зачета"
                        value={habitType}
                        onChange={(e) => setHabitType(e.target.value as "personal" | "group")}
                    >
                        <option value="personal">Индивидуальный</option>
                        <option value="group">Групповой</option>
                    </Select>
                </FormControl>

                {/* Основной контент */}
                <Box display="flex" gap={8}>
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
                                        onClick={() => {
                                            if (selectedTemplate === template.id) {
                                                setSelectedTemplate(null)
                                            } else {
                                                setSelectedTemplate(template.id)
                                            }
                                        }}
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
                            isDisabled={!selectedTemplate || !habitType}
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
                            <List spacing={1} mt={4}>
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
                                <option value="Day">Дни</option>
                                <option value="Week">Недели</option>
                                <option value="Month">Месяцы</option>
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
                                <option value="Float">Числовой</option>
                            </Select>
                        </FormControl>

                        <FormControl mb={4}>
                            <FormLabel>Цель</FormLabel>
                            <Input
                                placeholder="Введите цель"
                                value={customHabit.goal}
                                onChange={(e) => handleInputChange("goal", e.target.value)}
                                isDisabled={customHabit.resultType !== "Float"}
                            />
                        </FormControl>

                        <Button colorScheme="blue" onClick={handleCreateCustomHabit} isDisabled={!habitType}>
                            Создать кастомную привычку
                        </Button>
                    </Box>
                </Box>
            </Box>
        </div>
    );
}
