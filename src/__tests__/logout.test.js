import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { render, waitForElement } from '@testing-library/react'
import { CookiesProvider } from 'react-cookie';
import Cookies from 'universal-cookie';
import '@testing-library/jest-dom/extend-expect'
import Logout from '../logout'

test('successfully logs the user out', async () => {
  const cookie = new Cookies({authtoken: 'some-token'});
  const { getByText } = render(
    <CookiesProvider cookies={cookie}>
      <Router>
        <Logout />
        <Switch>
          <Route path="/">logged out</Route>
        </Switch>
      </Router>
    </CookiesProvider>
  )

  await waitForElement(() => getByText(/logged out/i))
})
