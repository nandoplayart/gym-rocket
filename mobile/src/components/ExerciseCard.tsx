
import React from 'react'
import { HStack, Heading, Image, Text, VStack,Icon } from 'native-base'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'
import {Entypo} from '@expo/vector-icons'
import { ExerciseDTO } from 'src/dto/ExerciseDTO'
import { api } from '@services/api'

type Props = TouchableOpacityProps & {
    data: ExerciseDTO
}

const ExerciseCard = ({data,...rest}:Props) => {
  return (
    <TouchableOpacity
    {...rest}>
        <HStack bg="gray.500" alignItems="center" p={2} pr={4} rounded="md" mb={3}>
               <Image 
                    w={16}
                    h={16}
                    resizeMode='cover'
                    rounded="md"
                    mr={4}
                    source={{
                    uri: `${api.defaults.baseURL}/exercise/thumb/${data.thumb}`
                    }} 
                    alt='exercicio'
                /> 
                <VStack flex={1}>
                    <Heading fontSize="lg" color="white">
                        {data.name}
                    </Heading>
                    <Text fontSize="sm" color="gray.200" mt={1} numberOfLines={2}>
                        {data.series} séries x {data.repetitions} repetições
                    </Text>
                </VStack>
                <Icon as={Entypo} name='chevron-thin-right' color="gray.300" />
        </HStack>
    </TouchableOpacity>
  )
}

export default ExerciseCard