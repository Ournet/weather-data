#!/bin/bash

yarn remove @ournet/domain
yarn remove @ournet/weather-domain
yarn remove dynamo-model

yarn link @ournet/domain
yarn link @ournet/weather-domain
yarn link dynamo-model

yarn test
