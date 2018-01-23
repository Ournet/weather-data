
// require('dotenv').load();

import test from 'ava';
import { DetailsReportRepository } from './ReportRepository';
import { DbConfig, createDbTables } from './db';
import { ReportData } from '@ournet/weather-domain';
import { ForecastUnits } from '../../weather-domain/types/entities/common';
// const DynamoDB = require('aws-sdk').DynamoDB;
const DYNAMO_PORT = 8001;

process.env.AWS_ACCESS_KEY_ID = '1'
process.env.AWS_SECRET_ACCESS_KEY = '1'
process.env.AWS_REGION = 'eu-central-1'

DbConfig.config({
    endpoint: 'http://localhost:' + DYNAMO_PORT,
    accessKeyId: '1',
    secretAccessKey: '1',
    region: 'eu-central-1'
});

const DynamoDbLocal = require('dynamodb-local');

DynamoDbLocal.configureInstaller({
    installPath: './temp',
    downloadUrl: 'https://s3.eu-central-1.amazonaws.com/dynamodb-local-frankfurt/dynamodb_local_latest.tar.gz'
});

test.before(async () => {
    await DynamoDbLocal.stop(DYNAMO_PORT);
    await DynamoDbLocal.launch(DYNAMO_PORT, null, ['-sharedDb', '-inMemory']);
    await createDbTables();
});

test.after.always(async () => {
    await DynamoDbLocal.stop(DYNAMO_PORT);
});

const detailsRepository = new DetailsReportRepository();

const report1: ReportData = { id:'IDREPORT1', units: ForecastUnits.SI, data: 'report data for report 1', createdAt: new Date(), expiresAt:new Date() };
const report2: ReportData = { id:'IDREPORT2', units: ForecastUnits.SI, data: 'report data for report 2', createdAt: new Date(), expiresAt:new Date() };

test('#create', async t => {
    await t.notThrows(detailsRepository.create(report1));
    await t.notThrows(detailsRepository.create(report2));

    await t.throws(detailsRepository.create(report1), /conditional request failed/, `Report with id=${report1.id} exists!`);
});

test('#exists', async t => {
    let exists = await detailsRepository.exists(report1.id);
    t.is(exists, true, `Place with id=${report1.id} exists`);
    exists = await detailsRepository.exists(report1.id);
    t.is(exists, true, `Place with id=${report1.id} exists`);
    exists = await detailsRepository.exists("asasa");
    t.is(exists, false, `Not found place with id=asasa`);
});

test('#getById', async t => {
    const id200 = await detailsRepository.getById('200');
    t.is(id200, null, 'Not found place id=1');
    const id1 = await detailsRepository.getById(report1.id);
    t.is(id1.id, report1.id, 'Found place with id=1');
    t.is(Object.keys(id1).length > 2, true, 'Get all fields');
    const id1Attrs = await detailsRepository.getById(report1.id, { fields: ['id'] });
    t.is(Object.keys(id1Attrs).length, 1, 'Filter getById fields');
});

test('#getByIds', async t => {
    const ids200_1 = await detailsRepository.getByIds(['200', report1.id], { fields: ['id', 'units'] });
    t.is(ids200_1.length, 1, 'Found just placeId1');
    t.is(Object.keys(ids200_1[0]).length, 2, 'Filter getByIds fields');

    const orderred1 = await detailsRepository.getByIds([report1.id, report2.id]);

    t.is(report1.id, orderred1[0].id, 'Placeid is first');
    t.is(report2.id, orderred1[1].id, 'Admin1 is second');

    const orderred2 = await detailsRepository.getByIds([report1.id, report2.id]);

    t.is(report1.id, orderred2[1].id, 'Placeid is second');
    t.is(report2.id, orderred2[0].id, 'Admin1 is first');
});
