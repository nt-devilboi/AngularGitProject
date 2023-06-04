import {StatsLines} from "./StatsLines";
import {Languages} from "./Language";

export type CommitsStats = {
  activeDay: number,
  activeTime: number,
  statsLines: StatsLines,
}

export type ProjectsStats = CommitsStats & {
  languages: Languages[],
}
