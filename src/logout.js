import React from 'react'
import { useCookies } from 'react-cookie';
import { Redirect } from 'react-router-dom'

export default function Logout() {
  const [, , removeCookie] = useCookies(['authtoken']);
  removeCookie('authtoken')
  return <Redirect to="/" />
}
