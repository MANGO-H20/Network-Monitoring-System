import threading 
import json
import datetime


#Get each packet 

def processPacket(packet, network_state ):
    now = datetime.datetime.now()
    with network_state.lock:
        # Assumitions:
        # - Connection is allways pointing to the router 
        # - Each device will always be communicating with a outside server
        if not check_if_server(packet.src_ip):
            # Creating Devices
            src_device = network_state.get_or_create_device(packet.src_ip)
            dest_device = network_state.get_or_create_device(packet.dest_ip)
            router = network_state.get_or_create_device('192.168.1.1')

            # Updating last seen
            src_device.last_seen = now.strftime("%H:%M:%S")
            dest_device.last_seen = now.strftime("%H:%M:%S")

            # Updating status 
            src_device.status = "ONLINE"
            dest_device.status = "ONLINE"

            # Updating thoruhgput 
            src_device.throughput += packet.size

        
            # Creating the connection 
            con1 = (packet.src_ip, '192.168.1.1')
            
            network_state.add_connection(con1)

            # Creating the packettimes and rps 
            src_device.packet_times.append(now)
                
            src_device.packet_times = [
                t for t in src_device.packet_times if (now - t).total_seconds() <= 1
            ]
            src_device.rps = len(src_device.packet_times)

            # Create Warnings
            if network_state.check_for_ddos_warning(packet.src_ip, packet.dest_ip):
                network_state.add_warning(packet.src_ip, "HIGH", "DDoS", str(now.time()))

            if network_state.check_for_spoofing(packet.src_ip):
                network_state.add_warning(packet.src_ip, "MEDIUM", "Spoofing" ,str(now.time()))


# Filtering servers
def check_if_server(ip):
    return ip.startswith("10.")
    return False

    


    





