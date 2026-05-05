# Network-Monitoring-System
Network Monitoring System Mobile application to increase visibility of a home network 

# Prerequisites
Backend:

Linux (Ubuntu recommended — Mininet requires Linux)
Python 3.8+
Mininet
hping3

Frontend:

Node.js 18+
React Native CLI
Android Studio (for Android emulator or physical device)

# Running the System

Start the backend first: sudo python3 main.py
Wait for the Mininet topology to initialise — you will see interface creation logs
The WebSocket server starts automatically on port 5000
Launch the mobile app — it will connect automatically (npx react-native run-android)
Network data will begin appearing within 5–10 seconds
