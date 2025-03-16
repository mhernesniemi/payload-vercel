import * as migration_20250316_204833_init from './20250316_204833_init';

export const migrations = [
  {
    up: migration_20250316_204833_init.up,
    down: migration_20250316_204833_init.down,
    name: '20250316_204833_init'
  },
];
