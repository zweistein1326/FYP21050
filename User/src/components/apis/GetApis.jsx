import axios from 'axios';

const baseUrl = "http://127.0.0.1:8000/"


export const getCredentialsByUser = async (id)=>{
    const retrievedString = localStorage.getItem('user') || '';
    const user = JSON.parse(retrievedString);
    const res = await axios.get(baseUrl+'getFilesByUser?userId='+user.user.id)
    console.log(res.data,baseUrl+'getFilesByUser?userId'+user.user.id);
}