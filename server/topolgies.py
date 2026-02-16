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
    def __init__(self):
        self.processes = []
        self.http_server_IP = 0
        self.tcp_udp_server_IP = 0
    def serverSetup(self ,nodes):
        for node in nodes:
            if "HTTP" in node.name:

                self.http_server_IP = node.IP()
                self.startHTTP(node) 
            if "TCP" in node.name:
                self.tcp_udp_server_IP = node.IP()
                self.startIperf(node)
            if "UDP" in node.name:
                self.tcp_udp_server_IP = node.IP()
                self.startIperf(node,udp=True)

    def generateTraffic(self, nodes):
        for node in nodes:
            if "phone" in node.name or "wifi":
                self.generateHTTPTraffic(node)
            elif "IOT" in node.name:
                self.generateHTTPTraffic(nodes , is_IOT = True)

    # Start HTTP server
    def startHTTP(self,host: list , port=8000 ) :
        return host.popen(["python3", "-m", "http.server", str(port)],
                        stdout=None, stderr=None)

    # Start TCP/UDP server
    def startIperf(self,host, udp=False, port=5001):
        args = ["iperf", "-s", "-p", str(port)]
        if udp: args.insert(2, "-u")
        return host.popen(args)

    def generateHTTPTraffic(self,node, is_IOT=False ) :
        port = 8000
        # period in seconds 
        if(is_IOT):
            period = 60
        else:
            period = 1 
        cmd = f"while true; do curl -s http://{self.http_server_IP}:{port} >/dev/null; sleep {period}; done"
        return node.popen(["bash", "-lc", cmd])
def runMinimalTopo():
    "Bootstrap a Mininet network using the Minimal Topology"

    # Create an instance of our topology

    test1 = ['phone1' , 'phone2', 'wiredPC' ,'wifiLaptop' ,'serverHTTP' ,'serverTCP' ,'serverUDP' ]
    topo = TopologyGenerator(host_names=test1)
    generation = GenerateTraffic() 

    # Create a network based on the topology using OVS and controlled by
    # a remote controller.
    net = Mininet(
        topo=topo,
        controller= lambda name: RemoteController(name, ip='127.0.0.1', port=6633),
        switch=OVSSwitch,
        autoSetMacs=True )

    # Actually start the network
    net.start()
    hosts  = net.hosts 

    generation.serverSetup(hosts)
    generation.generateTraffic(hosts)

    # Drop the user in to a CLI so user can run commands.
    CLI(net)

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
