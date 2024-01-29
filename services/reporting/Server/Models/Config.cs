namespace reporting.Models;

public class Config
{
    public ConnectingStrings ConnectionStrings { get; set; }
    public int Version { get; set; }
}

public class ConnectingStrings
{
    public string Postgres { get; set; }
    public string RabbitMQ { get; set; }
}