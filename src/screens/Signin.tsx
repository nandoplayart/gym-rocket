import { View, Text } from 'react-native'
import React from 'react'
import {VStack, Image} from 'native-base'
import backgroundImg from '@assets/background.png'

export default function Signin() {
  return (
    <VStack flex={1} bg="gray.700">
        <Image source={backgroundImg} 
            alt="Pessoas treinando" 
            resizeMode='contain'
            position='absolute' />
    </VStack>
  )
}