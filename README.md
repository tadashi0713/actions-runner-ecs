# GitHub Actions runner on AWS ECS

This repository contains an example how to run self-hosted GitHub Actions runners on AWS ECS.

## Docker image

This sample uses [myoung34/github-runner](https://github.com/myoung34/docker-github-actions-runner) docker image.

## Deployment

The application is deployed to AWS ECS using [AWS Cloud Development Kit (AWS CDK)](https://docs.aws.amazon.com/cdk/index.html).

* Store a parameter ACCESS_TOKEN(GitHub personal access token) in to SSM Parameter Store.
* Run cdk synth --profile <your-aws-cli-profile>
* Run cdk deploy --profile <your-aws-cli-profile>
* Wait a little while ... and you should be able find your self-hosted runner

For generationg GitHub personal access token, [check this](https://github.com/myoung34/docker-github-actions-runner#create-github-personal-access-token).

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
