#!/bin/bash

# Check if the binary exists
if [ -f "dist/tower_defense_linux" ]; then
    # Make sure it's executable
    chmod +x dist/tower_defense_linux
    # Run the game
    ./dist/tower_defense_linux
else
    echo "Error: Game binary not found. Please run build.sh first."
    exit 1
fi 