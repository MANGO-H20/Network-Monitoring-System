import time

# Normal Traffic

class GenerateTraffic:
    def __init__(self):
        self.processes         = []
        self.http_server_IP    = None
        self.tcp_udp_server_IP = None

    # Starting the network 
    def start(self ,net):    
        hosts = net.hosts
        self.serverSetup(hosts)
        time.sleep(2)
        self.generateTraffic(hosts)


    # Creates each server on the simulated network 
    # Server Types: 
    #   - HTTP server 
    #   - IPerf TCP server
    #   - Iperf UDP server
    def serverSetup(self, nodes):
        for node in nodes:
            if 'HTTP' in node.name:
                self.http_server_IP = node.IP()
                self.processes.append(self.startHTTP(node))
            if 'TCP' in node.name:
                self.tcp_udp_server_IP = node.IP()
                self.processes.append(self.startIperf(node))
            if 'UDP' in node.name:
                self.tcp_udp_server_IP = node.IP()
                self.processes.append(self.startIperf(node, udp=True))

    def startHTTP(self, host, port=8000):
        return host.popen(['python3', '-m', 'http.server', str(port)],
                          stdout=None, stderr=None)

    def startIperf(self, host, udp=False, port=5001):
        args = ['iperf', '-s', '-p', str(port)]
        if udp:
            args.insert(2, '-u')
        return host.popen(args)

    # Gernerates different traffic types 
    # Traffic types 
    #   - Phone 
    #   - IoT 
    #   - Streaming 
    def generateTraffic(self, nodes):
        for node in nodes:
            if 'phone' in node.name or 'wifi' in node.name:
                self.processes.append(self.generatePhoneTraffic(node))
            elif 'IOT' in node.name:
                self.processes.append(self.generateIoTTraffic(node))
            elif 'TV' in node.name:
                self.processes.append(self.generateStreamingTraffic(node))

    def generatePhoneTraffic(self, node):
        cmd = """
        while true; do
            curl -s http://{}:8000 >/dev/null
            sleep $((RANDOM % 5 + 1))
        done
        """.format(self.http_server_IP)
        return node.popen(['bash', '-lc', cmd])

    def generateStreamingTraffic(self, node):
        return node.popen(['iperf', '-c', self.tcp_udp_server_IP,
                           '-t', '1000', '-i', '1'])

    def generateIoTTraffic(self, node):
        cmd = f"""
        while true; do
            curl -s http://{self.http_server_IP}:8000 >/dev/null
            sleep 60
        done
        """
        return node.popen(['bash', '-lc', cmd])


    def stopAll(self):
        for p in self.processes:
            if p:
                p.terminate()



