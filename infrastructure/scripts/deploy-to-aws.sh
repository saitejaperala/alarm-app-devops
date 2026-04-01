#!/bin/bash

set -e

echo "Starting deployment to AWS..."

SERVER_USER="ec2-user"
SERVER_IP="$1"
SSH_KEY="$HOME/.ssh/alarm-app-key"
APP_DIR="/home/ec2-user/alarm-app"

if [ -z "$SERVER_IP" ]; then
    echo "Error: Server IP not provided"
    echo "Usage: ./deploy-to-aws.sh <server-ip>"
    exit 1
fi

echo "Server IP: $SERVER_IP"

echo "Creating app directory on server..."
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" "mkdir -p $APP_DIR"

echo "Copying application files to server..."
rsync -avz \
    -e "ssh -i $SSH_KEY -o StrictHostKeyChecking=no" \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude '*.log' \
    --exclude 'infrastructure' \
    ../../ "$SERVER_USER@$SERVER_IP:$APP_DIR/"

echo "Files copied successfully"