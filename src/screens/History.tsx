import React, { useCallback, useState } from 'react'
import { Center, Heading, Text, VStack, SectionList, useToast, Box } from 'native-base'
import ScreenHeader from '@components/ScreenHeader'
import HistoryCard from '@components/HistoryCard'
import { AppError } from '@utils/AppError'
import { api } from '@services/api'
import { useFocusEffect } from '@react-navigation/native'
import { HistoryGroupByDayDTO } from 'src/dto/HistoryGroupByDayDTO'

const History = () => {

  const [isLoading, setLoading] =useState(true);
  const toast = useToast();
  const [exercises, setExercises] = useState<HistoryGroupByDayDTO[]>([]);


  const loadHistory = async ()=>{
    try{
      setLoading(true);
      const response =  await api.get('/history');
      setExercises(response.data);
    }catch(error){
      const isAppError = error instanceof AppError;
      const title = isAppError? error.message: 'Não foi possivel carregar o histórico de exercícios.';
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      });
    }finally{
      setLoading(false);
    }
  }


  useFocusEffect(useCallback(() => {
    loadHistory();
  },[]));

  return (
    <VStack flex={1}>
       <ScreenHeader title="Histórico de Exercicios" />
       <SectionList 
       sections={exercises}
       keyExtractor={item => item.id}
       renderSectionHeader={({section}) => (
          <Heading color="gray.100" fontSize="md" mt={10} mb={3}>
            {section.title}
          </Heading>
          )}
       renderItem={ ({item}) =>(
            <HistoryCard data={item} />
       )}
       ListEmptyComponent={() => (
       <Text color="gray.100" textAlign="center">
          Não há exercícios registrados ainda.{'\n'}
          Vamos fazer exercícios hoje?
       </Text>)}
       contentContainerStyle={exercises.length === 0 && {flex: 1, justifyContent: "center"}}
       px={8}
       showsVerticalScrollIndicator={false}
       />

       
    </VStack>
  )
}

export default History