#!/bin/bash

aws s3api head-object --bucket $1 --key config.json || not_exists=true
if [ $not_exists ]; then echo "$CONFIG" > ../config/config.json; aws s3 cp ../config/config.json s3://$1/config.json; else aws s3 cp s3://$1/config.json ../config/config.json; fi
