import {AllInfoUser} from "../interfaces/AllInfoUser";

export function compare(users: AllInfoUser[], compareFunc: (user: AllInfoUser, maxValue: number) => [boolean, number]): AllInfoUser {
  let result!: AllInfoUser
  let maxValue: number = 0

  users.forEach(user => {
    const compareResult = compareFunc(user, maxValue)

    if (compareResult[0]) {
      result = user
      maxValue = compareResult[1]
    }
  })

  return result
}
