#!/usr/bin/env bash

DIR="$( cd "$( dirname "$0" )" && pwd )"

echo -n "hostnamecallback({\"hostname\":\"" > ${DIR}/json/hostname.json
ip addr show wlan0 | grep inet | grep -v inet6 | awk -n '{print $2;}' | tr -d '\n' >> ${DIR}/json/hostname.json
echo "\"});" >> ${DIR}/json/hostname.json