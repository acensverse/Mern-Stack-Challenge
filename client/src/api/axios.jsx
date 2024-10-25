import axios from 'axios';

export default axios.create({
    baseURL: 'https://mern-stack-challenge-server.vercel.app/'
});