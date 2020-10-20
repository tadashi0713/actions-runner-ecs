import * as cdk from '@aws-cdk/core';
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ssm from "@aws-cdk/aws-ssm";
import * as iam from "@aws-cdk/aws-iam";

export class ActionsRunnerEcsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, "ActionsRunnerEcsVpc", {
      maxAzs: 1,
    });

    // cluster

    const cluster = new ecs.Cluster(this, "ActionsRunnerEcsCluster", {
      vpc: vpc,
    });

    cluster.addCapacity('ActionsRunnerEcsCapacity', {
      instanceType: new ec2.InstanceType("t3.small"),
      spotInstanceDraining: true
    });

    // task definition

    const taskRole = new iam.Role(this, 'ActionsRunnerEcs', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerServiceTaskRole'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerRegistryPowerUser')
      ],
    })

    const taskDefinition = new ecs.Ec2TaskDefinition(
      this,
      "ActionsRunnerEcsTaskDefinition",
      {
        taskRole: taskRole
      }
    );

    taskDefinition.addVolume({
      name: "docker_sock",
      host: {
        sourcePath: "/var/run/docker.sock"
      }
    })

    // container definition

    const containerDefinition = taskDefinition.addContainer("ActionsRunnerEcsContainer", {
      environment: {
        ORG_RUNNER: "true",
        ORG_NAME: "org",
        RUNNER_WORKDIR: "/tmp/runner",
        RUNNER_NAME: `ecs`
      },
      image: ecs.ContainerImage.fromRegistry("myoung34/github-runner"),
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: "ActionsRunnerEcs" }),
      memoryLimitMiB: 500,
      secrets: {
        ACCESS_TOKEN: ecs.Secret.fromSsmParameter(
          ssm.StringParameter.fromSecureStringParameterAttributes(
            this,
            "GitHubAccessToken",
            {
              parameterName: "ACCESS_TOKEN",
              version: 0,
            }
          )
        )
      },
    });

    containerDefinition.addMountPoints({
      containerPath: "/var/run/docker.sock",
      sourceVolume: "docker_sock",
      readOnly: true
    })

    // service

    const ecsService = new ecs.Ec2Service(
      this,
      "ActionsRunnerEcsService",
      {
        cluster,
        taskDefinition
      }
    );
  }
}
