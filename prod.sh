#!/bin/bash

yarn unlink @ournet/domain
yarn unlink @ournet/weather-domain
yarn unlink dynamo-item

yarn add @ournet/domain
yarn add @ournet/weather-domain
yarn add dynamo-item

yarn test
