import UsersBar from "../usersBar/usersBar";

export default function SearchBar({setInputNick,inputNick}){
    return(
        <>
        <UsersBar setInputNick={setInputNick} inputNick={inputNick} />
        </>
    )
}