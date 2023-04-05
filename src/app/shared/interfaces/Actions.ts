export type Action = 'approved' | 'pushed';

export type ActionCount = {
  action: Action,
  count: number
}

export type Actions = {
  [key in Action]: number;
}
