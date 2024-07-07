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
| Gateway      | 50000 | Go          | ❌         | ✅     | @Anatole-Godard |
| User (auth)  | 50001 | Go          | PostgreSQL | ✅     | @Anatole-Godard |
| Basket       | 50002 | NodeJS (ts) | Redis      | ✅     | @Anatole-Godard |
| Payment      | 50003 | NodeJS (ts) | PostgreSQL | ✅     | @floriaaan      |
| Product      | 50004 | NodeJS (ts) | PostgreSQL | ✅     | @PierreLbg      |
| Restaurant   | 50005 | NodeJS (ts) | PostgreSQL | ✅     | @floriaaan      |
| Promotion    | 50006 | NodeJS (ts) | PostgreSQL | ✅     | @PierreLbg      |
| Order        | 50007 | NodeJS (ts) | PostgreSQL | ✅     | @floriaaan      |
| Delivery     | 50008 | NodeJS (ts) | PostgreSQL | ✅     | @floriaaan      |
| Stock        | 50009 | NodeJS (ts) | PostgreSQL | ✅     | @floriaaan      |
| Reporting    | 50020 | C# (dotnet) | PostgreSQL | ✅     | @floriaaan      |
| Log          | 50021 | Go          | PostgreSQL | ✅     | @floriaaan      |
| Notification | 50022 | NodeJS (ts) | PostgreSQL | ✅     | @PierreLbg      |
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

### Terraform

Create stuff in azure and put them in [environnement](terraform/env/dev-backend.tfvars):
 - Resource group `resource_group_name = "The name"`
 - Storage account `storage_account_name = "The name"`
 - Container in the storage account `container_name = "The name"`

```shell
cd terraform
terraform init --backend-config=env/dev-backend.tfvars
terraform apply -var-file="env/dev.tfvars" -auto-approve
```
---

Now you can deploy services:
```shell
cd services/product/terraform/
terraform init --backend-config=env/dev-backend.tfvars
terraform apply -var-file="env/dev.tfvars" -auto-approve
```

```shell
cd services/user/terraform/
terraform init --backend-config=env/dev-backend.tfvars
terraform apply -var-file="env/dev.tfvars" -auto-approve
```

```shell
cd services/gateway/terraform/
terraform init --backend-config=env/dev-backend.tfvars
terraform apply -var-file="env/dev.tfvars" -auto-approve
```
### Docker

You can use Docker to run the microservices and the gateway.

To do so, you will need to have Docker installed on your system.

You can then run the following command to start the microservices and the gateway:

```shell
docker-compose -f services/docker-compose.yml up -d --build
```

### Kubernetes

To create the kubernetes cluster you need to run the following command:
```shell
cd kubernetes
kind create cluster --config kind-config.yaml
```

You can use Kubernetes to run the microservices and the gateway.
For that create the secret for the docker registry (take care of replacing the placeholders):
```shell
kubectl create secret docker-registry registry-credential --docker-server=https://hub.docker.com --docker-username=PierreLbg --docker-password=3o6gzWTiA#Vc%3 --docker-email=pierre.lebigre@outlook.fr
```

Then make the secret usable by the service account:
```shell
kubectl get secret registry-credential --output="jsonpath={.data.\.dockerconfigjson}" | base64 --decode
```

Then you can deploy the services:
```shell
cd kubernetes
kubectl apply -f ./basket,./delivery,./gateway,./generic,./log,./notification,./order,./payment,./product,./promotion,./restaurant,./stock,./user
```

Then you can run your web application. Make sure to change the URL in the web application environment file to http://localhost:50000.
If you need to redeploy your services after merge a new version of a services use
```shell
kubectl rollout restart deployment --namespace=default
```

### Development

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
