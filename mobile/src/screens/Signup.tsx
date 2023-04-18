import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import {VStack, Image,Text, Center, Heading, ScrollView, useToast} from 'native-base'
import {useForm,Controller} from 'react-hook-form'
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup'

import backgroundImg from '@assets/background.png'
import LogoSvg from '@assets/logo.svg'
import Input from '@components/Input'
import Button from '@components/Button'
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { useAuth } from '@hooks/useAuth';


type FormDataProps = {
  name: string;
  email:string;
  password:string;
  password_confirm:string
}


const signUpSchema = yup.object({
    name: yup.string().required('Informe o nome'),
    email: yup.string().required('Informe o e-mail').email('E-mail inválido'),
    password: yup.string().required("Informe a senha").min(6,"A senha deve conter pelo menos 6 digitos"),
    password_confirm: yup.string().required("Confirme a senha").oneOf([yup.ref('password')], 'A confirmação da senha não confere.')
});

export default function Signup() {

  const [isLoading,setLoading] = useState(false);
  const {signIn} = useAuth();
  const toast = useToast();
  const navigation = useNavigation();
  const {control, handleSubmit,reset, formState: {errors}} = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema)
  });

  const handleGoBack = ()=>{
    navigation.goBack();
  }

  const handleCreateAccount = async ({name, email, password}:FormDataProps)=>{
    try{
      setLoading(true);
      const response =  await api.post('/users',{name, email, password});
      signIn(email, password);
    }catch(error){
      setLoading(false);
      const isAppError = error  instanceof AppError;
      const title = isAppError? error.message: 'Não foi possível criar a conta. Tente novamente mais tarde.'
      toast.show({
        title: title,
        placement: 'top',
        bgColor: 'red.500'
      });
    }
  }

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}} showsVerticalScrollIndicator={false}>
        <VStack flex={1}  px={10}>
            <Image 
                defaultSource={backgroundImg}
                source={backgroundImg} 
                alt="Pessoas treinando" 
                resizeMode='contain'
                position='absolute' />
                <Center my={24}>
                    <LogoSvg />
                    <Text color="gray.100" fontSize="sm">Treine sua mente e seu corpo</Text>
                </Center>
                <Center>
                    <Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
                      Crie sua conta
                    </Heading>
                    <Controller 
                       name='name'
                       control={control}
                       render={({field: {onChange, value}}) =>(
                          <Input 
                            placeholder='Nome' 
                            onChangeText={onChange}
                            value={value}
                            errorMessage={errors?.name?.message}
                            />
                       )}
                    />  
                   <Controller 
                       name='email'
                       control={control}
                       render={({field: {onChange, value}}) =>(
                        <Input 
                        placeholder='E-mail' 
                        keyboardType='email-address'
                        autoCapitalize='none' 
                        onChangeText={onChange}
                        value={value}
                        errorMessage={errors?.email?.message}
                        />
                       )}
                    />
                    <Controller 
                       name='password'
                       control={control}
                       render={({field: {onChange, value}}) =>(
                            <Input 
                              placeholder='Senha' 
                              secureTextEntry
                              onChangeText={onChange}
                              value={value}
                              errorMessage={errors?.password?.message}
                              />
                       )}
                    />
                    <Controller 
                       name='password_confirm'
                       control={control}
                       render={({field: {onChange, value}}) =>(
                            <Input 
                              placeholder='Confirme a senha' 
                              secureTextEntry
                              onChangeText={onChange}
                              value={value}
                              onSubmitEditing={handleSubmit(handleCreateAccount)}
                              returnKeyType='send'
                              errorMessage={errors?.password_confirm?.message}
                              />
                       )}
                    />

                    <Button title='Criar e acessar' isLoading={isLoading} onPress={handleSubmit(handleCreateAccount)} />
                </Center> 
                <Button title='Voltar para o login' variant="outline" mt={24} onPress={handleGoBack} />
        </VStack>
    </ScrollView>
  )
}