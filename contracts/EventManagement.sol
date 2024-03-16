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
    event EventCreated(
        uint256 indexed eventId,
        string name,
        uint256 date,
        uint256 time,
        uint256 price,
        uint256 totalTickets
    );

    // Modifier to check if the caller is the event organizer
    modifier onlyOrganizer(uint256 _eventId) {
        require(
            msg.sender == events[_eventId].organizer,
            "Caller is not event organizer"
        );
        _;
    }

    // Function to create an event
    function createEvent(
        string memory _name,
        uint256 _date,
        uint256 _time,
        uint256 _price,
        uint256 _totalTickets
    ) public {
        Event memory newEvent = Event(
            _name,
            _date,
            _time,
            _price,
            _totalTickets,
            msg.sender
        );
        events.push(newEvent);
        emit EventCreated(
            events.length - 1,
            _name,
            _date,
            _time,
            _price,
            _totalTickets
        );
    }

    // Function to buy tickets for an event
    function buyTicket(uint256 _eventId, uint256 _tickets) public payable {
        require(
            msg.value >= events[_eventId].price * _tickets,
            "Not enough Ether provided."
        );
        require(
            events[_eventId].totalTickets >= _tickets,
            "Not enough tickets available."
        );
        ticketsSold[_eventId][msg.sender] += _tickets;
        events[_eventId].totalTickets -= _tickets;
    }

    // Function to check the number of tickets a user has for a specific event
    function checkTickets(uint256 _eventId) public view returns (uint256) {
        return ticketsSold[_eventId][msg.sender];
    }

    // Function to get the total number of events
    function getTotalTickets(uint256 _eventId) public view returns (uint256) {
        return events[_eventId].totalTickets;
    }

    // Function to get the total number of tickets for a specific event
    function getTotalTickets(uint256 _eventId) public view returns (uint256) {
        return events[_eventId].totalTickets;
    }
}
