from mininet.cli import CLI
from mininet.net import Mininet
from mininet.topo import Topo
from mininet.node import RemoteController, OVSSwitch
import json, time, random
from NetworkState import NetworkState

class TopologyGenerator(Topo):
    def build(self, host_names, servers):

        # Setting up constant devices in the network and router connections

        wifi_ip  = 2
        wired_ip = 2

        s_wifi  = self.addSwitch('s2')
        s_wired = self.addSwitch('s3')
        s_inet  = self.addSwitch('s4')

        router   = self.addHost('router')
        internet = self.addHost('internet', ip='10.0.0.1/24')

        self.addLink(router, s_wifi)
        self.addLink(router, s_wired)
        self.addLink(router, s_inet)
        self.addLink(internet, s_inet)

        # Adding and Connecting hosts 
        for host in host_names:
            if 'phone' in host or 'wifi' in host:
                ip = f'192.168.1.{wifi_ip}/24'
                wifi_ip += 1
                h = self.addHost(host, ip=ip)
                self.addLink(h, s_wifi, bw=20, delay='10ms', loss=1)
            else:
                ip = f'192.168.2.{wired_ip}/24'
                wired_ip += 1
                h = self.addHost(host, ip=ip)
                self.addLink(h, s_wired, bw=100, delay='1ms')


        # Adding and Connecting servers
        server_ip = 2
        for server in servers:
            ip = f'10.0.0.{server_ip}/24'
            server_ip += 1
            h = self.addHost(server, ip=ip)
            self.addLink(h, s_inet)


    def configure_hosts_routes(self, net):

        # Configure Router 
        router = net.get('router')
        router.setIP('192.168.1.1/24', intf='router-eth0')
        router.setIP('192.168.2.1/24', intf='router-eth1')
        router.setIP('10.0.0.254/24',  intf='router-eth2')
        router.cmd('sysctl -w net.ipv4.ip_forward=1')
        router.cmd('iptables -t nat -A POSTROUTING -o router-eth2 -j MASQUERADE')

        # Configuring each host 
        for host in net.hosts:
            name = host.name
            if name in ('router', 'internet'):
                continue
            if 'phone' in name or 'wifi' in name or 'Laptop' in name:
                host.cmd('ip route del default 2>/dev/null; ip route add default via 192.168.1.1')
            elif 'PC' in name or 'wired' in name.lower():
                host.cmd('ip route del default 2>/dev/null; ip route add default via 192.168.2.1')
            elif 'server' in name.lower():
                host.cmd('ip route del default 2>/dev/null; ip route add default via 10.0.0.254')

        # Configuring the internet node 
        internet = net.get('internet')
        internet.cmd('ip route add 192.168.1.0/24 via 10.0.0.254')
        internet.cmd('ip route add 192.168.2.0/24 via 10.0.0.254')
        return net




# Helpers

def export_device_mapping(net):
    mapping = {}
    for host in net.hosts:
        ip = host.IP()
        if '192' in ip:
            mapping[ip] = {
                'name': host.name,
                'type': get_connection_type(host.name),
            }
    with open('device_mapping.json', 'w') as f:
        json.dump(mapping, f, indent=4)


def get_connection_type(name):
    if 'phone'  in name: return 'phone'
    if 'Laptop' in name: return 'laptop'
    if 'IOT'    in name: return 'iot'
    if 'server' in name: return 'server'
    if 'PC'     in name: return 'PC'
    if 'router' in name: return 'router'
    if 'printer' in name: return 'printer'
    return 'unknown'


# Main
#


TESTS = {
    "test1": {
        "hosts":   ["phone1", "phone2", "wiredPC", "wifiLaptop"],
    },
    "test2": {
        "hosts":   ["phone1", "wiredPC2", "wiredPC3", "wiredPC1", "wifiLaptop" ],
    },
    "test3 ": {
        "hosts":   ["IOT1", "phone1", "phone2", "wifiLaptop1", "wifiLaptop2", "wifiLaptop3", "wiredPC1" , "wiredPC2", "wiredprinter"],
    },
    "test4 ": {
        "hosts":   ["IOT1", "IOT2", "IOT3", "IOT4", "phone", "wiredPC1", "wiredPC2","wifiLaptop2", "wiredprinter"],
    },
    "test5 ": {
        "hosts":   ['phone1', 'phone2', 'phone3','phone4', 'phone5', 'wiredPC', 'wifiLaptop'],
    }
}

def createNetwork():
    servers = ['serverHTTP', 'serverTCP', 'serverUDP']

    topo= TopologyGenerator(host_names=TESTS["test1"]["hosts"], servers=servers)
    net = Mininet(
        topo=topo,
        controller=lambda name: RemoteController(name, ip='127.0.0.1', port=6633),
        switch=OVSSwitch,
        autoSetMacs=True,
    )
    net = topo.configure_hosts_routes(net)
    return net 



if __name__ == '__main__':
    setLogLevel('info')
    runTopo()


topos = {
    'minimal': TopologyGenerator,
}

