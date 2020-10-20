#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ActionsRunnerEcsStack } from '../lib/actions-runner-ecs-stack';

const app = new cdk.App();
new ActionsRunnerEcsStack(app, 'ActionsRunnerEcsStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
