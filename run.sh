#!/bin/sh

docker run --detach \
	--env BOT_API_TOKEN="YOUR-SLACK-API-TOKEN-HERE" \
	--restart=unless-stopped \
	--log-opt max-size=10m \
	--log-opt max-file=3 \
camriera/slackbot-shoresy