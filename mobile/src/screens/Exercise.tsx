import React, { useEffect, useState } from 'react'
import { Center, HStack, Heading, Icon, Text, VStack,Image, Box, ScrollView, useToast } from 'native-base'
import { TouchableOpacity } from 'react-native'
import {Feather} from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { AppNavigatorRoutesProps } from '@routes/app.routes'
import BodySvg from '@assets/body.svg'
import SeriesSvg from '@assets/series.svg'
import RepetitionsSvg from '@assets/repetitions.svg'
import Button from '@components/Button'
import { api } from '@services/api'
import { AppError } from '@utils/AppError'
import Loading from '@components/Loading'
import { ExerciseDTO } from 'src/dto/ExerciseDTO'


type RoutePropsParams = {
  id:string
}

const Exercise = () => {

  const [exercise,setExercise] = useState<ExerciseDTO>({} as ExerciseDTO);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const route = useRoute();
  const toast = useToast();
  const [isLoading, setLoading] =useState(true);
  const [isSendingRegister, setSendingRegister] =useState(false);
  const {id} = route.params as RoutePropsParams;

  const handleGoBack = ()=>{
      navigation.goBack();
  }

  const loadExercice = async ()=>{
    try{
      setLoading(true);
      const response = await api.get(`/exercises/${id}`);
      setExercise(response.data);
    }catch(error){

      const isAppError = error instanceof AppError;
      const title = isAppError? error.message: 'Não foi possivel carregar os detalhes do exercício.';
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    }finally{
      setLoading(false);
    }
  }

  const handleAddExercise = async ()=>{
    try{
      setSendingRegister(true);
      await api.post('/history',{exercise_id: id});
      toast.show({
        title: 'Parabéns! Exercicio registrado no seu histórico',
        placement: 'top',
        bgColor: 'green.700'
      });
      navigation.navigate('history');
    }catch(error){

      const isAppError = error instanceof AppError;
      const title = isAppError? error.message: 'Não foi possivel registrar o exercício.';
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      });
    }finally{
      setSendingRegister(false);
    }
  }

  useEffect(()=>{
    loadExercice();
  },[id]);

  return (
    <VStack flex={1}>
      <VStack px={8} bg="gray.600" pt={12}>
            <TouchableOpacity onPress={handleGoBack}>
              <Icon as={Feather} name="arrow-left" color="green.500" size={6} />
            </TouchableOpacity>
            <HStack justifyContent="space-between" mt={4} mb={8} alignItems="center">
              <Heading color="gray.100" fontSize="lg" flexShrink={1}>
                {exercise.name}
              </Heading>
              <HStack alignItems="center">
                <BodySvg />
                <Text color="gray.200" ml={1} textTransform="capitalize">
                  {exercise.group}
                </Text>
              </HStack>
            </HStack>
      </VStack>
      {isLoading ? <Loading /> : 
                      <ScrollView>
                          <VStack p={8}>
                            <Box  mb={3} rounded="lg" overflow="hidden">
                              <Image 
                                w="full" 
                                h={80} 
                                source={{uri:`${api.defaults.baseURL}/exercise/demo/${exercise.demo}`}} 
                                alt='Nome do exercício'
                              
                                resizeMode='cover'
                                rounded="lg"
                                />
                            </Box>
                            <Box bg="gray.600" rounded="md" pb={4} px={4}>
                              <HStack alignItems="center" justifyContent="space-around" mb={6} mt={5}>
                                <HStack>
                                <SeriesSvg />
                                  <Text color="gray.200" ml={2}>{exercise.series} séries</Text>
                                </HStack>
                                <HStack>
                                  <RepetitionsSvg />
                                  <Text color="gray.200" ml={2}>{exercise.repetitions} repetições</Text>
                                </HStack>
                              </HStack> 
                              <Button title='Marcar como realizado' isLoading={isSendingRegister} onPress={handleAddExercise} />
                            </Box>
                          </VStack>
                      </ScrollView>
      }
    </VStack>
  )
}

export default Exercise