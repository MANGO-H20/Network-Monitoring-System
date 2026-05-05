import threading
import time

# Warning Class 

class Warning :
    def __init__(self, src_ip, severity, type,time ):
        self.ip = src_ip 
        self.severity = severity 
        self.type = type
        self.timestamp = time

    def print(self):
        print(f"""
            Warning :
                IP : {self.ip}
                Severity : {self.severity}
                Type : {self.type}
                Timestamp : {self.timestamp}
            """)

    def to_dict(self):
        return {
            "ip":       self.ip,
            "severity": self.severity,
            "type":     self.type,
            "timestamp": self.timestamp
        }

# Device Class

class Device:
    def __init__(self, ip, name, device_type):
        self.ip = ip
        self.name = name
        self.device_type = device_type
        self.status = "OFFLINE"
        self.last_seen = None
        self.throughput = 0
        self.packet_times = []
        self.rps = 0

    def print_devices(self):
        print(f"""
        Device name : {self.name}
         IP : {self.ip}
         type : {self.device_type}
         Status : {self.status}
         Last Seen : {self.last_seen}
         Throughput : {self.throughput}
         Packet Times : {self.packet_times}
         RPS : {self.rps} 
        """)

    def to_dict(self):
        return {
            "ip":         self.ip,
            "name":       self.name,
            "type":       self.device_type,
            "status":     self.status,
            "last_seen":  str(self.last_seen),
            "throughput": self.throughput,
            "rps":        self.rps,
        }






class NetworkState:
    def __init__(self, device_mapping):
        self.connections = {} 
        self.nodes = {} 
        self.warnings = []
        self.lock = threading.Lock()
        self.device_mapping = device_mapping
        self.throughput_history = []   

    def print_state (self):
        print(f"""
        Network State 
         Connections : {self.connections}
         Nodes : {self.nodes}
         Warnings : {self.warnings}
         Throughput History : {self.throughput_history}
        """)

    # SET functions 
    
    def add_node(self, node):
        if node.ip not in self.nodes:
            self.nodes[node.ip] = node 

    def add_connection(self, key):
        if key not in self.connections and key[::-1] not in self.connections:
            self.connections[key] = self.connections.get(key, 0) + 1

    def add_warning(self, node_ip, severity , type ,current_time):
        warning = Warning(node_ip , severity,type, current_time)
        if not self.check_if_in_warnings(warning):
            self.warnings.append(warning)

    def check_if_in_warnings(self, warning):
        for w in self.warnings:
            if warning.ip == w.ip and warning.type == warning.type:
                return True
        return False
         
    def create_device(self,ip) :
        info = self.device_mapping.get(ip, {})
        return Device(
            ip=ip,
            name=info.get("name", ip),
            device_type=info.get("type", "unknown")
        )

    def get_or_create_device(self, ip):
        if ip not in self.nodes:
                device = self.create_device(ip)
                self.nodes[ip] = device
        return self.nodes[ip]


    # Attack Detection 

    def check_for_ddos_warning(self, src_ip, dest_ip):

        # Thresholds for DDOS attacks 
        threshold_rps = 50        
        threshold_unique_targets = 10
        threshold_bytes = 1_000_000  # 1MB 

        device = self.nodes[src_ip]

        if device.rps > threshold_rps:
            return True

        if device.throughput > threshold_bytes:
            return True

        return False

    def check_for_spoofing(self, src_ip):
        if src_ip not in self.device_mapping:
            return True  # unknown device

        device = self.nodes[src_ip]

        # If device suddenly changes identity
        if device.name == "unknown":
            return True

        return False



    # API GET funcitons 
    def get_devices(self) :
        return [
            {
                'id': d.ip,
                'name': d.name,
                'type': d.device_type,
                'icon': d.device_type,
                'status': d.status
            }
            for d in self.nodes.values()
        ]

    def get_new_devices(self):
        return [
            {
                'id': d.ip,
                'name': d.name,
                'joinedAgo': str(d.last_seen), 
                'icon': d.device_type
            }
            for d in self.nodes.values()
        ]

    def get_rps_chart_data(self):
            return [
                {'label': d.name,
                 'value': d.rps
                 } 
                for d in self.nodes.values()
                ]

    def get_node_graph(self):
        return {
            'nodes': [{ 'id': d.ip, 'label':  d.name ,'type' : d.device_type} for d in self.nodes.values()],
            'edges': [{ 'to':c[0] ,'from': c[1] } for c in self.connections.keys()],
        }

    def get_warnings(self): 
        return [
            w.to_dict()
            for w in self.warnings[-20:]
        ]

    # Throughput history thread monitoring 

    def snapshot(self): 
        total_bytes = sum(d.throughput for d in self.nodes.values())

        for d in self.nodes.values():
            d.throughput = 0
 
        entry = {
            "value": round(total_bytes * 8 / 1_000_00, 2),
            "label": f"{len(self.throughput_history)}s"
        }
        self.throughput_history.append(entry)
        if len(self.throughput_history) > 60:
            self.throughput_history.pop(0)

    def start_snapshot_thread(self):
        def loop():
            while True:
                self.snapshot()
                time.sleep(1)
        threading.Thread(target=loop, daemon=True).start()   


