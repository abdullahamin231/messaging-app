import {
    FormControl,
    FormLabel,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    useDisclosure,
    useMergeRefs,
  } from '@chakra-ui/react'
  import { forwardRef, useRef } from 'react'
  import { HiEye, HiEyeOff } from 'react-icons/hi'
  import React from 'react'
  import { useState } from 'react'
  
  export const PasswordField = forwardRef(({ onChange, ...props }, ref) => {
    const { isOpen, onToggle } = useDisclosure()
    const inputRef = useRef(null)
    const mergeRef = useMergeRefs(inputRef, ref)
    const onClickReveal = () => {
      onToggle()
      if (inputRef.current) {
        inputRef.current.focus({
          preventScroll: true,
        })
      }
    }
    return (
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
            id="password"
            ref={mergeRef}
            onChange={onChange}
            name="password"
            type={isOpen ? 'text' : 'password'}
            autoComplete="current-password"
            required
            variant='filled'
            {...props}
          />
        </InputGroup>
      </FormControl>
    )
  })
  PasswordField.displayName = 'PasswordField'