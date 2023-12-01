function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

var authToken = getQueryParam('authToken');

if (authToken) {
    console.log("Authentication token found: ");
} else {
    console.log("Authentication token not found.");
}



const apiUrl = `https://houseofwisdom.onrender.com/users/user`;

fetch(apiUrl, {
    method: 'GET',
    headers: {
        'Authorization': `${authToken}`,
        'Content-Type': 'application/json',
    },
})
    .then(response => response.json())
    .then(data => {
        document.getElementById("fullName").textContent = data.fullName;
        document.getElementById("photoId").src = data.photourl;
    })
    .catch(error => {
        console.log(error.message);
    });