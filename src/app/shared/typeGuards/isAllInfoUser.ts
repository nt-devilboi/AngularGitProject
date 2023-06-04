import {MainInfoUser} from "../types/User/MainInfoUser";
import {AllInfoUser} from "../types/User/AllInfoUser";

export function isAllInfoUser(user: MainInfoUser): user is AllInfoUser {
  return (user as AllInfoUser).activeDay !== undefined
}
