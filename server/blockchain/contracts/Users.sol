pragma solidity >=0.4.22 <0.9.0;

import '../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '../node_modules/@openzeppelin/contracts/utils/Counters.sol';

contract Users{
    struct User{
        uint id;
        string username;
        address walletAddress;
        uint256[] credentialIds;
        string publicKey;
        bool isAdmin;
    }

    struct CredentialData{
        string fileName;
        string assetHash;
        string metadataUrl;
    }

    struct Viewer{
        uint id;
        CredentialData data;
        Permissions permissions;
    }

    struct Permissions{
        bool transfer;
        bool revoke;
        bool share;
    }

    struct Credential{
        uint id;
        uint256 createdBy;
        uint256 currentOwner;
        bool isValid;
        string revocationReason;
        string createdAt;
        // uint256[] viewers;
        Viewer[] viewers;
    }

    using Counters for Counters.Counter;
    Counters.Counter private _credentialIds;
    uint public userCount = 0;

    mapping(uint256 => Credential) public credentials;
    mapping(uint => User) public users;
    

    // * User functions * //

    // * Register new user
    function createNewUser(string memory username, address walletAddress, string memory publicKey, bool isAdmin) public {
        userCount++;
        uint256[] memory credentialIds;
        users[userCount] = User(userCount, username, walletAddress, credentialIds, publicKey, isAdmin);
    }

    // * Add credential to user's credentials list 
    function addCredentialToUser(uint id, uint256 credentialId) public {
        users[id].credentialIds.push(credentialId);
    }

    //  * Remove credential from user's credentials list
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

    // * Fetch user by Id
    function getUserById(uint id) public view returns (User memory){
        return users[id];
    }

    // * Fetch user by username
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
    function addCredential(uint256 createdBy, string memory createdAt, Viewer[] memory viewers) public returns (uint256){
        _credentialIds.increment();
        uint256 newItemId = _credentialIds.current();
        uint i =0;
        Credential storage credential = credentials[newItemId];
        credential.createdAt = createdAt;
        credential.createdBy = createdBy;
        credential.currentOwner = createdBy;
        credential.id = newItemId;
        credential.isValid = true;
        credential.revocationReason = '';
        while(i<viewers.length){
            credential.viewers.push(Viewer(viewers[i].id, CredentialData(viewers[i].data.fileName, viewers[i].data.assetHash, viewers[i].data.metadataUrl), Permissions(viewers[i].permissions.transfer, viewers[i].permissions.revoke, viewers[i].permissions.share)));
            i++;
        }
        addCredentialToUser(createdBy, newItemId);
        return newItemId;
    }

    // * Fetch credential by credentialId
    function getCredentialById(uint256 id) public view returns (Credential memory){
        return credentials[id];
    }

    // * Transfer credential from FROM to TO
    function transferCredential(uint256 id, uint256 fromId, uint256 toId, CredentialData memory data, Permissions memory permissions) public { 
        uint i = 0;
        bool flag = false;
        Viewer[] memory viewers = credentials[id].viewers;
        while(i < viewers.length){
            Viewer memory viewer = credentials[id].viewers[i];
            if(viewer.id == fromId && viewer.permissions.transfer){
                credentials[id].currentOwner = toId;
                credentials[id].viewers.push(Viewer(toId, data, permissions));
                addCredentialToUser(toId, id);
                flag = true;
                break;
            }
            i++;
        }
        if(!flag){
            revert("User does not have correct permissions");
        }
    }

    // * Revoke Credential status
    function revokeCredential(uint256 id, uint256 fromId, string memory reason) public {
        uint i = 0;
        bool flag = false;
        Viewer[] memory viewers = credentials[id].viewers;
        while(i < viewers.length){
            Viewer memory viewer = credentials[id].viewers[i];
            if(viewer.id == fromId && viewer.permissions.revoke){
                credentials[id].isValid = false;
                credentials[id].revocationReason = reason;
                flag = true;
                break;
            }
            i++;
        }
        if(!flag){
            revert("User does not have correct permissions");
        }
    }

    // * Add viewer to list of viewers
    function addViewerToCredential(uint256 id, uint256 fromId, Viewer[] memory viewers) public {
        uint i = 0;
        bool flag = false;
        while(i<credentials[id].viewers.length){
            Viewer memory viewer = credentials[id].viewers[i];
            if(viewer.id == fromId && viewer.permissions.share){
                uint j = 0; 
                while(j < viewers.length){
                    credentials[id].viewers.push(Viewer(viewers[j].id, CredentialData(viewers[j].data.fileName, viewers[j].data.assetHash, viewers[j].data.metadataUrl), Permissions(viewers[j].permissions.transfer, viewers[j].permissions.revoke, viewers[j].permissions.share)));
                    addCredentialToUser(viewers[j].id, id);
                    j++;
                    flag = true;
                }
                break;
            }
            i++;
        }
        if(!flag){
            revert("User does not have correct permissions");
        }
    }
}