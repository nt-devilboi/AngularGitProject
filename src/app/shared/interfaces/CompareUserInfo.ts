import {User} from "./User";

export type CompareInfo = User & {
  activeDay: number,
  activeTime: string,
  programmingLanguages: string[],
}
