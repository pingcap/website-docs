import { Provider } from 'react-redux'
import React from 'react'
import { createStore } from 'redux'
import rootReducer from '.'

export default ({ element }) => (
  <Provider store={createStore(rootReducer)}>{element}</Provider>
)
