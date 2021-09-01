import { Provider } from 'react-redux'
import React from 'react'
import { createStore } from 'redux'
import reducer from '.'

const wrapWithProvider = ({ element }) => {
  const store = createStore(reducer)

  return <Provider store={store}>{element}</Provider>
}

export default wrapWithProvider
