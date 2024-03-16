// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EventManagement {
    struct Event {
        string name;
        uint256 date;
        uint256 time;
        uint256 price;
        uint256 totalTickets;
        address organizer;
    }

    Event[] public events;

    mapping(uint256 => mapping(address => uint256)) public ticketsSold;

    event EventCreated(
        uint256 indexed eventId,
        string name,
        uint256 date,
        uint256 time,
        uint256 price,
        uint256 totalTickets
    );

    modifier onlyOrganizer(uint256 _eventId) {
        require(
            msg.sender == events[_eventId].organizer,
            "Caller is not event organizer"
        );
        _;
    }

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

    function checkTickets(uint256 _eventId) public view returns (uint256) {
        return ticketsSold[_eventId][msg.sender];
    }

    function getTotalEvents() public view returns (uint256) {
        return events.length;
    }

    function getTotalTickets(uint256 _eventId) public view returns (uint256) {
        return events[_eventId].totalTickets;
    }

    function updateEvent(
        uint256 _eventId,
        string memory _name,
        uint256 _date,
        uint256 _time,
        uint256 _price,
        uint256 _totalTickets
    ) public onlyOrganizer(_eventId) {
        Event storage myEvent = events[_eventId];
        myEvent.name = _name;
        myEvent.date = _date;
        myEvent.time = _time;
        myEvent.price = _price;
        myEvent.totalTickets = _totalTickets;
    }

    function deleteEvent(uint256 _eventId) public onlyOrganizer(_eventId) {
        delete events[_eventId];
    }

    function getEventDetails(
        uint256 _eventId
    )
        public
        view
        returns (
            string memory name,
            uint256 date,
            uint256 time,
            uint256 price,
            uint256 totalTickets,
            address organizer
        )
    {
        Event memory myEvent = events[_eventId];
        return (
            myEvent.name,
            myEvent.date,
            myEvent.time,
            myEvent.price,
            myEvent.totalTickets,
            myEvent.organizer
        );
    }
    // Function to increment the number of tickets sold for a specific event to a specific address
    function incrementTicketsSold(uint256 _eventId, address _to) public {
        ticketsSold[_eventId][_to]++;
    }
}
