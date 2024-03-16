import {
    Box,
    Button,
    Checkbox,
    Container,
    Divider,
    FormControl,
    FormLabel,
    InputGroup,
    HStack,
    Input,
    Link,
    InputRightElement,
    IconButton,
    Stack,
    Text,
    
} from '@chakra-ui/react'
import { HiEye, HiEyeOff } from 'react-icons/hi'
import React from 'react'
import { useState } from 'react'
import { useAuth } from '../assets/AuthProvider'
import { useDisclosure } from '@chakra-ui/react'
import { OAuthButtonGroup } from './OAuthButtonGroup'
const url = "http://localhost:3000/users/login";




function LogIn() {
    const { isOpen, onToggle } = useDisclosure()
    const [input, setInput] = useState({
        email: "",
        password: "",
      });

      const onClickReveal = () => {
        onToggle()
      }
    

    const handleInput = (e) => {
        const { name, value } = e.target;
        setInput((prev) => ({
          ...prev,
          [name]: value,
        }));
      };
    

    const auth = useAuth();

    const handleSubmitEvent = async (e) => {
        e.preventDefault();
        console.log(input.email, input.password);
        if (input.email !== "" && input.password !== "") {
            try {
                await auth.loginAction(input);
                if(auth.error){
                    console.log(auth.error);
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            alert("Please provide a valid input");
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
    <Stack spacing="4" class='magic' className='shadow-lg'>
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
                    Log in to your account
                </Text>
                <Text color="fg.muted" className='font-inter'>
                    Don't have an account? <Link className='font-bold' href="/signup">Sign up</Link>
                </Text>
            </Stack>
        </Stack>
        <Box
            as="form"
            onSubmit={handleSubmitEvent}
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
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <Input variant='filled'  onChange={handleInput} name="email" id="email" type="email" />
                    </FormControl>
                    
                    <FormControl>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <InputGroup>
                        <InputRightElement>
                            <IconButton
                            variant="text"
                            aria-label={isOpen ? 'Mask password' : 'Reveal password'}
                            icon={isOpen ? <HiEyeOff /> : <HiEye />}
                            onClick={onClickReveal}
                            />
                        </InputRightElement>
                        <Input
                            variant='filled' 
                            id="password"
                            onChange={handleInput}
                            name="password"
                            type={isOpen ? 'text' : 'password'}
                            autoComplete="current-password"
                            required
                        />
                        </InputGroup>
                    </FormControl>


                </Stack>
                <HStack justify="space-between">
                    <Checkbox defaultChecked>Remember me</Checkbox>
                    <Button variant="text" size="sm">
                        Forgot password?
                    </Button>
                </HStack>
                <Stack spacing="6">
                    <Button type="submit">Sign in</Button>
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

export default LogIn;