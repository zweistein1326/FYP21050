pragma solidity >=0.4.22 <0.9.0;

contract Users{
    struct User{
        uint id;
        string username;
        string password;
    }

    uint public userCount = 0;

    mapping(uint => User) users;

    function createNewUser(string memory username, string memory password) public {
        userCount++;
        users[userCount] = User(userCount, username,password);
    }

    // update

}