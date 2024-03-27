const axios = require('axios');
const { response } = require('express');

const url = `http://localhost:8000/url?url=http://www.google.com?query=tell+me+about+number+`;
const postUrl = `http://localhost:8000/url`;
const jsonData={
    'url': 'https://www.google.com',
};

for (var i = 0; i < 10000; i++) {

    axios.post(postUrl,jsonData)
    .then(response=>{
        console.log('ShortId : ',response.data.id);
    })
    .catch(error=>{
        throw new Error('Some Error!');
    })
}

// axios.get(url + i)
//     .then(response => {
//         if (response.status !== 200) {
//             throw new Error('Error from Server!');
//         }
//         return response.data; // Axios automatically parses JSON response
//     })
//     .then(data => {
//         console.log('ShortId generated as: ', data.id);
//     })
//     .catch(error => {
//         console.log('Error while request:', error.message);
//     });