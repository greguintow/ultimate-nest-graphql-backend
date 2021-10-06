export const CORE_USER_FIELDS = `
  fragment CoreUserFields on User {
    id
    name
    email
    photoUrl
    createdAt
  }
`

export const CORE_USER_LOGIN_FIELDS = `
  ${CORE_USER_FIELDS}
  fragment CoreUserLoginFields on UserLogin {
    token
    user {
      ...CoreUserFields
    }
  }
`

export const SIGN_UP_USER = `
  ${CORE_USER_LOGIN_FIELDS}
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      ...CoreUserLoginFields
    }
  }
`

export const LOGIN_USER = `
  ${CORE_USER_LOGIN_FIELDS}
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      ...CoreUserLoginFields
    }
  }
`

export const GET_USER = `
  ${CORE_USER_FIELDS}
  query Me {
    me {
      ...CoreUserFields
    }
  }
`
