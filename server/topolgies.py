from mininet.cli import CLI
from mininet.log import setLogLevel
from mininet.net import Mininet
from mininet.topo import Topo
from mininet.node import RemoteController, OVSSwitch

class TopologyGenerator(Topo):
    # Creates a topology  
    #uses one switch 
    def build (self , host_names):
        hosts = []
        for host in host_names:
            hosts.append(self.addHost(host))

        s1 = self.addSwitch( 's1' )
        server_HTTP = self.addHost('server_HTTP')
        server_TCP_UDP = self.addHost('server_TCP_UDP ')

        for host in hosts: 
            # wifi delay , bandwidth, loss 
            if "phone" in host or "wifi" :
                self.addLink(host, s1, bw=20, delay= 10 , loss =1)
            # IOT delay , bandwidth , loss 
            elif "IOT" in host:
                self.addLink(host, s1, bw=1, delay= 25 ,loss = 1)
            # Wired devices delay , bandwidth 
            else:
                self.addLink(host, s1, bw=100, delay= 1 )

class GenerateTraffic():
    def __init__():
        self.processes = []
    def generateTraffic(nodes):
        for node in nodes:
            if "HTTP" in node:
                startHTTP(node)
                
            if "TCP" in node:
                startTCP_UDP(node)

            if "phone" in node or "wifi":
                generateWIFITraffic(node)
            elif "IOT" in node:
                generateIOTTraffic()

        pass

    def startHTTP(host, port=8000):
        return host.popen(["python3", "-m", "http.server", str(port)],
                        stdout=None, stderr=None)

    def start_iperf_server(host, udp=False, port=5001):
        args = ["iperf", "-s", "-p", str(port)]
        if udp: args.insert(2, "-u")
        return host.popen(args)

    def generateWIFITraffic(node):
        cmd = f"while true; do curl -s http://{server_ip}:{port} >/dev/null; sleep {period}; done"
        return client.popen(["bash", "-lc", cmd])

        # curlling a server HTTP request traffic and TCP / UDP traffic 
        # Add delay and jitter 
        pass
    def generateIOTTraffic():
        # perodic small bursts 
        pass
def runMinimalTopo():
    "Bootstrap a Mininet network using the Minimal Topology"

    # Create an instance of our topology

    test1 = ['phone1' ,'phone2', 'wiredPC' ,'wifiLaptop' ]
    topo = TopologyGenerator(host_names=test1)

    # Create a network based on the topology using OVS and controlled by
    # a remote controller.
    net = Mininet(
        topo=topo,
        controller= lambda name: RemoteController(name, ip='127.0.0.1', port=6633),
        switch=OVSSwitch,
        autoSetMacs=True )

    # Actually start the network
    net.start()

    print(net.keys())
    # Drop the user in to a CLI so user can run commands.

    # After the user exits the CLI, shutdown the network.
    net.stop()

if __name__ == '__main__':
    # This runs if this file is executed directly
    setLogLevel( 'info' )
    runMinimalTopo()

# Allows the file to be imported using `mn --custom <filename> --topo minimal`
topos = {
    'minimal': TopologyGenerator
}
