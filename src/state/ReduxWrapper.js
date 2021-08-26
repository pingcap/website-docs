import { Provider } from 'react-redux'
import React from 'react'
import { createStore } from 'redux'
import rootReducer from '.'

const provider = ({ element }) => (
  <Provider store={createStore(rootReducer)}>{element}</Provider>
)

export default provider
