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
            # wifi delay , bandwidth 
            if "phone" in host or "wifi" :
                self.addLink(host, s1, bw=20, delay= 10)
            # IOT delay , bandwidth  
            elif "IOT" in host:
                self.addLink(host, s1, bw=1, delay= 25)
            # Wired devices delay , bandwidth 
            else:
                self.addLink(host, s1, bw=10, delay= 10)

class GenerateTraffic():
    def __init__():
        self.processes = []
    def generateTraffic(nodes):
        for node in nodes:
            if "phone" in node or "wifi":
                generateWIFITraffic()
            elif "wired" in node:
                generateWiredTraffic()
            elif "IOT" in node:
                generateIOTTraffic()

        pass
    def generateWIFITraffic():

        # curlling a server HTTP request traffic and TCP / UDP traffic 
        # Add delay and jitter 
        pass
    def generateWiredTraffic():
        # curlling a server HTTP request traffic and TCP / UDP traffic 

        pass
    def generateIOTTraffic():
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
