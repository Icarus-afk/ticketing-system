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
  const [eventDateTime, setEventDateTime] = useState('');
  const [eventPrice, setEventPrice] = useState('');
  const [totalTickets, setTotalTickets] = useState('');
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [selectedUserAddress, setSelectedUserAddress] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadBlockchainData = async () => {
      try {
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum);
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          setWeb3(web3);
          const accounts = await web3.eth.getAccounts();
          setAccounts(accounts);

          const networkId = await web3.eth.net.getId();
          const eventManagementNetwork = EventManagement.networks[networkId];
          if (eventManagementNetwork) {
            const eventManagementInstance = new web3.eth.Contract(
              EventManagement.abi,
              eventManagementNetwork.address
            );
            setEventManagementContract(eventManagementInstance);

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

  useEffect(() => {
    if (eventManagementContract) {
      fetchEvents();
    }
  }, [eventManagementContract]);


  const createEvent = async () => {
    try {
      setLoading(true);

      // Split the eventDateTime into eventDate and eventTime
      const [date, time] = eventDateTime.split('T');
      const eventDate = date;
      const eventTime = time;

      // Convert eventDate and eventTime to Unix timestamps
      const dateTimestamp = Math.floor(new Date(eventDate).getTime() / 1000);
      const timeTimestamp = Math.floor(new Date(`1970-01-01T${eventTime}`).getTime() / 1000);
      

      // Check if all required parameters are provided
      if (!eventName || !dateTimestamp || !timeTimestamp || !eventPrice || !totalTickets) {
        throw new Error('All fields are required.');
      }

      // Call the createEvent method with proper parameters
      await eventManagementContract.methods.createEvent(eventName, dateTimestamp, timeTimestamp, eventPrice, totalTickets)
        .send({ from: accounts[0] });

      setMessage('Event created successfully.');
    } catch (error) {
      console.error('Error creating event:', error);
      setMessage('Error creating event. See console for details.');
    } finally {
      setLoading(false);
    }
  };



  const fetchEvents = async () => {
    try {
      const totalEvents = await eventManagementContract.methods.getTotalEvents().call();
      const fetchedEvents = [];
      for (let i = 0; i < totalEvents; i++) {
        const event = await eventManagementContract.methods.events(i).call();
        const totalTickets = await eventManagementContract.methods.getTotalTickets(i).call(); // Call getTotalTickets from EventManagement
        fetchedEvents.push({ ...event, totalTickets }); // Include totalTickets in the event object
      }
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const issueTicket = async () => {
    try {
      setLoading(true);
      await ticketContract.methods.issueTicket(selectedUserAddress, selectedEventId).send({ from: accounts[0] });
      setMessage('Ticket issued successfully.');
    } catch (error) {
      console.error('Error issuing ticket:', error);
      setMessage('Error issuing ticket. See console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Event Management Dashboard</h1>
      <h2>Events</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Time</th>
            <th>Price</th>
            <th>Total Tickets</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, index) => (
            <tr key={index}>
              <td>{event.name}</td>
              <td>{new Date(Number(event.date) * 1000).toLocaleDateString()}</td>
              <td>{new Date(Number(event.time) * 1000).toLocaleTimeString()}</td>
              <td>{event.price}</td>
              <td>{event.totalTickets.toString()}</td> {/* Convert BigInt to string */}
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Create Event</h2>
      <input type="text" placeholder="Event Name" value={eventName} onChange={(e) => setEventName(e.target.value)} />
      <input type="datetime-local" value={eventDateTime} onChange={(e) => setEventDateTime(e.target.value)} />
      <input type="number" placeholder="Price (in wei)" value={eventPrice} onChange={(e) => setEventPrice(e.target.value)} />
      <input type="number" placeholder="Total Tickets" value={totalTickets} onChange={(e) => setTotalTickets(e.target.value)} />
      <button onClick={createEvent} disabled={loading}>Create Event</button>
      <br />
      <h2>Issue Ticket</h2>
      <select value={selectedEventId} onChange={(e) => setSelectedEventId(e.target.value)} disabled={loading}>
        <option value="">Select Event</option>
        {events.map((event, index) => (
          <option key={index} value={index}>{event.name}</option>
        ))}
      </select>
      <input type="text" placeholder="User Address" value={selectedUserAddress} onChange={(e) => setSelectedUserAddress(e.target.value)} />
      <button onClick={issueTicket} disabled={loading}>Issue Ticket</button>
      <br />
      <h2>Messages</h2>
      <p>{message}</p>
    </div>
  );
};

export default Dashboard;
