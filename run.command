#!/bin/bash

# Get the directory where the script is located
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Check if the binary exists
if [ -f "$DIR/dist/tower_defense_mac" ]; then
    # Make sure it's executable
    chmod +x "$DIR/dist/tower_defense_mac"
    # Run the game
    "$DIR/dist/tower_defense_mac"
else
    echo "Error: Game binary not found. Please run build.sh first."
    exit 1
fi 