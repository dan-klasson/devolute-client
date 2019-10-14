import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { render, waitForElement } from '@testing-library/react'
import { CookiesProvider } from 'react-cookie';
import Cookies from 'universal-cookie';
import '@testing-library/jest-dom/extend-expect'
import Image from '../image'

const ImageComponent = (props) => {
  return (
    <CookiesProvider cookies={props.cookie}>
      <Router>
        <Image />
        <Switch>
          <Route path="/login">logged out</Route>
        </Switch>
      </Router>
    </CookiesProvider>
  )
}

test('successfully displays the images', async () => {
  const fakeUserResponse = [{
      title: 'foo.png',
      standard: 'http://example.com/foo.png',
      thumbnail: 'http://example.com/foo-small.png',
    },{
      title: 'bar.png',
      standard: 'http://example.com/bar.png',
      thumbnail: 'http://example.com/bar-small.png',
  }]
  jest.spyOn(window, 'fetch').mockImplementationOnce(() => {
    return Promise.resolve({
      json: () => Promise.resolve(fakeUserResponse),
    })
  })
  const cookie = new Cookies({authtoken: 'some-token'});
  const { findAllByTestId } = render(<ImageComponent cookie={cookie} />)

  const columns = await waitForElement(() => findAllByTestId('image-column'))
  expect(columns).toHaveLength(2)

  const links = await waitForElement(() => findAllByTestId('image-link'))
  expect(links[0].href).toEqual('http://example.com/foo.png')

  const images = await waitForElement(() => findAllByTestId('image'))
  expect(images[0].src).toEqual('http://example.com/foo-small.png')
  expect(images[0].alt).toEqual('foo.png')
})

test('redirects to login when unauthenticated', async () => {
  const { getByText } = render(<ImageComponent cookie={null} />)

  await waitForElement(() => getByText(/logged out/i))
})
