import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { API_URL, MOCK_MODE } from '@env';

const defaultValue = {
  devices: [],
  rps: [],
  throughput: [],
  warnings: [],
  connected: false,
  new_devices: [],
  node_graph: { edges: [], nodes: [] },
};

const mockValues = {
  connected: true,

  devices: [
    {
      id: '192.168.1.1',
      name: 'Sentinel Hub Alpha',
      type: 'router',
      icon: 'router-wireless',
      status: 'ONLINE',
    },
    {
      id: '192.168.1.10',
      name: 'Living Room OLED',
      type: 'tv',
      icon: 'television-play',
      status: 'ONLINE',
    },
    {
      id: '192.168.1.11',
      name: 'Workstation-Pro',
      type: 'laptop',
      icon: 'laptop',
      status: 'ONLINE',
    },
    {
      id: '192.168.1.12',
      name: 'Guest iPhone 15',
      type: 'phone',
      icon: 'cellphone',
      status: 'OFFLINE',
    },
    {
      id: '192.168.1.13',
      name: 'Smart Thermostat',
      type: 'iot',
      icon: 'thermometer',
      status: 'ONLINE',
    },
    {
      id: '192.168.1.14',
      name: 'Security Camera 1',
      type: 'camera',
      icon: 'cctv',
      status: 'ONLINE',
    },
    {
      id: '192.168.1.15',
      name: 'NAS Storage Unit',
      type: 'server',
      icon: 'server',
      status: 'ONLINE',
    },
    {
      id: '192.168.1.16',
      name: 'PS5 Console',
      type: 'games',
      icon: 'controller-classic',
      status: 'OFFLINE',
    },
    {
      id: '192.168.1.17',
      name: 'Bedroom Tablet',
      type: 'phone',
      icon: 'tablet',
      status: 'ONLINE',
    },
    {
      id: '192.168.1.18',
      name: 'Smart Doorbell',
      type: 'camera',
      icon: 'doorbell',
      status: 'ONLINE',
    },
  ],

  new_devices: [
    {
      id: '192.168.1.19',
      name: 'MacBook Air',
      icon: 'laptop-mac',
      joinedAgo: '2 mins ago',
    },
    {
      id: '192.168.1.20',
      name: 'Samsung Galaxy S24',
      icon: 'cellphone',
      joinedAgo: '7 mins ago',
    },
    {
      id: '192.168.1.21',
      name: 'Kindle Paperwhite',
      icon: 'book-open',
      joinedAgo: '15 mins ago',
    },
  ],

  warnings: [
    {
      id: 'w1',
      severity: 'HIGH',
      type: 'Port Scan Detected',
      timestamp: '10:42:31',
    },
    {
      id: 'w2',
      severity: 'HIGH',
      type: 'Unusual Outbound Traffic',
      timestamp: '10:39:05',
    },
    {
      id: 'w3',
      severity: 'MEDIUM',
      type: 'New Device Joined Network',
      timestamp: '10:35:18',
    },
    {
      id: 'w4',
      severity: 'MEDIUM',
      type: 'High Bandwidth Usage',
      timestamp: '10:28:44',
    },
    {
      id: 'w5',
      severity: 'LOW',
      type: 'DNS Lookup Anomaly',
      timestamp: '10:21:09',
    },
    {
      id: 'w6',
      severity: 'LOW',
      type: 'DHCP Lease Expiring Soon',
      timestamp: '10:10:55',
    },
  ],

  throughput: [
    { value: 12.4, label: '10:00' },
    { value: 18.7, label: '10:01' },
    { value: 22.1, label: '10:02' },
    { value: 19.3, label: '10:03' },
    { value: 31.5, label: '10:04' },
    { value: 28.8, label: '10:05' },
    { value: 35.2, label: '10:06' },
    { value: 41.0, label: '10:07' },
    { value: 38.6, label: '10:08' },
    { value: 44.3, label: '10:09' },
    { value: 39.1, label: '10:10' },
    { value: 52.7, label: '10:11' },
    { value: 47.9, label: '10:12' },
    { value: 55.4, label: '10:13' },
    { value: 50.2, label: '10:14' },
  ],

  rps: [
    { value: 24, label: 'Workstation-Pro' },
    { value: 61, label: 'Living Room OLED' },
    { value: 15, label: 'Bedroom Tablet' },
    { value: 48, label: 'NAS Storage Unit' },
    { value: 9, label: 'Smart Doorbell' },
    { value: 33, label: 'Sentinel Hub' },
  ],

  node_graph: {
    nodes: [
      { id: '192.168.1.1', label: 'Sentinel Hub Alpha', type: 'router' },
      { id: '192.168.1.10', label: 'Living Room OLED', type: 'tv' },
      { id: '192.168.1.11', label: 'Workstation-Pro', type: 'laptop' },
      { id: '192.168.1.13', label: 'Smart Thermostat', type: 'iot' },
      { id: '192.168.1.14', label: 'Security Camera 1', type: 'iot' },
      { id: '192.168.1.15', label: 'NAS Storage Unit', type: 'pc' },
      { id: '192.168.1.17', label: 'Bedroom Tablet', type: 'phone' },
      { id: '192.168.1.18', label: 'Smart Doorbell', type: 'iot' },
    ],
    edges: [
      { from: '192.168.1.1', to: '192.168.1.10' },
      { from: '192.168.1.1', to: '192.168.1.11' },
      { from: '192.168.1.1', to: '192.168.1.13' },
      { from: '192.168.1.1', to: '192.168.1.14' },
      { from: '192.168.1.1', to: '192.168.1.15' },
      { from: '192.168.1.1', to: '192.168.1.17' },
      { from: '192.168.1.1', to: '192.168.1.18' },
      { from: '192.168.1.15', to: '192.168.1.11' },
    ],
  },
};

const NetworkContext = createContext(defaultValue);

export function NetworkProvider({ children }) {
  const useMock = false;

  const [devices, setDevices] = useState(useMock ? mockValues.devices : []);
  const [rps, setRps] = useState(useMock ? mockValues.rps : []);
  const [throughput, setThroughput] = useState(
    useMock ? mockValues.throughput : [],
  );
  const [warnings, setWarnings] = useState(useMock ? mockValues.warnings : []);
  const [connected, setConnected] = useState(
    useMock ? mockValues.connected : false,
  );
  const [new_devices, setNewDevices] = useState(
    useMock ? mockValues.new_devices : [],
  );
  const [node_graph, setNodeGraph] = useState(
    useMock ? mockValues.node_graph : { edges: [], nodes: [] },
  );

  useEffect(() => {
    const socket = io(API_URL, {
      transports: ['polling', 'websocket'],
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      setConnected(true);
      console.log('WS connected', socket.id);
    });
    socket.on('connect_error', err =>
      console.debug('connect_error', err.message),
    );
    socket.on('disconnect', () => setConnected(false));
    socket.on('devices', data => {
      console.debug(data);
      setDevices(data);
    });
    socket.on('new_devices', data => setNewDevices(data));
    socket.on('rps', data => setRps(data));
    socket.on('throughput', data => setThroughput(data));
    socket.on('warnings', data => setWarnings(data));
    socket.on('node_graph', data => setNodeGraph(data));
    return () => socket.disconnect();
  }, []);

  return (
    <NetworkContext.Provider
      value={{
        devices,
        rps,
        throughput,
        warnings,
        connected,
        new_devices,
        node_graph,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  return useContext(NetworkContext);
}
