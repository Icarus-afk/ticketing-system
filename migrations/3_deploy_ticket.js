const Ticket = artifacts.require("Ticket");
const EventManagement = artifacts.require("EventManagement");

module.exports = async function(deployer) {
    // Deploy EventManagement contract
    await deployer.deploy(EventManagement);

    // Get the deployed EventManagement instance
    const eventManagementInstance = await EventManagement.deployed();

    // Deploy Ticket contract and pass the address of EventManagement contract
    await deployer.deploy(Ticket, eventManagementInstance.address);
};
