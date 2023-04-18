import { api } from "@services/api";
import { storageTokenGet, storageTokenRemove, storageTokenSave } from "@storage/storageAuthToken";
import { storageUserGet, storageUserRemove, storageUserSave } from "@storage/storageUser";
import { ReactNode, createContext, useEffect, useState } from "react";
import { UserDTO } from "src/dto/UserDTO";


export type AuthContextDataProps = {
    user:UserDTO,
    signIn: (email:string, password:string) => Promise<void>,
    signOut: ()=> Promise<void>,
    updateUserProfile: (user:UserDTO) => Promise<void>,
    isLoadingUserStorageData: boolean
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);



type Props =  {
    children: ReactNode
}

export const AuthContextProvider = ({children}:Props)=>{

    const [user,setUser] = useState<UserDTO>({} as UserDTO);
    const [isLoadingUserStorageData, setLoadingUserStorageData] = useState(true);

    const storageUserAndToken = async(user:UserDTO, token:string)=>{
        try{
        setLoadingUserStorageData(true);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(user);
        await storageUserSave(user);
        await storageTokenSave(token);
        }catch(error){
            throw error;
        }finally{
            setLoadingUserStorageData(false);
        }
    }

    const signIn = async (email:string, password:string)=>{
        try{
            const {data} = await api.post('/sessions', {email,password});
            if(data.user && data.token){
             await storageUserAndToken(data.user, data.token);
            } 
        }catch(error){
            throw error;
        }
    }

    const signOut = async ()=>{
        try{
            setLoadingUserStorageData(true);
            setUser({} as UserDTO);
            await storageUserRemove();
            await storageTokenRemove();
        }catch(error){
            throw error;
        }finally{
            setLoadingUserStorageData(false);
        }
    }

    const updateUserProfile  = async (userUpdated:UserDTO)=>{
        try{
            setUser(userUpdated);
            await storageUserSave(userUpdated);
        }catch(error){
            throw error;
        }
    }
    
    const loadUserData = async ()=>{
        try{
            const userLogged = await storageUserGet();
            const token =  await storageTokenGet();

            if(userLogged){
                setUser(userLogged);
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }
        }catch(error){
            throw error
        }finally{
            setLoadingUserStorageData(false);
        }
    }

    useEffect(()=>{
        loadUserData();
    },[])

    return (
        <AuthContext.Provider value={{user, signIn,signOut,updateUserProfile, isLoadingUserStorageData}}>
             {children}
          </AuthContext.Provider>
    )
}
