pragma solidity >=0.4.22 <0.9.0;

import '../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '../node_modules/@openzeppelin/contracts/utils/Counters.sol';

contract Credentials{

    struct CredentialData{
        string assetHash;
        string metadataUrl;
    }

    struct Credential{
        uint id;
        string createdBy;
        CredentialData data;
        string currentOwner;
        bool isValid;
        string revocationReason;
        string createdAt;
        string[] viewers;
    }

    using Counters for Counters.Counter;
    Counters.Counter private _credentialIds;
    mapping(uint256=>Credential) public credentials;

    function addCredential(string memory createdBy, CredentialData memory data, string memory createdAt, string[] memory viewers) public{
        _credentialIds.increment();
        uint256 newItemId = _credentialIds.current();
        credentials[newItemId] = Credential(newItemId, createdBy, data, createdBy, true, '', createdAt, viewers );
    }

    function getCredentialById(uint256 id) public view returns (Credential memory){
        return credentials[id];
    }
}