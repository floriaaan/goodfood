#!/usr/bin/env bash

# bash list of proto files ([order.proto])


IN_DIR="$(pwd)/../proto"
OUT_DIR="."
PROTOC="$(npm bin)/grpc_tools_node_protoc"

# Generate reflection descriptor
$PROTOC \
    -I $IN_DIR \
    $IN_DIR/order.proto \
    --descriptor_set_out=$OUT_DIR/reflection_descriptor.bin \
   