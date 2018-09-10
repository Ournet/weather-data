#!/bin/bash

yarn unlink @ournet/domain
yarn unlink @ournet/weather-domain
yarn unlink dynamo-model

yarn add @ournet/domain
yarn add @ournet/weather-domain
yarn add dynamo-model

yarn test
