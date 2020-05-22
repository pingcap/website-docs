const defaultDocInfo = {
  lang: 'en',
  type: 'tidb',
  version: 'v4.0',
}

const GET_DOC_INFO = 'GET_DOC_INFO'
const RESET_DOC_INFO = 'RESET_DOC_INFO'

export const getDocInfo = (info) => ({
  type: GET_DOC_INFO,
  info,
})

export const resetDocInfo = () => ({
  type: RESET_DOC_INFO,
  info: defaultDocInfo,
})

const initialState = {
  docInfo: defaultDocInfo,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_DOC_INFO:
    case RESET_DOC_INFO:
      return { ...state, docInfo: action.info }
    default:
      return state
  }
}
