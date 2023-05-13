export type UserNoCompareName = {
  name: string
}

export type UserNoCompareId = {
  id: number,
}

export type UserNoCompareCard = (UserNoCompareName | UserNoCompareId) & {
  isCompare: false
}
