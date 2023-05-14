import {UserCardComponent} from "../interfaces/Staff/UserCardComponent";
import {UserNoCompareCard} from "../interfaces/Staff/UserNoCompareCard";

export function isUserNoCompare(user: UserCardComponent): user is UserNoCompareCard {
  return !user.isCompare
}
