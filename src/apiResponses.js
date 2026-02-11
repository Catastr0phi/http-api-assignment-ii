const users = {}

// Common function for sending a response
const respond = (request, response, status, object) => {
    console.log(object);

    response.writeHead(status, {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(object, 'utf8'),
    });

    response.write(object);
    response.end();
}

const getUsers = (request, response) => {
    const usersJSON = JSON.stringify(users);
    
    respond(request, response, 200, usersJSON);
}

const addUser = (request, response) => {
    // Default to success message
    const responseJSON = {
        message: 'Created successfully'
    };

    // get name and body from request
    const { name, age } = request.body;

    // check for both fields, send appropriate response if missing
    if (!name || !age) {
        responseJSON.message = 'Name and age are both required.';
        responseJSON.id = 'missingParams';

        respond(request, response, 400, responseJSON);

        return;
    }

    let code = 204;

    // Check for existing name
    if (!users[name]){
        // If name doesnt exist, create user and update code
        users[name] = {
            name: name
        }

        code = 201;
    }

    users[name].age = age;

    // Send response based on code
    if (code == 201) respond(request, response, code, responseJSON);
    else respond(request, response, code, {}); // 204 has no response body
}

module.exports = {
    getUsers,
    addUser
}