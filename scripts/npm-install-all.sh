#!/bin/bash

# Loop through each directory in the services directory
for dir in ./services/*; do

    # Check if the directory has a node_modules directory
    if [ -d "$dir/node_modules" ]; then
        # Remove the node_modules directory
        echo "Removing node_modules directory from $dir"
        rm -rf "$dir/node_modules"
    fi

  # Check if the directory has a package.json file
  if [ -f "$dir/package.json" ]; then
    # Change directory to the directory with the package.json file
    cd "$dir"
    echo "Installing dependencies for $dir"
    # Run pnpm install
    npm install
    # Change directory back to the parent directory of the services directory
    cd ../..

  fi
done