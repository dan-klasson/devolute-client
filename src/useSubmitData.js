import { useState, useCallback } from 'react'

export default function useSubmitData({endpoint}) {
  const [res, setRes] = useState({data: null, error: null, loading: false});
  const submitData = useCallback((payload) => {
    setRes(prevState => ({...prevState, loading: true}))
    fetch(`${process.env.REACT_APP_URL}/${endpoint}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      })
      .then(r => r.json())
      .then((response) => {
        if(response.success) {
          setRes({data: response.result, loading: false, error: null})
        } else {
          setRes({loading: false, data: null, error: response.errors})
        }
      })
      .catch(err => setRes({loading: false, data: null, error: err}))
  }, [endpoint])
  return [res, submitData]
}