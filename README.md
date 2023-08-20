# GoodFood 2.0

GoodFood 2.0 is a food ordering application for Good Food, a company specializing in food services in France, Belgium,
and Luxembourg.

## Origin / Context

Good Food was formed from the merger of four food companies. The company offers various food services, including
conventional dining, takeout, and delivery with phone orders. Ordering is also available through a web or mobile
application.

The GoodFood 2.0 project was initiated to update the existing ordering application, which had become outdated and was
unable to handle more users. The objective is to create a modern, user-friendly, and modular new version that can handle
a high volume of concurrent users, up to several thousand.

## Microservices ports

| Service      | Port  | Language    | Database   | Status | Assignee        |
| ------------ | ----- | ----------- | ---------- | ------ | --------------- |
| Gateway      | 50000 | Go          | ❌         | ❌     | @Anatole-Godard |
| User (auth)  | 50001 | Go          | PostgreSQL | ⚠️     | @Anatole-Godard |
| Basket       | 50002 | NodeJS (ts) | Redis      | ⚠️     | @Anatole-Godard |
| Payment      | 50003 | NodeJS (ts) | PostgreSQL | ✅     | @floriaaan      |
| Product      | 50004 | NodeJS (ts) | PostgreSQL | ❌     | @PierreLbg      |
| Restaurant   | 50005 | NodeJS (ts) | PostgreSQL | ❌     | @floriaaan      |
| Promotion    | 50006 | NodeJS (ts) | PostgreSQL | ❌     | @PierreLbg      |
| Order        | 50007 | NodeJS (ts) | PostgreSQL | ✅     | @floriaaan      |
| Delivery     | 50008 | NodeJS (ts) | PostgreSQL | ✅     | @floriaaan      |
| Stock        | 50009 | NodeJS (ts) | PostgreSQL | ⚠️     | @floriaaan      |
| Reporting    | 50020 | C# (dotnet) | PostgreSQL | ⚠️     | @floriaaan      |
| Log          | 50021 | Go          | PostgreSQL | ✅     | @floriaaan      |
| Notification | 50022 | NodeJS (ts) | PostgreSQL | ❌     | @PierreLbg      |
| (...)        | (...) | (...)       | (...)      | (...)  |

## File Hierarchy

The file hierarchy for this project is as follows:

```
.
├── .github/
│   └── workflows/
│       └── tests.yml
├── README.md
├── (...) # other files like .gitignore, etc.
├── apps/
│   ├── mobile/
│   └── web/
├── terraform/
│   └── env/
│       └── (...) # environments tfvars files
└── services/
    ├── gateway/
    │       ├── k8s/
    │       │   └── (...) # k8s files
    │       └── terraform/
    │           └── (...) # terraform files
    ├── user/
    ├── order/
    ├── delivery/
    ├── stock/
    ├── reporting/
    ├── (...) # other services
    └── proto/
        └── (...) # proto files
```

## Installation & usage

Each service has its own README.md file with installation and usage instructions.

Please refer to the README.md file of the service you want to install and use.

## Contributing

You can contribute to this project by:

- Reporting bugs
- Suggesting new features
- Submitting pull requests

Any help is welcome, and we will try to answer as soon as possible.
Please read the [CONTRIBUTING.md](CONTRIBUTING.md) file for more information.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Authors

- **[Florian LEROUX](https://github.com/floriaaan)**
- **[Anatole GODARD](https://github.com/Anatole-Godard)**
- **[Pierre LEBIGRE](https://github.com/PierreLbg)**
