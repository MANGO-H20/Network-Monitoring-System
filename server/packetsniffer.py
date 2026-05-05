from scapy.all import sniff, get_if_list, conf
from scapy.layers.inet import IP, TCP, UDP, ICMP
from Processor import processPacket
import queue
import threading
import re

packet_queue = queue.Queue()

#  Packet Data 

class PacketData:
    def __init__(self, timestamp, src_ip, dest_ip, src_port, dest_port, protocol, size):
        self.timestamp = timestamp
        self.src_ip = src_ip
        self.dest_ip = dest_ip
        self.src_port = src_port
        self.dest_port = dest_port
        self.protocol = protocol
        self.size = size

    def print(self):
        return (f"PacketData(ts={self.timestamp}, {self.src_ip}:{self.src_port} -> "
                f"{self.dest_ip}:{self.dest_port}, {self.protocol}, {self.size}B)")

#  Parsing 

def parse_packet(packet) :
    if IP not in packet:
        return None
    ip_layer = packet[IP]
    proto_map = {1: "ICMP", 6: "TCP", 17: "UDP"}
    protocol_name = proto_map.get(ip_layer.proto, "Unknown")
    src_port = dst_port = None
    if TCP in packet:
        src_port = packet[TCP].sport
        dst_port = packet[TCP].dport
    elif UDP in packet:
        src_port = packet[UDP].sport
        dst_port = packet[UDP].dport
    return PacketData(
        timestamp = packet.time,
        src_ip = ip_layer.src,
        dest_ip = ip_layer.dst,
        src_port = src_port,
        dest_port = dst_port,
        protocol = protocol_name,
        size = len(packet),
    )

def packet_callback(packet):
    parsed = parse_packet(packet)
    if parsed:
        packet_queue.put(parsed)

# Process packet worker 

def process_packets(state):          
    while True:
        packet_data = packet_queue.get()
        if packet_data is None:
            break
        try:
            processPacket(packet_data, state)
        except Exception as e:
            import traceback
            traceback.print_exc()        
        packet_queue.task_done()

# Interfaces filter

def get_interfaces():
    conf.ifaces.reload()   
    interfaces = get_if_list()
    mininet_interfaces = [i for i in interfaces if re.search(r"\w+-eth\d+", i)]
    return mininet_interfaces


# Start function 

def startSniffer(state):
    mininet_interfaces = get_interfaces()

    if not mininet_interfaces:
        print("[Sniffer] No Mininet interfaces found — is the topology running?")

    # worker thread — processes packets from queue
    threading.Thread(
        target=process_packets,
        args=(state,),
        daemon=True
    ).start()

    # sniffer thread — captures packets into queue
    threading.Thread(
        target=lambda: sniff(
            prn=packet_callback,
            filter="ip",
            store=0,
            iface=mininet_interfaces
        ),
        daemon=True
    ).start()

    print(f"[Sniffer] Listening on: {mininet_interfaces}")
