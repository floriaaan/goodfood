#!/bin/bash

set -e

# Apply EF migrations to the database
cd /app/Server
dotnet ef database update

# Start the application

# Start process1 in the background
exec dotnet /app/Server/out/reporting.dll &

# Store the PID of the background process
process1_pid=$!

# Start process2 in the background
exec dotnet /app/CronJobs/out/CronJobs.dll &

# Store the PID of the second background process
process2_pid=$!

# Wait for both processes to finish
wait $process1_pid $process2_pid
