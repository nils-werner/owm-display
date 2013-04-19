#!/bin/bash

git pull origin master &> /dev/null
curl http://www.dwd.de/wundk/radar/Radarfilm_WEB_SE.gif -o /dev/shm/Radarfilm_WEB_SE.gif &> /dev/null