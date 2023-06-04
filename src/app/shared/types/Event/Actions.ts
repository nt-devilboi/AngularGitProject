export type Action = 'approved' | 'commit';

export type Actions = {
  [key in Action]: number;
}
