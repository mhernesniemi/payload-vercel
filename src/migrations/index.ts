import * as migration_20250303_084600_init from './20250303_084600_init';

export const migrations = [
  {
    up: migration_20250303_084600_init.up,
    down: migration_20250303_084600_init.down,
    name: '20250303_084600_init'
  },
];
