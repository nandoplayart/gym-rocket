
import { HStack, Heading, VStack,Text } from 'native-base'
import React from 'react'
import { HistoryDTO } from 'src/dto/HistoryDTO'

type HistoryCadProps = {
  data: HistoryDTO
}

const HistoryCard = ({data}: HistoryCadProps) => {
  return (
    <HStack w="full" px={5} py={4} mb={3} bg="gray.600"  alignItems="center" justifyContent="space-between">
        <VStack mr={5} flex={1}>
            <Heading color="white" fontSize="md" fontFamily="heading" textTransform="capitalize" numberOfLines={1}>
                {data.group}
            </Heading>
            <Text color="gray.100" fontSize="lg" numberOfLines={1}>
                {data.name}
            </Text>
        </VStack>
        <Text color="gray.300" fontSize="md">
           {data.hour}
        </Text>
    </HStack>
  )
}

export default HistoryCard