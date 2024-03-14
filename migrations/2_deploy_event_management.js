const EventManagement = artifacts.require("EventManagement");

module.exports = function(deployer) {
    deployer.deploy(EventManagement);
};
