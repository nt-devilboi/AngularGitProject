export interface Project {
  id: number,
  created_at: Date,
  stats: Stats
}

export interface Stats {
  additions: number,
  deletions: number,
  total: number
}
