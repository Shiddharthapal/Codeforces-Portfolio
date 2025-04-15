export const userData=async ()=>{
    const alldataResponse = await fetch("/api/allUser");
    if(!alldataResponse.ok) {
        throw new Error("Failed to fetch data");
    }
    let data= await alldataResponse.json();
    return data.userDetails;

}
    
