#!/bin/sh
# Start shell script for elastic beanstalk

cd /var/app/current/iansangels_fronted
sudo npm install
sudo npm run dev -p 5000