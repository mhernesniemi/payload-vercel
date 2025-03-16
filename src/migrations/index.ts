import * as migration_20250316_182414_initial from './20250316_182414_initial';

export const migrations = [
  {
    up: migration_20250316_182414_initial.up,
    down: migration_20250316_182414_initial.down,
    name: '20250316_182414_initial'
  },
];
