import {UserCardComponent} from "../types/User/UserCardComponent";
import {UserNoCompareCard} from "../types/User/UserNoCompareCard";

export function isUserNoCompare(user: UserCardComponent): user is UserNoCompareCard {
  return !user.isCompare
}
