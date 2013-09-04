#!/usr/bin/env python

import os
import socket

here = os.path.abspath(os.path.dirname(__file__))

with open(here + "/json/hostname.json", "w") as text_file:
    text_file.write("{\"hostname\": \"%s\"}"%socket.gethostbyname(socket.gethostname()) )