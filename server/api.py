from flask import Flask
from flask_socketio import SocketIO
import threading, time

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*" ,async_mode='threading')
network_state = None

@app.route("/")
def index():
    return "NetworkMonitor WS running"

# Events Handlers 

@socketio.on("connect")
def on_connect():
    print("[WS] Client connected")
    push_all()          

@socketio.on("disconnect")
def on_disconnect():
    print("[WS] Client disconnected")

# Client request state 
@socketio.on("request_state")     
def on_request():
    push_all()

#  Push emitters  

def push_all():
    """Emit all data channels in one go."""
    socketio.emit("devices",get_devices())
    socketio.emit("rps",get_rps())
    socketio.emit("throughput",get_throughput())
    socketio.emit("warnings",get_warnings())
    socketio.emit("new_devices",get_new_devices())
    socketio.emit("node_graph",get_node_graph())

# Get functions 
def get_devices():
    with network_state.lock:
        return network_state.get_devices()

def get_new_devices():
    with network_state.lock:
        return network_state.get_new_devices()

def get_rps():
    with network_state.lock:
        return network_state.get_rps_chart_data()

def get_throughput():
    with network_state.lock:
        return network_state.throughput_history  

def get_warnings():
    with network_state.lock:
        return network_state.get_warnings()

def get_node_graph():
    with network_state.lock:
        return network_state.get_node_graph()


# Broadcast loop 

def broadcast_loop():
    while True:
        time.sleep(5)
        print("push")
        push_all()

#  Start function 

def start_websocket(state):
    global network_state
    network_state = state

    threading.Thread(target=broadcast_loop, daemon=True).start()

    threading.Thread(
        target=lambda: socketio.run(app, host="0.0.0.0", port=5000, debug=False),
        daemon=True
    ).start()

    print("[WS] WebSocket server running on ws://0.0.0.0:5000")

