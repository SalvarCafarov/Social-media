export default function Search ({inputNick,getInputValue}){
    return (
        <input value={inputNick} type="search" placeholder="search" onChange={(e)=>{
            getInputValue(e.target.value.toLowerCase())
        }} />
    )
}