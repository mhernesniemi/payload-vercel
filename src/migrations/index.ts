import * as migration_20250316_204833_init from './20250316_204833_init';
import * as migration_20250316_214934 from './20250316_214934';

export const migrations = [
  {
    up: migration_20250316_204833_init.up,
    down: migration_20250316_204833_init.down,
    name: '20250316_204833_init',
  },
  {
    up: migration_20250316_214934.up,
    down: migration_20250316_214934.down,
    name: '20250316_214934'
  },
];
