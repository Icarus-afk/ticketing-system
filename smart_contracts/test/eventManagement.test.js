const EventManagement = artifacts.require("EventManagement");

contract("EventManagement", accounts => {
    let eventManagementInstance;
    const organizer = accounts[0];

    before(async () => {
        eventManagementInstance = await EventManagement.new();
    });

    it("should create an event", async () => {
        const name = "Test Event";
        const date = Math.floor(Date.now() / 1000); // Current timestamp
        const time = 3600; // 1 hour
        const price = web3.utils.toWei("0.01", "ether");
        const totalTickets = 100;

        await eventManagementInstance.createEvent(name, date, time, price, totalTickets, { from: organizer });
        const event = await eventManagementInstance.getEventDetails(0);

        assert.equal(event.name, name, "Event name is incorrect");
        assert.equal(event.date.toNumber(), date, "Event date is incorrect");
        assert.equal(event.time.toNumber(), time, "Event time is incorrect");
        assert.equal(event.price.toString(), price, "Event price is incorrect");
        assert.equal(event.totalTickets.toNumber(), totalTickets, "Total tickets is incorrect");
    });

    it("should buy tickets", async () => {
        const eventId = 0;
        const tickets = 10;
        const price = web3.utils.toWei("0.01", "ether");

        await eventManagementInstance.buyTicket(eventId, tickets, { from: organizer, value: price * tickets });
        const ticketsBought = await eventManagementInstance.checkTickets(eventId, { from: organizer });

        assert.equal(ticketsBought.toNumber(), tickets, "Number of tickets bought is incorrect");
    });

    it("should update an event", async () => {
        const eventId = 0;
        const name = "Updated Event";
        const date = Math.floor(Date.now() / 1000); // Current timestamp
        const time = 7200; // 2 hours
        const price = web3.utils.toWei("0.02", "ether");
        const totalTickets = 200;

        await eventManagementInstance.updateEvent(eventId, name, date, time, price, totalTickets, { from: organizer });
        const event = await eventManagementInstance.getEventDetails(eventId);

        assert.equal(event.name, name, "Updated event name is incorrect");
        assert.equal(event.date.toNumber(), date, "Updated event date is incorrect");
        assert.equal(event.time.toNumber(), time, "Updated event time is incorrect");
        assert.equal(event.price.toString(), price, "Updated event price is incorrect");
        assert.equal(event.totalTickets.toNumber(), totalTickets, "Updated total tickets is incorrect");
    });

    it("should delete an event", async () => {
        const eventId = 0;

        await eventManagementInstance.deleteEvent(eventId, { from: organizer });
        const event = await eventManagementInstance.getEventDetails(eventId);

        assert.equal(event.name, "", "Event name should be empty after deletion");
        assert.equal(event.date.toNumber(), 0, "Event date should be 0 after deletion");
        assert.equal(event.time.toNumber(), 0, "Event time should be 0 after deletion");
        assert.equal(event.price.toString(), "0", "Event price should be 0 after deletion");
        assert.equal(event.totalTickets.toNumber(), 0, "Total tickets should be 0 after deletion");
    });
});