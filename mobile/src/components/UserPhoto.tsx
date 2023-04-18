
import { Image, IImageProps } from 'native-base'
import React from 'react'


type Props = IImageProps & {
    size: number;
}

const UserPhoto = ({size, ...rest}: IImageProps) => {
  return (
    <Image w={size} height={size} rounded={"full"} borderWidth={2} borderColor="gray.400" {...rest}/>
  )
}

export default UserPhoto