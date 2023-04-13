export type Project = {
  id: number,
  created_at: Date,
  stats: Stats
}

export type Stats =  {
  additions: number,
  deletions: number,
  total: number
}
