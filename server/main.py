from mininet.cli import CLI
from mininet.log import setLogLevel
from mininet.net import Mininet
from scapy.all import sniff,get_if_list
from topolgies import createNetwork, export_device_mapping
import re 
from GenerateTraffic import GenerateTraffic
from SimulatedAttacks import SimulateAttacks
from api import start_websocket
from NetworkState import NetworkState
from packetsniffer import  packet_callback, process_packets, packet_queue, get_interfaces
import json, time, threading


def startSniffer(state):
    def run_sniffer():
        mininet_interfaces = get_interfaces()

        if not mininet_interfaces:
            print("[Sniffer] No Mininet interfaces found — is the topology running?")
            return

        print(f"[Sniffer] Listening on: {mininet_interfaces}")
        sniff(prn=packet_callback, filter="ip", store=0, iface=mininet_interfaces)

    threading.Thread(target=process_packets, args=(state,), daemon=True).start()
    threading.Thread(target=run_sniffer, daemon=True).start()


def main():
    # 1. build network
    net = createNetwork()
    net.start()

    # 2. export mapping and load state
    export_device_mapping(net)
    try:
        with open('device_mapping.json') as f:
            loaded_mapping = json.load(f)
    except:
        pass

    state = NetworkState(loaded_mapping)
    state.start_snapshot_thread()

    # 3. start API
    start_websocket(state)

    # 4. start sniffer 
    startSniffer(state)

    # 5. normal traffic
    generation = GenerateTraffic()
    generation.start(net)
    time.sleep(2)

    # 6. attacks
    print("\n[*] Normal traffic running for 10s before attacks begin...")
    time.sleep(10)
    attacks = SimulateAttacks()
    attacker = net.get('wiredPC')

    attacks.launch_spoof(attacker, net.get('serverHTTP').IP(), port=8000, count=10)
    attacks.launch_ddos(attacker, net.get('serverHTTP').IP(), port=8000 )

    CLI(net)

    generation.stopAll()
    attacks.stopAll()
    packet_queue.put(None)   # stop sniffer worker cleanly
    net.stop()


if __name__ == '__main__':
    setLogLevel('info')
    main()
