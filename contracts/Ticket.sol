// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./EventManagement.sol";

contract Ticket {
    EventManagement public eventManagement;

    // Mapping to store ticket ownership
    mapping(address => mapping(uint256 => bool)) public tickets;

    // Event for ticket issuance
    event TicketIssued(address indexed holder, uint256 indexed eventId);

    // Modifier to check if an event is valid
    modifier validEvent(uint256 _eventId) {
        require(_eventId < eventManagement.getTotalEvents(), "Invalid event ID");
        _;
    }

    // Constructor to set the EventManagement contract address
    constructor(address _eventManagementAddress) {
        eventManagement = EventManagement(_eventManagementAddress);
    }

    // Function to issue ticket to an address for a specific event
    function issueTicket(address _to, uint256 _eventId) public validEvent(_eventId) {
        require(!tickets[_to][_eventId], "Ticket already issued to this address for the event");
        require(eventManagement.ticketsSold(_eventId, _to) < eventManagement.getTotalTickets(_eventId), "No more tickets available for this event");
        
        eventManagement.incrementTicketsSold(_eventId, _to);
        tickets[_to][_eventId] = true;
        emit TicketIssued(_to, _eventId);
    }

    // Function to check if a ticket is valid for an event
    function isTicketValid(address _holder, uint256 _eventId) public view validEvent(_eventId) returns (bool) {
        return tickets[_holder][_eventId];
    }
}
