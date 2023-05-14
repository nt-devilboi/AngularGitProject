import {UserNoCompareCard, UserNoCompareId} from "../interfaces/Staff/UserNoCompareCard";

// @ts-ignore
export function isSearchById(user: UserNoCompareCard): user is UserNoCompareId {
  return (user as UserNoCompareId).id !== undefined
}
