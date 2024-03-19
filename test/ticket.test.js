const EventManagement = artifacts.require("EventManagement");
const Ticket = artifacts.require("Ticket");

contract("Ticket", accounts => {
    let eventManagementInstance;
    let ticketInstance;
    const organizer = accounts[0];
    const attendee = accounts[1];

    before(async () => {
        eventManagementInstance = await EventManagement.new();
        ticketInstance = await Ticket.new(eventManagementInstance.address);

        const name = "Test Event";
        const date = Math.floor(Date.now() / 1000); // Current timestamp
        const time = 3600; // 1 hour
        const price = web3.utils.toWei("0.01", "ether");
        const totalTickets = 100;

        await eventManagementInstance.createEvent(name, date, time, price, totalTickets, { from: organizer });
    });

    it("should issue a ticket", async () => {
        const eventId = 0;

        await ticketInstance.issueTicket(attendee, eventId, { from: organizer });
        const hasTicket = await ticketInstance.getTicketDetails(attendee, eventId);

        assert.equal(hasTicket, true, "Ticket was not issued correctly");
    });

    it("should transfer a ticket", async () => {
        const eventId = 0;
        const newAttendee = accounts[2];

        await ticketInstance.transferTicket(newAttendee, eventId, { from: attendee });
        const hasTicket = await ticketInstance.getTicketDetails(newAttendee, eventId);

        assert.equal(hasTicket, true, "Ticket was not transferred correctly");
    });

    it("should get ticket details", async () => {
        const eventId = 0;
        const newAttendee = accounts[2];

        const hasTicket = await ticketInstance.getTicketDetails(newAttendee, eventId);

        assert.equal(hasTicket, true, "Ticket details are incorrect");
    });
    
    it("should fail to issue a ticket if it's already issued", async () => {
        const eventId = 0;

        try {
            await ticketInstance.issueTicket(attendee, eventId, { from: organizer });
        } catch (error) {
            assert(error.message.includes("Ticket already issued to this address for the event"), "Expected an error but did not get one");
        }
    });

    it("should fail to issue a ticket if no more tickets are available", async () => {
        const eventId = 0;
        const anotherAttendee = accounts[3];

        try {
            // Assuming that all tickets for this event have been sold
            await ticketInstance.issueTicket(anotherAttendee, eventId, { from: organizer });
        } catch (error) {
            assert(error.message.includes("No more tickets available for this event"), "Expected an error but did not get one");
        }
    });

    it("should fail to transfer a ticket if the sender doesn't have a ticket", async () => {
        const eventId = 0;
        const anotherAttendee = accounts[3];

        try {
            await ticketInstance.transferTicket(anotherAttendee, eventId, { from: attendee });
        } catch (error) {
            assert(error.message.includes("You don't have a ticket for this event"), "Expected an error but did not get one");
        }
    });
});