// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EventManagement {
    // Define event struct
    struct Event {
        string name;
        uint256 date;
        uint256 time;
        uint256 price;
        uint256 totalTickets;
        address organizer;
    }

    // Array to store events
    Event[] public events;

    // Mapping to store tickets sold per user for each event
    mapping(uint256 => mapping(address => uint256)) public ticketsSold;

    // Event creation event
    event EventCreated(uint256 indexed eventId, string name, uint256 date, uint256 time, uint256 price, uint256 totalTickets);

    // Modifier to check if the caller is the event organizer
    modifier onlyOrganizer(uint256 _eventId) {
        require(msg.sender == events[_eventId].organizer, "Only event organizer can perform this action");
        _;
    }

    // Function to create a new event
    function createEvent(string memory _name, uint256 _date, uint256 _time, uint256 _price, uint256 _totalTickets) public {
        events.push(Event(_name, _date, _time, _price, _totalTickets, msg.sender));
        emit EventCreated(events.length - 1, _name, _date, _time, _price, _totalTickets);
    }

    // Function to get the total number of events
    function getTotalEvents() public view returns (uint256) {
        return events.length;
    }

    // Function to get the total number of tickets available for an event
    function getTotalTickets(uint256 _eventId) public view returns (uint256) {
        return events[_eventId].totalTickets;
    }

    // Function to increment tickets sold for a specific event and user
    function incrementTicketsSold(uint256 _eventId, address _user) external {
        ticketsSold[_eventId][_user]++;
    }
}
