pragma solidity >=0.4.22 <0.9.0;

import '../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '../node_modules/@openzeppelin/contracts/utils/Counters.sol';

contract CredVerify{
    // User struct
    // User ID, Username, Credential IDs
    struct User {
        // string username; // Does it need to be stored in a contract?
        string email;
        string[] credentialIds;
    }

    // Credential struct
    struct Credential {
        string[] owners;
        string[] viewers;
        string createdAt;
        string data;
        string issuedBy;
    }

    using Counters for Counters.Counter;
    Counters.Counter private _credentialIds;
    uint public userCount = 0;
    mapping(string => Credential) private credentials;
    mapping(string => User) private users;

    // ************** User functions ************** //
    // * Register new user
    function createNewUser(string memory userAddress, string memory email) public {
        userCount++;
        string[] memory credentialIds;
        users[userAddress] = User(email, credentialIds);
    }
    // * Add credential to user's credentials list 
    function addCredentialToUser(string memory userAddress, string memory credential_hash) public {
        users[userAddress].credentialIds.push(credential_hash);
    }
    //  * Remove credential from user's credentials list
    // function removeCredentialFromUser(string memory userAddress, string memory credentialId) public {
    //     uint256 i = 0;
    //     for(i; i < users[userAddress].credentialIds.length; i++){
    //         if(users[userAddress].credentialIds[i] == credentialId){
    //             users[userAddress].credentialIds[i] = users[userAddress].credentialIds[users[userAddress].credentialIds.length - 1];
    //             delete users[userAddress].credentialIds[users[userAddress].credentialIds.length-1];
    //             users[userAddress].credentialIds.pop();
    //         }
    //     }
    // }
    // * Fetch user by Id
    function getUserByAddress(string memory userAddress) public view returns (User memory){
        return users[userAddress];
    }
    // * Fetch user by username
    // function getUserByUsername(string memory username) public view returns (User memory){
    //     uint i = 0;
    //     for(i; i<=userCount; i++){
    //         if(keccak256(abi.encodePacked(users[i].username)) == keccak256(abi.encodePacked(username))){
    //             return users[i];
    //         }
    //     }
    //     revert("Not found");
    // }
    
    //  **************  Credential functions  ************** //
    // * Add credential to credential List and user Credentials
    function addCredential(string memory credential_hash, string memory createdBy, string memory createdAt, string memory data, string[] memory viewers) public returns (Credential memory){
        Credential storage credential = credentials[credential_hash];
        credential.issuedBy = createdBy;
        credential.createdAt = createdAt;
        credential.owners.push(createdBy);
        credential.data = data;
        credential.viewers = viewers;
        addCredentialToUser(createdBy, credential_hash);
        return credential;
    }
    // * Fetch credential by credentialId
    function getCredentialById(string memory id) public view returns (Credential memory){
        return credentials[id];
    }
    function getCredentialHeaders(string memory id) public view returns (Credential memory) {
        return credentials[id];
    }
    // * Transfer credential from FROM to TO
    // function transferCredential(uint256 id, uint256 fromId, uint256 toId, CredentialData memory data, Permissions memory permissions) public { 
    //     uint i = 0;
    //     bool flag = false;
    //     Viewer[] memory viewers = credentials[id].viewers;
    //     while(i < viewers.length){
    //         Viewer memory viewer = credentials[id].viewers[i];
    //         if(viewer.id == fromId && viewer.permissions.transfer){
    //             credentials[id].currentOwner = toId;
    //             credentials[id].viewers.push(Viewer(toId, data, permissions));
    //             addCredentialToUser(toId, id);
    //             flag = true;
    //             break;
    //         }
    //         i++;
    //     }
    //     if(!flag){
    //         revert("User does not have correct permissions");
    //     }
    // }
    // // * Revoke Credential status
    // function revokeCredential(uint256 id, uint256 fromId, string memory reason) public {
    //     uint i = 0;
    //     bool flag = false;
    //     Viewer[] memory viewers = credentials[id].viewers;
    //     while(i < viewers.length){
    //         Viewer memory viewer = credentials[id].viewers[i];
    //         if(viewer.id == fromId && viewer.permissions.revoke){
    //             credentials[id].isValid = false;
    //             credentials[id].revocationReason = reason;
    //             flag = true;
    //             break;
    //         }
    //         i++;
    //     }
    //     if(!flag){
    //         revert("User does not have correct permissions");
    //     }
    // }
    // * Add viewer to list of viewers
    function addViewersToCredential(string memory id, string[] memory viewers) public {
        uint i = 0;
        while(i < viewers.length){
            string memory viewer = viewers[i];
            // allow user to add a viewer only if fromId is an owner   
            credentials[id].viewers.push(viewer);
        }
    }
}