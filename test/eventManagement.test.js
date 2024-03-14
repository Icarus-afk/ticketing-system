const EventManagement = artifacts.require("EventManagement");

contract("EventManagement", (accounts) => {
    let eventManagementInstance;

    before(async () => {
        eventManagementInstance = await EventManagement.deployed();
    });

    it("should create a new event", async () => {
        const eventName = "Test Event";
        const eventDate = Math.floor(Date.now() / 1000); // Current timestamp
        const eventTime = 3600; // 1 hour from now
        const eventPrice = web3.utils.toWei("0.1", "ether"); // Price in Wei
        const totalTickets = 100;

        await eventManagementInstance.createEvent(eventName, eventDate, eventTime, eventPrice, totalTickets);

        const totalEvents = await eventManagementInstance.getTotalEvents();
        assert.equal(totalEvents, 1, "Total number of events should be 1");

        const event = await eventManagementInstance.events(0);
        assert.equal(event.name, eventName, "Event name should match");
        assert.equal(event.date, eventDate, "Event date should match");
        assert.equal(event.time, eventTime, "Event time should match");
        assert.equal(event.price, eventPrice, "Event price should match");
        assert.equal(event.totalTickets, totalTickets, "Total tickets should match");
        assert.equal(event.organizer, accounts[0], "Event organizer should match");
    });

    it("should increment tickets sold for an event", async () => {
        const eventId = 0;
        const userAddress = accounts[1];

        await eventManagementInstance.incrementTicketsSold(eventId, userAddress);
        const ticketsSold = await eventManagementInstance.ticketsSold(eventId, userAddress);
        assert.equal(ticketsSold, 1, "Tickets sold should be incremented");
    });
});
