import { RollupOptions, OutputOptions } from 'rollup';
import * as fs from 'fs-extra';
import { concatAllArray } from 'jpjs';

import { paths } from './constants';
import { ReSpaceOptions, NormalizedOpts } from './types';

import { createRollupConfig } from './createRollupConfig';

let respaceConfig = {
  rollup(config: RollupOptions, _options: ReSpaceOptions): RollupOptions {
    return config;
  }
};

if (fs.existsSync(paths.appConfig)) {
  respaceConfig = require(paths.appConfig);
}

export async function createBuildConfigs(
  opts: NormalizedOpts
): Promise<Array<RollupOptions & { output: OutputOptions }>> {
  const allInputs = concatAllArray(
    opts.input.map((input: string) =>
      createAllFormats(opts, input).map(
        (options: ReSpaceOptions, index: number) => ({
          ...options,
          // We want to know if this is the first run for each entryfile
          // for certain plugins (e.g. css)
          writeMeta: index === 0
        })
      )
    )
  );

  return await Promise.all(
    allInputs.map(async (options: ReSpaceOptions) => {
      const config = await createRollupConfig(options);
      return respaceConfig.rollup(config, options);
    })
  );
}

function createAllFormats(
  opts: NormalizedOpts,
  input: string
): [ReSpaceOptions, ...ReSpaceOptions[]] {
  return [
    opts.format.includes('cjs') && {
      ...opts,
      format: 'cjs',
      env: 'development',
      input
    },
    opts.format.includes('cjs') && {
      ...opts,
      format: 'cjs',
      env: 'production',
      input
    },
    opts.format.includes('esm') && { ...opts, format: 'esm', input },
    opts.format.includes('umd') && {
      ...opts,
      format: 'umd',
      env: 'development',
      input
    },
    opts.format.includes('umd') && {
      ...opts,
      format: 'umd',
      env: 'production',
      input
    },
    opts.format.includes('system') && {
      ...opts,
      format: 'system',
      env: 'development',
      input
    },
    opts.format.includes('system') && {
      ...opts,
      format: 'system',
      env: 'production',
      input
    }
  ].filter(Boolean) as [ReSpaceOptions, ...ReSpaceOptions[]];
}
