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
import { AuthNavigatorRoutesProps } from '@routes/auth.routes'
import { useAuth } from '@hooks/useAuth';
import { AppError } from '@utils/AppError';
import { AppNavigatorRoutesProps } from '@routes/app.routes';

type FormDataProps = {
  email:string;
  password:string;
}

const signInSchema = yup.object({
    email: yup.string().required('Informe o e-mail').email('E-mail inválido'),
    password: yup.string().required("Informe a senha")
});

export default function Signin() {

  const toast = useToast();
  const {signIn} = useAuth();
  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const {control,handleSubmit,reset, formState: {errors}} = useForm<FormDataProps>({
    resolver: yupResolver(signInSchema)
  });

  const [isLoading,setLoading] = useState(false);


  const handlerNewAccount = ()=>{
    navigation.navigate('signup');
  }

  const handlerSignIn = async ({email, password}: FormDataProps)=>{
    try{
      setLoading(true);
      await signIn(email, password);
      

    }catch(error){
      setLoading(false);
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message: 'Não foi possivel acessar, tente novamente mais tarde.';
      toast.show({
        title: title,
        placement: 'top',
        bgColor: 'red.500'
      })
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
                      Acesse sua conta
                    </Heading>
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
                      <Button title='Acessar' isLoading={isLoading} onPress={handleSubmit(handlerSignIn)} />

                    
                </Center>
                <Center mt={24}>
                  <Text color="gray.100" fontSize="sm" mb={3} fontFamily="body">
                    Ainda não tem acesso?
                  </Text>
                </Center>
                
                <Button title='Criar conta' variant="outline" onPress={handlerNewAccount} />
        </VStack>
    </ScrollView>
  )
}