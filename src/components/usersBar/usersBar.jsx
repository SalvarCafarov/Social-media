import { getUser, getUsers } from "@/lib/firebase";
import { useEffect,useState } from "react";
import UserBar from "../userBar/userBar";
import styles from './usersBar.module.scss'
export default function UsersBar({setInputNick,inputNick}){
    const [users, setUsers] = useState([])
    useEffect (()=>{
        async function getData(){
            let usersData= await getUsers()
            let userNick = localStorage.getItem('USER')
            let newArray=[]
           Object.entries(usersData).forEach((item)=>{
            if(item[1].nickName.toLowerCase().includes(inputNick) &&(userNick !== item[0])){
                newArray.push(item[1])
                setUsers(newArray)
            }
           })
           console.log(users);
        }
        setUsers([])

        if(inputNick){
            getData()
        }
        else{
            setUsers([])
        }

    },[inputNick])
    return(
        <>{inputNick!=''?<div className={styles.usersBar}>
        {users!=[] ? users?.map(user=>(
            <UserBar setInputNick={setInputNick} user={user} key={user.nickName}/>
        )):''}
    </div>:""}
        
        
        </>
    )
}