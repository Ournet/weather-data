#!/bin/bash

yarn remove @ournet/domain
yarn remove @ournet/weather-domain
yarn remove dynamo-item

yarn link @ournet/domain
yarn link @ournet/weather-domain
yarn link dynamo-item

yarn test
