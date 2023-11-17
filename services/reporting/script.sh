#!/bin/bash

set -e

# Apply EF migrations to the database
dotnet ef database update

# Start the application
exec dotnet /app/out/reporting.dll
