import { highlight, info, success } from '../utils/color.utils';

export class BuildMessages {
  bundling = ({ source, module }: { source: string; module: string }) =>
    info(`${source} → ${module}`);

  successful = ([s, ms]: [number, number]) =>
    success('Done in ') + highlight(`${s}.${ms.toString().slice(0, 3)}s.`);
}
