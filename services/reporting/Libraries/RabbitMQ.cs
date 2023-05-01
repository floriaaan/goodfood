using System.Text;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace reporting.Libraries.RabbitMQ;

public class RabbitMQClient
{
    private readonly ConnectionFactory? _factory;
    private readonly IConnection? _connection;
    private readonly IModel? _channel;
    private readonly string _queueName;

    public RabbitMQClient(string queueName)
    {
        _queueName = queueName;
        try
        {
            // TODO: Move to config
            _factory = new ConnectionFactory { HostName = "localhost" };
            _connection = _factory.CreateConnection();
            _channel = _connection.CreateModel();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error establishing RabbitMQ connection: {ex.Message}");
        }
    }

    public void Publish(string message)
    {
        if (_channel == null) return;
        _channel.QueueDeclare(queue: _queueName,
            durable: false,
            exclusive: false,
            autoDelete: false,
            arguments: null);

        var body = Encoding.UTF8.GetBytes(message);

        _channel.BasicPublish(exchange: "",
            routingKey: _queueName,
            basicProperties: null,
            body: body);
    }

    public void Subscribe(Action<string> callback)
    {
        if (_channel == null) return;
        _channel.QueueDeclare(queue: _queueName,
            durable: false,
            exclusive: false,
            autoDelete: false,
            arguments: null);

        var consumer = new EventingBasicConsumer(_channel);

        consumer.Received += (model, ea) =>
        {
            var body = ea.Body.ToArray();
            var message = Encoding.UTF8.GetString(body);
            Console.WriteLine($"Received {message}");
            callback(message);
        };

        _channel.BasicConsume(queue: _queueName,
            autoAck: true,
            consumer: consumer);
    }

    public void Dispose()
    {
        _channel?.Close();
        _connection?.Close();
    }

}