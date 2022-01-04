const CredentialHash = artifacts.require('CredentialHash')

module.exports = function (deployer) {
    deployer.deploy(CredentialHash);
}