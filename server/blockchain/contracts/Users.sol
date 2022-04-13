pragma solidity >=0.4.22 <0.9.0;

import '../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '../node_modules/@openzeppelin/contracts/utils/Counters.sol';

contract Users{
    struct User{
        uint id;
        string username;
        address walletAddress;
        uint256[] credentialIds;
    }

    struct CredentialData{
        string fileName;
        string assetHash;
        string metadataUrl;
    }

    struct Credential{
        uint id;
        uint256 createdBy;
        CredentialData data;
        uint256 currentOwner;
        bool isValid;
        string revocationReason;
        string createdAt;
        uint256[] viewers;
    }

    using Counters for Counters.Counter;
    Counters.Counter private _credentialIds;
    uint public userCount = 0;

    mapping(uint256 => Credential) public credentials;
    mapping(uint => User) public users;
    

    // * User functions
    function createNewUser(string memory username, address walletAddress) public {
        userCount++;
        uint256[] memory credentialIds;
        users[userCount] = User(userCount, username, walletAddress, credentialIds);
    }

    function addCredentialToUser(uint id, uint256 credentialId) public {
        users[id].credentialIds.push(credentialId);
    }

    function removeCredentialFromUser(uint id, uint256 credentialId) public {
        uint256 i = 0;
        for(i; i < users[id].credentialIds.length; i++){
            if(users[id].credentialIds[i] == credentialId){
                users[id].credentialIds[i] = users[id].credentialIds[users[id].credentialIds.length - 1];
                delete users[id].credentialIds[users[id].credentialIds.length-1];
                users[id].credentialIds.pop();
            }
        }
    }

    function getUserById(uint id) public view returns (User memory){
        return users[id];
    }

    function getUserByUsername(string memory username) public view returns (User memory){
        uint i = 0;
        for(i; i<=userCount; i++){
            if(keccak256(abi.encodePacked(users[i].username)) == keccak256(abi.encodePacked(username))){
                return users[i];
            }
        }
        revert("Not found");
    }

    
    // * Credential functions
    // * Add credential to credential List and user Credentials
    function addCredential(uint256 createdBy, CredentialData memory data, string memory createdAt, uint256[] memory viewers) public returns (uint256){
        _credentialIds.increment();
        uint256 newItemId = _credentialIds.current();
        credentials[newItemId] = Credential(newItemId, createdBy, data, createdBy, true, '', createdAt, viewers );
        addCredentialToUser(createdBy, newItemId);
        return newItemId;
    }

    function getCredentialById(uint256 id) public view returns (Credential memory){
        return credentials[id];
    }

    function transferCredential(uint256 id, uint256 fromId, uint256 toId) public {
        if(credentials[id].currentOwner == fromId){
            credentials[id].currentOwner = toId;
            removeCredentialFromUser(fromId, id);
            addCredentialToUser(toId, id);
        }else{
            revert("User does not have correct permissions");
        }
    }

    function revokeCredential(uint256 id, uint256 fromId, string memory reason) public {
        if(credentials[id].createdBy == fromId){
            credentials[id].isValid = false;
            credentials[id].revocationReason = reason;
        }
        else{
            revert("User does not have correct permissions");
        }
    }

    function addViewerToCredential(uint256 id, uint256 fromId, uint256 viewerId) public {
        if(credentials[id].createdBy == fromId){
            credentials[id].viewers.push(viewerId);
        }
        else{
            revert("User does not have correct permissions");
        }
    }

}