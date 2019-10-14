import React from 'react'
import  { Redirect } from 'react-router-dom'
import { useCookies } from 'react-cookie';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import { Formik } from 'formik'
import { string, object } from 'yup'
import FormField from './formField';
import useSubmitData from './useSubmitData'

const schema = object({
  email: string()
    .email('E-mail is not valid!')
    .required('E-mail is required!'),
  password: string()
    .min(6, 'Password has to be longer than 6 characters!')
    .required('Password is required!'),
})

export default function Login() {
  const [response, submitData] = useSubmitData({endpoint: 'authentication'})
  const [cookies, setCookie] = useCookies(['authtoken'])

  const handleLogin = (data) => submitData(data)

  if(response.data) {
    setCookie('authtoken', response.data)
  }

  if(cookies.authtoken) {
    return <Redirect to="/" />
  }

  return (
    <Formik
      validationSchema={schema}
      onSubmit={handleLogin}
    >
      {({
        handleSubmit,
        handleChange,
        touched,
        errors,
      }) => (
        <Form onSubmit={handleSubmit} className="form" data-testid="form">
          <FormField
            name="email"
            label="Email"
            type="email"
            placeholder="Enter email"
            handleChange={handleChange}
            errors={errors}
            touched={touched}
          />
          <FormField
            name="password"
            label="Password"
            type="password"
            placeholder="Enter password"
            handleChange={handleChange}
            errors={errors}
            touched={touched}
          />
          {response.error ? (
            <Alert variant="danger" data-testid="invalid-login">
              {response.error.user_authentication}
            </Alert>) : null}
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
        )}
    </Formik>
  )
}