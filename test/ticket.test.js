const Ticket = artifacts.require("Ticket");
const EventManagement = artifacts.require("EventManagement");

contract("Ticket", (accounts) => {
    let ticketInstance;
    let eventManagementInstance;

    before(async () => {
        eventManagementInstance = await EventManagement.deployed();
        ticketInstance = await Ticket.deployed();

        // Create an event before running tests for Ticket contract
        const eventName = "Test Event";
        const eventDate = Math.floor(Date.now() / 1000); // Current timestamp
        const eventTime = 3600; // 1 hour from now
        const eventPrice = web3.utils.toWei("0.1", "ether"); // Price in Wei
        const totalTickets = 100;

        await eventManagementInstance.createEvent(eventName, eventDate, eventTime, eventPrice, totalTickets);
    });

    it("should issue a ticket for an event", async () => {
        const eventId = 0;
        const userAddress = accounts[1];

        await ticketInstance.issueTicket(userAddress, eventId);

        const isTicketValid = await ticketInstance.isTicketValid(userAddress, eventId);
        assert.isTrue(isTicketValid, "Ticket should be issued for the event");
    });

    it("should not issue duplicate tickets for an event", async () => {
        const eventId = 0;
        const userAddress = accounts[1];

        try {
            // Try to issue a ticket again for the same event and user
            await ticketInstance.issueTicket(userAddress, eventId);
            assert.fail("Should not be able to issue duplicate tickets");
        } catch (error) {
            assert.include(error.message, "Ticket already issued", "Error message should indicate duplicate ticket");
        }
    });

    it("should validate a valid ticket for an event", async () => {
        const eventId = 0;
        const userAddress = accounts[1];

        const isTicketValid = await ticketInstance.isTicketValid(userAddress, eventId);
        assert.isTrue(isTicketValid, "Valid ticket should be validated");
    });

    it("should invalidate an invalid ticket for an event", async () => {
        const eventId = 0;
        const userAddress = accounts[2]; // Different user address

        const isTicketValid = await ticketInstance.isTicketValid(userAddress, eventId);
        assert.isFalse(isTicketValid, "Invalid ticket should be invalidated");
    });
});
