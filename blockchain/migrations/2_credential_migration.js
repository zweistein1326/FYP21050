const CredentialHash = artifacts.require('CredentialHash')
const Users = artifacts.require('Users');

module.exports = function (deployer) {
    deployer.deploy(CredentialHash);
    deployer.deploy(Users);
}