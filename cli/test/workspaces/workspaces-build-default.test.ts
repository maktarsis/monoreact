import * as shell from 'shelljs';

import { setupStage, teardownStage } from '../../src/shared/utils/fixture.utils';
import { smartExec } from '../../src/shared/utils/shell.utils';

shell.config.silent = false;

const testDir = 'workspaces';
const fixtureName = 'workspaces-build-default';

describe('[bin.execution.workspaces-build-default]', () => {
  beforeAll(() => {
    teardownStage(fixtureName);
    setupStage(testDir, fixtureName);
  });

  afterAll(() => {
    teardownStage(fixtureName);
  });

  it('should compile packages', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js workspaces build');
    expect(output.code).toBe(0);
  });

  it('should have compiled output', () => {
    const output = smartExec('node ../../../dist/src/bin/index.js workspaces build');
    expect(shell.test('-d', 'packages/workspaces-example-1/dist')).toBeTruthy();
    expect(shell.test('-d', 'packages/workspaces-example-2/dist')).toBeTruthy();
    expect(output.code).toBe(0);
  });
});