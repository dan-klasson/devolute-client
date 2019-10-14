import React, { useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { useCookies } from 'react-cookie'
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
  password_repeat: string()
    .min(6, 'Password confirm has to be longer than 6 characters!')
    .required('Password confirm is required!')
    .test('passwords-match', 'Passwords must match', function(value) {
      return this.parent.password === value;
    }),
})

export default function Register() {
  const [response, submitData] = useSubmitData({endpoint: 'registration'})
  const [cookies, setCookie] = useCookies(['authtoken']);
  const handleRegister = (data) => submitData(data)

  useEffect(() => {
    if(response.data) {
      setCookie('authtoken', response.data)
    }
  })

  if(cookies.authtoken) {
    return <Redirect to="/" />
  }

  return (
    <Formik
      validationSchema={schema}
      onSubmit={handleRegister}
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
          <FormField
            name="password_repeat"
            label="Password confirm"
            type="password"
            placeholder="Re-enter Password"
            handleChange={handleChange}
            errors={errors}
            touched={touched}
          />
          {response.error ? (
            <Alert variant="danger">
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