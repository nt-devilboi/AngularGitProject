export type Action = 'approved' | 'commit';

export type ActionCount = {
  action: Action,
  count: number
}

export type Actions = {
  [key in Action]: number;
}
