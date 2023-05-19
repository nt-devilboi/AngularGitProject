import {UserCardComponent} from "../interfaces/Staff/UserCardComponent";
import {MainInfoUser} from "../interfaces/MainInfoUser";

export function isUserMainInfo(user: UserCardComponent | MainInfoUser): user is MainInfoUser {
  return (user as UserCardComponent).isCompare === undefined
}
