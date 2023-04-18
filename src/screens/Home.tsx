import React, { useCallback, useEffect, useState } from 'react'
import { Center, HStack, Text, VStack, FlatList, Heading, useToast } from 'native-base'
import { useNavigation, useFocusEffect } from '@react-navigation/native'

import HomeHeader from '@components/HomeHeader'
import Group from '@components/Group'
import ExerciseCard from '@components/ExerciseCard'
import { AppNavigatorRoutesProps } from '@routes/app.routes'
import { AppError } from '@utils/AppError'
import { api } from '@services/api'
import { ExerciseDTO } from 'src/dto/ExerciseDTO'
import Loading from '@components/Loading'


const Home = () => {
  const [isLoading, setLoading] =useState(true);
  const [groups,setGroups] = useState<string[]>([])
  const [groupSelected, setGroupSelected] = useState('antebraço');
  const [exercises, setExercises] = useState<ExerciseDTO[]>([]);
  const toast = useToast();
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  
  const handleOpenExercisesDetails = (id:string)=>{
    navigation.navigate('exercise',{id: id});
  }

  const loadGroups = async()=>{
     try{
        
        const response = await api.get('/groups');
        setGroups(response.data);
        
     }catch(error){

      const isAppError = error instanceof AppError;
      const title = isAppError? error.message: 'Não foi possivel carregar os grupos musculares.';
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
     }
  }

  const loadExercisesByGroup = async()=>{
    try{
      setLoading(true);
       const response = await api.get(`/exercises/bygroup/${groupSelected}`);
       setExercises(response.data);
       
    }catch(error){

     const isAppError = error instanceof AppError;
     const title = isAppError? error.message: 'Não foi possivel carregar os exercicios.';
     toast.show({
       title,
       placement: 'top',
       bgColor: 'red.500'
     })
    }finally{
      setLoading(false);
    }
 }

  useEffect(()=>{
    loadGroups();
  },[]);

  useFocusEffect(useCallback(() => {
    loadExercisesByGroup();
  },[groupSelected]));

  return (
    <VStack flex={1}>
       <HomeHeader />

       <FlatList
       data={groups}
       keyExtractor={(item)=> item}
       horizontal
       my={10}
       maxH={10}
       minH={10}
       showsHorizontalScrollIndicator={false}
       _contentContainerStyle={{px: 8}}
       renderItem={({item}) => (
          <Group 
          name={item} 
          isActive={String(groupSelected).toUpperCase() === String(item).toUpperCase()} 
          onPress={ ()=> setGroupSelected(item)} />
        )}
       />
        {
          isLoading ? <Loading /> : <VStack flex={1} px={8}>
                                            <HStack justifyContent="space-between" mb={5}>
                                              <Heading color="gray.200" fontSize="md">Exercícios</Heading>
                                              <Text color="gray.200" fontSize="sm">{exercises.length}</Text>
                                            </HStack>

                                            <FlatList
                                                data={exercises}
                                                showsVerticalScrollIndicator={false}
                                                _contentContainerStyle={{
                                                  paddingBottom: 20
                                                }}
                                                keyExtractor={(item) => item.id}
                                                renderItem={({item}) => (
                                                      <ExerciseCard data={item} onPress={()=> handleOpenExercisesDetails(item.id)} />
                                                )}
                                            />
        </VStack> 
        }
    </VStack>
  )
}

export default Home