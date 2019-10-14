import React from 'react'
import Form from 'react-bootstrap/Form'

export default function FormField(props) {
  return (
    <Form.Group controlId={props.name}>
      <Form.Label>{props.label}</Form.Label>
      <Form.Control
        type={props.type}
        name={props.name}
        placeholder={props.placeholder}
        onChange={props.handleChange}
        isInvalid={!!props.errors[props.name]}
        isValid={props.touched[props.name] && !props.errors[props.name]}
      />
      <Form.Control.Feedback type="invalid" data-testid={`invalid-${props.name}`}>
        {props.errors[props.name]}
      </Form.Control.Feedback>
    </Form.Group>
  )
}