import { useState, useEffect, useCallback } from 'react'
import { useCookies } from 'react-cookie'

export default function useSubmitData({endpoint}) {
  const [state, updateState] = useState()
  const forceUpdate = useCallback(() => updateState({}), []);
  const [res, setRes] = useState({data: [], error: null, loading: false});
  const [cookies, ] = useCookies(['authtoken']);

  useEffect(() => {
    if(cookies.authtoken) {
      setRes(prevState => ({...prevState, loading: true}))
      fetch(`${process.env.REACT_APP_URL}/${endpoint}`, {
          headers: {'Authorization': `Bearer ${cookies.authtoken}`}
        })
        .then(r => r.json())
        .then(response => setRes({data: response, loading: false, error: null}))
        .catch(err => setRes({loading: false, data: [], error: err}))
    }
  }, [cookies, endpoint, state])

  return { result: res.data, loading: res.loading, error: res.error, forceUpdate }
}
