#!/usr/bin/env bash

DIR="$( cd "$( dirname "$0" )" && pwd )"

echo -n "{\"hostname\":\"" > ${DIR}/json/hostname.json
ip addr show eth0 | grep inet | grep -v inet6 | awk -n '{print $2;}' | tr -d '\n' >> ${DIR}/json/hostname.json
echo "\"}" >> ${DIR}/json/hostname.json