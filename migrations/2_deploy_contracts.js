var IdentityLib = artifacts.require("./IdentityLib.sol");
var Identity = artifacts.require("./Identity.sol");
var OraclizePrice = artifacts.require("./OraclizePrice.sol");

module.exports = function(deployer) {
  deployer.deploy(IdentityLib);
  deployer.link(IdentityLib, Identity);
  deployer.deploy(Identity);
  deployer.deploy(OraclizePrice, { value: 15000000000000000000 });

};

