// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./EventManagement.sol";

contract Ticket {
    EventManagement public eventManagement;
    mapping(address => mapping(uint256 => bool)) public tickets;

    event TicketIssued(address indexed _to, uint256 indexed _eventId);

    modifier validEvent(uint256 _eventId) {
        require(_eventId < eventManagement.getTotalEvents(), "Invalid event ID");
        _;
    }

    constructor(EventManagement _eventManagement) {
        eventManagement = _eventManagement;
    }

    function issueTicket(address _to, uint256 _eventId) public validEvent(_eventId) {
        require(!tickets[_to][_eventId], "Ticket already issued to this address for the event");
        require(eventManagement.ticketsSold(_eventId, _to) < eventManagement.getTotalTickets(_eventId), "No more tickets available for this event");
    
        eventManagement.incrementTicketsSold(_eventId, _to);
        tickets[_to][_eventId] = true;
        emit TicketIssued(_to, _eventId);
    }

    function transferTicket(address _to, uint256 _eventId) public {
        require(tickets[msg.sender][_eventId], "You don't have a ticket for this event");
        tickets[msg.sender][_eventId] = false;
        tickets[_to][_eventId] = true;
    }

    function getTicketDetails(address _owner, uint256 _eventId) public view returns (bool hasTicket) {
        return tickets[_owner][_eventId];
    }
}