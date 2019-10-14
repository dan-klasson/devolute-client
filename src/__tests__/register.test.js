import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { render, fireEvent, waitForElement } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Register from '../register'

test('successfully register the user', async () => {
  const fakeUserResponse = {success: true, token: 'fake_user_token'}

  jest.spyOn(window, 'fetch').mockImplementationOnce(() => {
    return Promise.resolve({
      json: () => Promise.resolve(fakeUserResponse),
    })
  })
  const { getByText, getByLabelText, getAllByLabelText } = render(
    <Router>
      <Register />
      <Switch>
        <Route path="/">logged in</Route>
      </Switch>
    </Router>
  )

  fireEvent.change(getByLabelText(/email/i), {target: {value: 'dan@example.com'}})
  fireEvent.change(getAllByLabelText(/password/i)[0], {target: {value: 'password1234'}})
  fireEvent.click(getByText(/submit/i))

  await waitForElement(() => getByText(/logged in/i))
})

describe('validation', () => {

  it('has invalid email', async () => {
    const { getByLabelText, findByTestId } = render(<Register />)
    fireEvent.change(getByLabelText(/email/i), {target: {value: 'dan'}})
    const email = await findByTestId('invalid-email')
    expect(email).toHaveTextContent(/e-mail is not valid/i)
  })

  it('has too short password', async () => {
    const { getAllByLabelText, findByTestId } = render(<Register />)
    fireEvent.change(getAllByLabelText(/password/i)[0], {target: {value: 'foo'}})
    const password = await findByTestId('invalid-password')
    expect(password).toHaveTextContent(/password has to be longer than/i)
  })

  it('has passwords that do not match', async () => {
    const { getByLabelText, getAllByLabelText, findByTestId } = render(<Register />)
    fireEvent.change(getAllByLabelText(/password/i)[0], {target: {value: 'foo12345'}})
    fireEvent.change(getByLabelText(/password confirm/i), {target: {value: 'bar12345'}})
    const repeat = await findByTestId('invalid-password_repeat')
    expect(repeat).toHaveTextContent(/passwords must match/i)
  })
})