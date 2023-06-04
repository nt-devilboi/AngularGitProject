import {UserNoCompareCard, UserNoCompareId} from "../types/User/UserNoCompareCard";

// @ts-ignore
export function isSearchById(user: UserNoCompareCard): user is UserNoCompareId {
  return (user as UserNoCompareId).id !== undefined
}
