FROM mcr.microsoft.com/dotnet/nightly/sdk:latest AS build

WORKDIR /app

# Copy and restore dependencies
COPY ./reporting/Server/reporting.csproj .
RUN dotnet restore

# Copy the rest of the application files and build
COPY ./reporting/Server .
COPY ./reporting/script.sh ./script.sh
COPY ./proto ./Protos

RUN dotnet build -c Release -o out

# Install EF tools and add to path
RUN dotnet tool install --global dotnet-ef
ENV PATH="${PATH}:/root/.dotnet/tools"

# # Add EF migrations
# RUN dotnet ef migrations add InitialMigration

# Expose port and specify startup command
EXPOSE 50020
CMD ["sh", "script.sh"]
