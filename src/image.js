import React from 'react'
import { Redirect } from 'react-router-dom'
import { Container, Row, Col, Alert } from 'react-bootstrap'
import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'
import { useCookies } from 'react-cookie'
import useFetchData from './useFetchData'
import Spinner from './spinner'

export default function Image() {
  const [cookies, ] = useCookies(['authtoken']);
  const {result, loading, error, forceUpdate} = useFetchData({endpoint: 'images'})

  const getUploadParams = ({ file }) => {
    const url = `${process.env.REACT_APP_URL}/images`
    const headers = {'Authorization': `Bearer ${cookies.authtoken}`}
    const body = new FormData()
    body.append('image', file)
    body.append('title', file.name)
    return { url, body, headers }
  }

  const handleSubmit = (allFiles) => {
    forceUpdate()
    allFiles.forEach(f => f.remove())
  }

  if (loading) return <Spinner />
  if(!cookies.authtoken) return <Redirect to="/login" />
  if (error && error.token) return <Alert variant="danger">{error.token}</Alert>

  const ImageCol = (props) => {
    return (
      <Col xs={4} sm={2} className="image-column" data-testid="image-column">
        <a
          href={props.object.standard}
          className="d-block mb-4 h-100"
          target="_blank"
          rel="noopener noreferrer"
          data-testid="image-link"
        >
          <img 
            className="img-fluid img-thumbnail"
            src={props.object.thumbnail}
            alt={props.object.title}
            data-testid="image"
          />
        </a>
      </Col>
    )
  }

  return (
    <>
      <Dropzone
        getUploadParams={getUploadParams}
        onSubmit={handleSubmit}
        accept="image/*"
      />
      <Container className="image-container">
        <Row>
          {result.map((obj, i) => <ImageCol key={i} object={obj} />)}
        </Row>
      </Container>
    </>
  )
}
