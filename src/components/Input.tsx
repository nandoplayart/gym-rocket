import { Input as InputNativeBase, IInputProps, FormControl } from 'native-base'
import React from 'react'

type Props = IInputProps &{
  errorMessage?:string | null
}

const Input = ({errorMessage = null, isInvalid, ...rest}: Props) => {
  const invalid = !!errorMessage || isInvalid; 
  return (
    <FormControl isInvalid={invalid} mb={4}>
        <InputNativeBase 
        bg="gray.700"
        h={14}
        px={4}
        borderWidth={0}
        fontSize="md"
        color="white"
        fontFamily="body"
        isInvalid={invalid}
        _invalid={{
          borderWidth: 1,
          borderColor: "red.500"
        }}
        placeholderTextColor="gray.300"
        _focus={{
            bg: "gray.700",
            borderWidth: 1,
            borderColor: "green.500"
        }}
        {...rest}
    />
    <FormControl.ErrorMessage _text={{color: 'red.500'}}>
      {errorMessage}
    </FormControl.ErrorMessage>
    </FormControl>
  )
}

export default Input