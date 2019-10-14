import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { render, fireEvent, waitForElement } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Login from '../login'

test('successfully logs the user in', async () => {
  const fakeUserResponse = {success: true, token: 'fake_user_token'}

  jest.spyOn(window, 'fetch').mockImplementationOnce(() => {
    return Promise.resolve({
      json: () => Promise.resolve(fakeUserResponse),
    })
  })
  const { getByText, getByLabelText, } = render(
    <Router>
      <Login />
      <Switch>
        <Route path="/">logged in</Route>
      </Switch>
    </Router>
  )

  fireEvent.change(getByLabelText(/email/i), {target: {value: 'dan@example.com'}})
  fireEvent.change(getByLabelText(/password/i), {target: {value: 'password1234'}})
  fireEvent.click(getByText(/submit/i))

  await waitForElement(() => getByText(/logged in/i))
})

test('fails at validation', async () => {
  const { getByText, getByLabelText, findByTestId } = render(<Login />)

  fireEvent.change(getByLabelText(/email/i), {target: {value: 'dan'}})
  fireEvent.change(getByLabelText(/password/i), {target: {value: 'foo'}})
  fireEvent.click(getByText(/submit/i))

  const email = await findByTestId('invalid-email')
  expect(email).toHaveTextContent(/e-mail is not valid/i)

  const password = await findByTestId('invalid-password')
  expect(password).toHaveTextContent(/password has to be longer than/i)
})

test('fails logging in the user', async () => {
  const fakeUserResponse = {
      success: false,
      errors: {user_authentication: "Invalid credentials"}
  }
  jest.spyOn(window, 'fetch').mockImplementationOnce(() => {
    return Promise.resolve({
      json: () => Promise.resolve(fakeUserResponse),
    })
  })
  const { getByText, getByLabelText, findByTestId } = render(<Login />)

  fireEvent.change(getByLabelText(/email/i), {target: {value: 'dan@example.com'}})
  fireEvent.change(getByLabelText(/password/i), {target: {value: 'foo123456'}})
  fireEvent.click(getByText(/submit/i))

  const login = await findByTestId('invalid-login')
  expect(login).toHaveTextContent(/invalid credentials/i)
})