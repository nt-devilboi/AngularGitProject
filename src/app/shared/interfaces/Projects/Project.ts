import {StatsLines} from "./StatsLines";
import {Language1} from "./Language";

export type Project = {
  id: number,
  created_at: Date,
  statsLines: StatsLines
  languages: Partial<Language1>
}
