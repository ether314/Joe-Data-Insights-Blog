#!/bin/sh
set -e
apk add --no-cache expect >/dev/null
npm install -g firebase-tools@latest >/tmp/fb.log 2>&1
expect /scripts/tmp-firebase-login.exp
