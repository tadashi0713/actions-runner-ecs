import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as ActionsRunnerEcs from '../lib/actions-runner-ecs-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new ActionsRunnerEcs.ActionsRunnerEcsStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
