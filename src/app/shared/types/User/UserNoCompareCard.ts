export type UserNoCompareName = {
  name: string
}

export type UserNoCompareId = {
  id: string,
}

export type UserNoCompareCard = (UserNoCompareName | UserNoCompareId) & {
  isCompare: false
}
