#!/bin/bash

cd terraform || exit
terraform init
terraform plan -out="tf.plan"
terraform apply "tf.plan"
#Only keep the first 7 line of the configmap file (before "data:") which will be fill with terraform output
sed '1,7!d' ../k8s/configmap.yml > tmpfile && mv tmpfile ../k8s/configmap.yml
#sed delete spaces; add two space at the start of each line; replace = by : and delete line 6 (KUBE_CONFIG)
terraform output | sed 's/ //g; s/^/  /g; s/=/: /g; 6d' >> ../k8s/configmap.yml

cd ../prisma || exit
npx prisma migrate dev --name init

cd ../terraform || exit
echo "$(terraform output kube_config)" | sed '1d; s/EOT//g' > ../k8s/azurek8s

cd ../k8s || exit
export KUBECONFIG=./azurek8s
kubectl apply -f .
kubectl get services -o wide