import {MainInfoUser} from "../interfaces/MainInfoUser";
import {AllInfoUser} from "../interfaces/AllInfoUser";

export function isAllInfoUser(user: MainInfoUser): user is AllInfoUser {
  return (user as AllInfoUser).activeDay !== undefined
}
