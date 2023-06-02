const OneID = artifacts.require('OneID');
const CredVerify = artifacts.require('CredVerify');

module.exports = function (deployer) {
    deployer.deploy(OneID);
    deployer.deploy(CredVerify)
}