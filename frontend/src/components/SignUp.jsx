import {
    Box,
    Button,
    Checkbox,
    Container,
    Divider,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Input,
    Link,
    Stack,
    Text,
    useToast,
} from '@chakra-ui/react'
import { OAuthButtonGroup } from './OAuthButtonGroup'
import { PasswordField } from './PasswordField'
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import React from 'react'

function SignUp() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();

    const handleEmail = (e) => {
        setEmail(e.target.value);
    }
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }
    const handleName = (e) => {
        setUsername(e.target.value);
    }
    const toast = useToast();
    const handleSubmit = async (event) => {
        console.log(username, email, password);
        console.log("submitting");
        event.preventDefault();

        try {
            const response = await fetch("http://www.localhost:3000/users/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password }),
                mode: "cors",
            });
            const data = await response.json();
            console.log("Submission repsonse",
                data.message);
            if(data.message.search("credentials")) throw new Error(data.message);
            navigate('/login');
        } catch (error) {
            toast({
                title: "Signup Error",
                description: error.message,
                status: "error",
                duration: 2500,
                isClosable: true,
                style: {
                    fontFamily: "Inter",
                },
            });
            console.error("Error:", error);
        }
    };
   return (
    <Container

    className='font-inter w-full'
    py={{
        base: '6',
        md: '12',
    }}
    px={{
        base: '0',
        sm: '8',
    }}
>
    <Stack spacing="4" class="magic">
        <Stack spacing="2" className='pt-4'>
            <Stack
                spacing={{
                    base: '2',
                    md: '3',
                }}
                textAlign="center"
            >
                <Text
                    className='font-inter font-bold text-lg'
                >
                    Sign up to create an account.
                </Text>
                <Text color="fg.muted" className='font-inter'>
                    Already have an account? <Link className='font-bold' href="/login">Login</Link>
                </Text>
            </Stack>
        </Stack>
        <Box
            as="form"
            onSubmit={handleSubmit}
            py={{
                base: '0',
                sm: '8',
            }}
            px={{
                base: '4',
                sm: '10',
            }}
            bg={{
                base: 'transparent',
                sm: 'bg.surface',
            }}
            boxShadow={{
                base: 'none',
                sm: 'md',
            }}
            borderRadius={{
                base: 'none',
                sm: 'xl',
            }}
            
        >
            <Stack spacing="6">
                <Stack spacing="5">
                    <FormControl>
                        <FormLabel htmlFor="username">Username</FormLabel>
                        <Input variant='filled' onChange={handleName} id="username" type="username" />
                        <FormLabel  htmlFor="email">Email</FormLabel>
                        <Input variant='filled' onChange={handleEmail} id="email" type="email" />
                    </FormControl>
                    <PasswordField value={password} onChange={handlePasswordChange}/>
                </Stack>
                <HStack justify="space-between">
                    <Checkbox defaultChecked>Remember me</Checkbox>
                    <Button variant="text" size="sm">
                        Forgot password?
                    </Button>
                </HStack>
                <Stack spacing="6">
                    <Button className="duration-300 hover:text-[#5573FC]" type='submit'>Create an account</Button>
                    <HStack>
                        <Divider />
                        <Text textStyle="sm" whiteSpace="nowrap" color="fg.muted">
                            or continue with
                        </Text>
                        <Divider />
                    </HStack>
                    <OAuthButtonGroup />
                </Stack>
            </Stack>
        </Box>
    </Stack>
</Container>
   )
}

export default SignUp;