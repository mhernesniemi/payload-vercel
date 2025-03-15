import * as migration_20250303_084600_init from './20250303_084600_init';
import * as migration_20250315_125407 from './20250315_125407';

export const migrations = [
  {
    up: migration_20250303_084600_init.up,
    down: migration_20250303_084600_init.down,
    name: '20250303_084600_init',
  },
  {
    up: migration_20250315_125407.up,
    down: migration_20250315_125407.down,
    name: '20250315_125407'
  },
];
