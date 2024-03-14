import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import EventManagement from '../../build/contracts/EventManagement.json';
import Ticket from '../../build/contracts/Ticket.json';

const Dashboard = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [eventManagementContract, setEventManagementContract] = useState(null);
  const [ticketContract, setTicketContract] = useState(null);
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventPrice, setEventPrice] = useState('');
  const [totalTickets, setTotalTickets] = useState('');
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [selectedUserAddress, setSelectedUserAddress] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadBlockchainData = async () => {
      try {
        // Connect to MetaMask
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum);
          await window.ethereum.enable();
          setWeb3(web3);
          const accounts = await web3.eth.getAccounts();
          setAccounts(accounts);

          // Load EventManagement contract
          const networkId = await web3.eth.net.getId();
          const eventManagementNetwork = EventManagement.networks[networkId];
          if (eventManagementNetwork) {
            const eventManagementInstance = new web3.eth.Contract(
              EventManagement.abi,
              eventManagementNetwork.address
            );
            setEventManagementContract(eventManagementInstance);

            // Load Ticket contract
            const ticketNetwork = Ticket.networks[networkId];
            if (ticketNetwork) {
              const ticketInstance = new web3.eth.Contract(
                Ticket.abi,
                ticketNetwork.address
              );
              setTicketContract(ticketInstance);
            } else {
              console.error('Ticket contract not deployed to detected network.');
            }
          } else {
            console.error('EventManagement contract not deployed to detected network.');
          }
        } else {
          console.error('MetaMask not detected.');
        }
      } catch (error) {
        console.error('Error loading blockchain data:', error);
      }
    };

    loadBlockchainData();
  }, []);

  const createEvent = async () => {
    try {
      await eventManagementContract.methods.createEvent(eventName, eventDate, eventTime, eventPrice, totalTickets)
        .send({ from: accounts[0] });
      setMessage('Event created successfully.');
    } catch (error) {
      console.error('Error creating event:', error);
      setMessage('Error creating event. See console for details.');
    }
  };

  const fetchEvents = async () => {
    try {
      const totalEvents = await eventManagementContract.methods.getTotalEvents().call();
      const fetchedEvents = [];
      for (let i = 0; i < totalEvents; i++) {
        const event = await eventManagementContract.methods.events(i).call();
        fetchedEvents.push(event);
      }
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const issueTicket = async () => {
    try {
      await ticketContract.methods.issueTicket(selectedUserAddress, selectedEventId).send({ from: accounts[0] });
      setMessage('Ticket issued successfully.');
    } catch (error) {
      console.error('Error issuing ticket:', error);
      setMessage('Error issuing ticket. See console for details.');
    }
  };

  return (
    <div>
      <h1>Event Management Dashboard</h1>
      <h2>Create Event</h2>
      <input type="text" placeholder="Event Name" value={eventName} onChange={(e) => setEventName(e.target.value)} />
      <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
      <input type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} />
      <input type="number" placeholder="Price (in wei)" value={eventPrice} onChange={(e) => setEventPrice(e.target.value)} />
      <input type="number" placeholder="Total Tickets" value={totalTickets} onChange={(e) => setTotalTickets(e.target.value)} />
      <button onClick={createEvent}>Create Event</button>
      <br />
      <h2>Issue Ticket</h2>
      <select value={selectedEventId} onChange={(e) => setSelectedEventId(e.target.value)}>
        <option value="">Select Event</option>
        {events.map((event, index) => (
          <option key={index} value={index}>{event.name}</option>
        ))}
      </select>
      <input type="text" placeholder="User Address" value={selectedUserAddress} onChange={(e) => setSelectedUserAddress(e.target.value)} />
      <button onClick={issueTicket}>Issue Ticket</button>
      <br />
      <h2>Messages</h2>
      <p>{message}</p>
    </div>
  );
};

export default Dashboard;
