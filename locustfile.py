import time
import threading
import socketio
from locust import User, task, between, events


class SocketIOClient:
    def __init__(self, host, environment):
        self.host = host
        self.env = environment
        self.sio = socketio.Client()
        self.channels = ["devices", "rps", "throughput", "warnings", "new_devices", "node_graph"]

        # Event that gets set once the socket confirms it is connected
        self._connected = threading.Event()

        # Used per request_state call to track which channels have come back
        self._received = set()
        self._all_received = threading.Event()

        @self.sio.on("connect")
        def on_connect():
            # Unblocks the connect() call below once the handshake is done
            self._connected.set()

        # Register a handler for each of the 6 data channels.
        # ch=channel captures the loop variable so each closure has its own value.
        for channel in self.channels:
            @self.sio.on(channel)
            def on_data(data, ch=channel):
                self._received.add(ch)
                # Once all 6 channels are in, unblock request_state_and_wait()
                if self._received >= set(self.channels):
                    self._all_received.set()

    def connect(self):
        start = time.perf_counter()
        try:
            # connect() starts a background thread that handles incoming events
            self.sio.connect(self.host)
            # Block until the "connect" event fires, or 5s timeout
            if not self._connected.wait(timeout=5):
                raise Exception("Connection timed out")
            elapsed = (time.perf_counter() - start) * 1000
            self.env.events.request.fire(
                request_type="WS", name="connect",
                response_time=elapsed, response_length=0, exception=None, context={}
            )
        except Exception as e:
            elapsed = (time.perf_counter() - start) * 1000
            self.env.events.request.fire(
                request_type="WS", name="connect",
                response_time=elapsed, response_length=0, exception=e, context={}
            )
            raise

    def request_state_and_wait(self):
        start = time.perf_counter()
        # Reset state before each request so previous results don't bleed in
        self._received = set()
        self._all_received = threading.Event()
        try:
            self.sio.emit("request_state")
            # Block until all 6 channel handlers have fired, or 5s timeout
            success = self._all_received.wait(timeout=5)
            elapsed = (time.perf_counter() - start) * 1000
            if not success:
                missing = set(self.channels) - self._received
                raise Exception(f"Timed out waiting for: {missing}")
            self.env.events.request.fire(
                request_type="WS", name="request_state (all channels)",
                response_time=elapsed, response_length=len(self._received), exception=None, context={}
            )
        except Exception as e:
            elapsed = (time.perf_counter() - start) * 1000
            self.env.events.request.fire(
                request_type="WS", name="request_state (all channels)",
                response_time=elapsed, response_length=0, exception=e, context={}
            )

    def disconnect(self):
        self.sio.disconnect()


class NetworkMonitorUser(User):
    wait_time = between(2, 5)

    def on_start(self):
        self.client = SocketIOClient(self.host, self.environment)
        self.client.connect()

    def on_stop(self):
        self.client.disconnect()

    @task
    def poll_state(self):
        self.client.request_state_and_wait()
