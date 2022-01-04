const users = [{ id: 1, username: 'test', password: 'test1', firstName: 'Test', lastName: 'User', uploadedFiles: ["QmRtQDiG88LMX49QetjeWYaJsbyDDb7cYTFmx2bvoxcBmg"] }];

async function login({ username, password }) {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}


const getUserById = () => { }

module.exports = {
    login,
    users
}