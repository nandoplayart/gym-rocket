
import React from 'react'
import {MaterialIcons} from '@expo/vector-icons';
import { HStack, Heading, Text, VStack, Icon } from 'native-base'

import UserPhoto from './UserPhoto'
import { TouchableOpacity } from 'react-native';
import { useAuth } from '@hooks/useAuth';
import userPhotoDefaultImg from '@assets/userPhotoDefault.png';
import { api } from '@services/api';

const HomeHeader = () => {

  const {user, signOut} = useAuth();  

  return (
    <HStack bg="gray.600" pt={16} pb={5} px={8} alignItems="center">
        <UserPhoto 
            source={user.avatar? {uri: `${api.defaults.baseURL}/avatar/${user.avatar}`} : userPhotoDefaultImg } 
            size={16} 
            mr={4}
            alt='Luiz' />
        <VStack flex={1}>
            <Text color="gray.100" fontSize="md">Olá,</Text>
            <Heading color="gray.100" fontSize="md" fontFamily="heading">{user.name}</Heading>
        </VStack>
        <TouchableOpacity onPress={signOut}>
            <Icon as={MaterialIcons} name='logout' color="gray.200" size={7} />
        </TouchableOpacity>
        
    </HStack>
   
  )
}

export default HomeHeader