#! /bin/bash

# if $1 is empty, assign $1 to emulator-5554
if [ -z $1 ]; then
    set $1 emulator-5554
fi

# This script is used to set the adb port to 3000 and 3001
adb -s $1 reverse tcp:3000 tcp:3000
adb -s $1 reverse tcp:3001 tcp:3001