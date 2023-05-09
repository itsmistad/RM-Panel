#!/bin/bash

rm -f eslint.txt tests.txt

RESULT=$(../node_modules/.bin/eslint "../src/**")
if [[ $RESULT == *"problem"* ]]; then
    echo "$RESULT" > "eslint.txt"
    echo -e "\e[31mLinting failed! See eslint.txt for more information."
    exit 1
fi

RESULT=$(../node_modules/.bin/mocha "../src/test/**/*.test.js" --timeout 5000)
if [[ $RESULT == *"failing"* ]]; then
    echo "$RESULT" > "tests.txt"
    echo -e "\e[31mTesting failed! See tests.txt for more information.\e[0m"
    exit 2
fi

export SKIP_BROWSER_SYNC=1

../node_modules/.bin/gulp

export SKIP_BROWSER_SYNC=0

cd ../src
node app.js