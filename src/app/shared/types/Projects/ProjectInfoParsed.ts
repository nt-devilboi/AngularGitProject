import {StatsLines} from "./StatsLines";
import {LanguagesStats} from "./Language";

export type ProjectInfoParsed = {
  days: number[],
  time: number[],
  stats: StatsLines,
  languages: Partial<LanguagesStats>,
}
