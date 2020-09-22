#!/usr/bin/env bash

rsync -avr -e "ssh -i ~/.ssh/nesta-personal-aws.pem" --exclude 'node_modules/*' ./* 52.72.84.212:/home/ubuntu/reddit