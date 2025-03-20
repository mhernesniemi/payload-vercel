import * as migration_20250316_204833_init from './20250316_204833_init';
import * as migration_20250316_214934 from './20250316_214934';
import * as migration_20250319_215622 from './20250319_215622';
import * as migration_20250320_133130 from './20250320_133130';
import * as migration_20250320_133354 from './20250320_133354';

export const migrations = [
  {
    up: migration_20250316_204833_init.up,
    down: migration_20250316_204833_init.down,
    name: '20250316_204833_init',
  },
  {
    up: migration_20250316_214934.up,
    down: migration_20250316_214934.down,
    name: '20250316_214934',
  },
  {
    up: migration_20250319_215622.up,
    down: migration_20250319_215622.down,
    name: '20250319_215622',
  },
  {
    up: migration_20250320_133130.up,
    down: migration_20250320_133130.down,
    name: '20250320_133130',
  },
  {
    up: migration_20250320_133354.up,
    down: migration_20250320_133354.down,
    name: '20250320_133354'
  },
];
