import {UserCardComponent} from "../types/User/UserCardComponent";
import {MainInfoUser} from "../types/User/MainInfoUser";

export function isUserMainInfo(user: UserCardComponent | MainInfoUser): user is MainInfoUser {
  return (user as UserCardComponent).isCompare === undefined
}
