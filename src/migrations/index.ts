import * as migration_20250623_221647_init from './20250623_221647_init';

export const migrations = [
  {
    up: migration_20250623_221647_init.up,
    down: migration_20250623_221647_init.down,
    name: '20250623_221647_init'
  },
];
