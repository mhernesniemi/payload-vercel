import * as migration_20250316_182414_initial from './20250316_182414_initial';
import * as migration_20250316_185322 from './20250316_185322';

export const migrations = [
  {
    up: migration_20250316_182414_initial.up,
    down: migration_20250316_182414_initial.down,
    name: '20250316_182414_initial',
  },
  {
    up: migration_20250316_185322.up,
    down: migration_20250316_185322.down,
    name: '20250316_185322'
  },
];
