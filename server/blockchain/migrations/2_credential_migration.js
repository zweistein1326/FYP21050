const Credentials = artifacts.require('Credentials')
const Users = artifacts.require('Users');
const UniqueAsset = artifacts.require('UniqueAsset');

module.exports = function (deployer) {
    deployer.deploy(Credentials);
    deployer.deploy(Users);
    deployer.deploy(UniqueAsset);
}