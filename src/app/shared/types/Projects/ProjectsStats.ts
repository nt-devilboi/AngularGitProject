import {StatsLines} from "./StatsLines";
import {Languages} from "./Language";

export type ProjectsStats = {
  activeDay: number,
  activeTime: number,
  statsLines: StatsLines,
  languages: Languages[],
}
