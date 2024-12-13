import React from "react";
import {NavLink} from "react-router-dom";
import {Box, Button, ButtonGroup, Stack} from "@chakra-ui/react";
import {User} from "../model/user/User";

export function Header(props: { currentUser: User | undefined }) {
    if (props.currentUser == null) {
        return <header>
            <Stack direction='column'>
                <Box
                    display='flex'
                    alignItems='center'
                    justifyContent='space-between'
                    width='100%'
                    py={6}
                    px={6}
                >
                    <ButtonGroup>
                        <NavLink to={"/"}><Button colorScheme='pink'>Главная</Button></NavLink>
                        <NavLink to={"/groups"}><Button colorScheme='pink'>Группы</Button></NavLink>
                    </ButtonGroup>
                    <ButtonGroup gap='4'>
                        <NavLink to={"/signIn"}><Button colorScheme='pink'>Войти</Button></NavLink>
                        <NavLink to={"/signUp"}><Button color='#D53F8C'>Зарегистрироваться</Button></NavLink>
                    </ButtonGroup>
                </Box>
            </Stack>
        </header>
    }
    return <header>
        <Stack direction='column'>
            <Box
                display='flex'
                alignItems='center'
                justifyContent='space-between'
                width='100%'
                py={6}
                px={6}
            >
                <ButtonGroup gap='4'>
                    <NavLink to={"/"}><Button colorScheme='pink'>Главная</Button></NavLink>
                    <NavLink to={"/groups"}><Button color='#D53F8C'>Группы</Button></NavLink>
                </ButtonGroup>
                <ButtonGroup gap='4'>
                    <NavLink to={"/account"}><Button color='#D53F8C'>{props.currentUser.login}</Button></NavLink>
                    <NavLink to={"/signOut"}><Button color='#D53F8C'>Выйти</Button></NavLink>
                </ButtonGroup>
            </Box>
        </Stack>
    </header>
}