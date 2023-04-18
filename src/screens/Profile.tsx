import React, { useState } from 'react'
import { TouchableOpacity,Alert } from 'react-native';
import { Center, ScrollView, Text, VStack, Skeleton, Heading, useToast } from 'native-base'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup'
import {Controller, useForm} from 'react-hook-form'

import userPhotoDefaultImg from '@assets/userPhotoDefault.png';
import ScreenHeader from '@components/ScreenHeader'
import UserPhoto from '@components/UserPhoto'
import Input from '@components/Input';
import Button from '@components/Button';
import { useAuth } from '@hooks/useAuth';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';

const PHOTO_SIZE = 33;


type FormDataProps = {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirm:string;
}

const profileSchema = yup.object({
  name: yup.string().required('Informe o nome.'),
  password: yup.string()
    .min(6, 'A senha deve ter ter pelo menos 6 dígitos')
    .nullable()
    .transform((value) => !!value ? value: null),
    password_confirm: yup
    .string()
    .nullable()
    .transform((value) => !!value ? value: null)
    .oneOf([yup.ref('password'), null],'A confirmação da senha não confere.')
    .when('password', {
      is: (Field: any) => Field,
      then: () => yup
        .string()
        .nullable()
        .required('Informe a confirmação da senha.')
        .transform((value) => !!value ? value: null)
    }),
})

const Profile = () => {

  const [isUpdating,setUpdating] = useState(false);
  const [photoIsLoading, setphotoLoading] = useState(false);
  const toast = useToast();
  const {user,updateUserProfile} = useAuth();
  const {control, handleSubmit, formState: {errors}} = useForm<FormDataProps>({
    resolver: yupResolver(profileSchema),
    defaultValues:{
      name: user.name,
      email: user.email
    }
  });

  const handleUpateProfile = async (data: FormDataProps)=>{
    try{
      setUpdating(false);
      await api.put('/users', data);
      toast.show({
        title: 'Perfil atualizado com sucesso',
        placement: 'top',
        bgColor: 'green.500'
      });
      const userUpdated = user;
      userUpdated.name = data.name;
      await updateUserProfile(userUpdated);
    }catch(error){
      const isAppError = error  instanceof AppError;
      const title = isAppError? error.message: 'Não foi possível atualizar o perfil. Tente novamente mais tarde.'
      toast.show({
        title: title,
        placement: 'top',
        bgColor: 'red.500'
      });
    }finally{
      setUpdating(false);
    }
  }

  const handleUserPhotoSelect = async ()=>{
    setphotoLoading(true);
    try{
      let photoLarge = false;
      const photoSelected:ImagePicker.ImagePickerResult  = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4,4],
        allowsEditing: true
      });
      if(photoSelected.canceled)
        return;
      if(photoSelected.assets[0].uri){
        const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri);
        photoLarge = photoInfo.size && (photoInfo.size / 1024 /1024) > 3;
        if(photoLarge){
          toast.show({
            title: 'Essa imagem é muito grande. Escolha uma de até 3MB',
            placement: 'top',
            bg: 'red.500',
            duration: 2000
          })
        }
      }
      if(photoLarge) return;

      const fileExtension = photoSelected.assets[0].uri.split('.').pop();
      const photoFile = {
        name: `${user.name}.${fileExtension}`.toLowerCase(),
        uri: photoSelected.assets[0].uri,
        type: `${photoSelected.assets[0].type}/${fileExtension}`
      } as any;

      const userPhotoUploadForm = new FormData();
      userPhotoUploadForm.append('avatar', photoFile);
      const response = await api.patch('/users/avatar', userPhotoUploadForm,{
          headers:{
            'Content-Type' : 'multipart/form-data'
          }
      });

      const userUpdated = user;
      userUpdated.avatar = response.data.avatar;
      await updateUserProfile(userUpdated);
      
      toast.show({
        title: 'Foto atualizada',
        placement: 'top',
        bgColor: 'green.500'
      });

      //setUserPhoto(photoSelected.assets[0].uri);



    }catch(error){
        console.log(error);
    }finally{
      setphotoLoading(false);
    }
  }

  return (
    <VStack flex={1}>
       <ScreenHeader title='Perfil' />
       <ScrollView contentContainerStyle={{paddingBottom: 36}}>
        <Center mt={6} px={10}>
          {
            photoIsLoading ? <Skeleton w={PHOTO_SIZE} h={PHOTO_SIZE} rounded="full" startColor="gray.500" endColor="gray.400" /> :
            <UserPhoto 
                size={PHOTO_SIZE}
                source={user.avatar? {uri: `${api.defaults.baseURL}/avatar/${user.avatar}`} : userPhotoDefaultImg } 
                alt='Foto do usuário'
                    />        
          }
          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text 
              color="green.500" 
              fontWeight="bold" 
              fontSize="md" 
              mt={2} 
              mb={8}>Alterar foto</Text>
          </TouchableOpacity>
          
          <Controller
          control={control}
          name='name'
          render={({field: {value, onChange}}) => (
              <Input placeholder='Nome' bg="gray.600" value={value} onChangeText={onChange} errorMessage={errors.name?.message} />
          )}
          />

          <Controller
          control={control}
          name='email'
          render={({field: {value, onChange}}) => (
            <Input placeholder='E-mail' bg="gray.600" isDisabled  value={value} onChangeText={onChange}/>
          )}
          />
        
         
          <Heading color="gray.200" fontSize="md" alignSelf="flex-start" mt={12} mb={2}>
              Alterar senha
          </Heading>

          <Controller
          control={control}
          name='old_password'
          render={({field: {value, onChange}}) => (
            <Input placeholder='Senha antiga' secureTextEntry bg="gray.600" value={value} onChangeText={onChange}  errorMessage={errors.old_password?.message} />
          )}
          />

          <Controller
          control={control}
          name='password'
          render={({field: {value, onChange}}) => (
            <Input placeholder='Nova senha' secureTextEntry bg="gray.600" value={value} onChangeText={onChange}  errorMessage={errors.password?.message} />
          )}/>

          <Controller
          control={control}
          name='password_confirm'
          render={({field: {value, onChange}}) => (
            <Input placeholder='Confirme a nova senha' secureTextEntry bg="gray.600" value={value} onChangeText={onChange}  errorMessage={errors.password_confirm?.message} />
          )}/>

          <Button title='Atualizar' mt={4} onPress={handleSubmit(handleUpateProfile)} isLoading={isUpdating} />
          </Center>
       </ScrollView>
    </VStack>
  )
}

export default Profile