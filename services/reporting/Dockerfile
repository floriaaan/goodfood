FROM mcr.microsoft.com/dotnet/nightly/sdk:8.0.101 AS build

WORKDIR /app

# Install EF tools and add to path
RUN dotnet tool install --global dotnet-ef
ENV PATH="${PATH}:/root/.dotnet/tools"

# Copy and restore dependencies
COPY ./reporting/Server/reporting.csproj ./Server/reporting.csproj
RUN dotnet restore ./Server/reporting.csproj

COPY ./reporting/CronJobs/CronJobs.csproj ./CronJobs/CronJobs.csproj
RUN dotnet restore ./CronJobs/CronJobs.csproj

# Copy the rest of the application files and build
COPY ./reporting/ ./
COPY ./proto ./proto

RUN dotnet publish ./Server/reporting.csproj -c Release -o /app/Server/out
RUN dotnet publish ./CronJobs/CronJobs.csproj -c Release -o /app/CronJobs/out

COPY ./reporting/script.sh /app/script.sh

# Expose port and specify startup command
EXPOSE 50020
EXPOSE 8080
EXPOSE 8081

CMD ["sh", "script.sh"]

