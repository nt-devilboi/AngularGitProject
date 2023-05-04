import {Stats} from "../Projects/Stats";

export type Commit = {
  id: string,
  project_id: string,
  created_at: Date,
  stats?: Stats
}
