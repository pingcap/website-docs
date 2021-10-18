import { Provider } from 'react-redux'
import React from 'react'
import { createStore } from 'redux'
import reducer from '.'

const store = createStore(reducer)

const wrapWithProvider = ({ element }) => (
  <Provider store={store}>{element}</Provider>
)

export default wrapWithProvider
