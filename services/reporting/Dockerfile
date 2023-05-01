FROM mcr.microsoft.com/dotnet/sdk:8.0.100-preview5-focal AS build

WORKDIR /app

# Copy and restore dependencies
COPY YourAppName.csproj .
RUN dotnet restore

# Copy the rest of the application files and build
COPY . .
RUN dotnet build -c Release -o out

# Install EF tools and add to path
RUN dotnet tool install --global dotnet-ef
ENV PATH="${PATH}:/root/.dotnet/tools"

# Add EF migrations
RUN dotnet ef migrations add InitialMigration

# Expose port and specify startup command
EXPOSE 50020
CMD ["bash", "/app/docker-entrypoint.sh"]
