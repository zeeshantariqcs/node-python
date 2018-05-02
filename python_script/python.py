import os
import sys
sys.path.append("..")
import argparse
import subprocess
import shlex
from mapper.webhook import Webhook

def get_stats(msisdn):
    cmd0 = "ovs-ofctl dump-flows br0"
    cmd1 = "grep "+ msisdn
    cmd2 = "awk '{print $4 $5}'"
    p0 = subprocess.Popen(cmd0, stdout=subprocess.PIPE, shell=True)
    p1 = subprocess.Popen(cmd1, stdin=p0.stdout, stdout=subprocess.PIPE, shell=True)
    p2 = subprocess.Popen(cmd2, stdin=p1.stdout, stdout=subprocess.PIPE, shell=True)
    p0.stdout.close()
    p1.stdout.close()
    out, err = p2.communicate()
    
    pkts = 0
    byts = 0
    output = out.split("\n")
    for l in output:
        if "," in l:
            pkts = pkts + int(l.split(",")[0].split("=")[1])
            byts = byts + int(l.split(",")[1].split("=")[1])
    return  pkts, byts

connected = "No"
hook = Webhook()
msisdn = sys.argv[1]
if hook.find_VIP(msisdn):
    priv_ip, pub_ip, port_min, port_max = hook.get_VIP_details(msisdn)
    pckts, byts = get_stats(priv_ip)
    if priv_ip == "None":
        print "0"
        print str(msisdn)
        print str(priv_ip)
        print str(pub_ip)
        print str(port_min)
        print connected
        print str(0)
        print str(0)
    else:
        connected = "Yes"
        print "0"
        print str(msisdn)
        print str(priv_ip)
        print str(pub_ip)
        print str(port_min) + "-" + str(port_max)
        print str(connected)
        print str(pckts)
        print str(byts)
else:
    print "-1"
