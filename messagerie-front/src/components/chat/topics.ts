const getTopics = async () => {

    const requestOptions = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    };
    const response = await (fetch('http://localhost:8080/getTopics', requestOptions));
    return response.json();
}

const getUserTopics = async (username : string) => {
    const requestOptions = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    };
    if(username==="")
        return [];
    const response = await (fetch('http://localhost:8080/getTopics?username=' + username, requestOptions));
    const responseJson = response.json();
    console.log(responseJson);
    return responseJson;
}


export {
    getTopics,
    getUserTopics
};