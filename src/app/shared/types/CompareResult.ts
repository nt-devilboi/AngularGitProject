import {AllInfoUser} from "./User/AllInfoUser";

export type CompareResult = {
  commit: AllInfoUser,
  approved: AllInfoUser,
  langs: AllInfoUser,
  add: AllInfoUser,
  delete: AllInfoUser,
  total: AllInfoUser,
  username: AllInfoUser,
  rest: AllInfoUser[]
}
