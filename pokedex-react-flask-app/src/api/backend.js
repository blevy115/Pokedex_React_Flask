import { gql } from "@apollo/client";

const LOGIN_MUTATION = gql`
  mutation loginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        name
        email
      }
    }
  }
`;

const LOGOUT_MUTATION = gql`
  mutation logoutMutation {
    logout {
      token
    }
  }
`;

const SIGNUP_MUTATION = gql`
  mutation signupMutation($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      token
      user {
        name
        email
        password
      }
    }
  }
`;

export { LOGIN_MUTATION, LOGOUT_MUTATION, SIGNUP_MUTATION };
