export const defaultDocInfo = {
  lang: 'en',
  type: 'tidb',
  version: 'stable',
}

const SET_LOADING = 'SET_LOADING'
const GET_DOC_INFO = 'GET_DOC_INFO'
const SET_SEARCH_VALUE = 'SET_SEARCH_VALUE'

export const setLoading = (bool) => ({
  type: SET_LOADING,
  loading: bool,
})

export const getDocInfo = (info) => ({
  type: GET_DOC_INFO,
  info,
})

export const setSearchValue = (value) => ({
  type: SET_SEARCH_VALUE,
  value,
})

const initialState = {
  loading: false,
  docInfo: defaultDocInfo,
  searchValue: '',
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_LOADING:
      return { ...state, loading: action.loading }
    case GET_DOC_INFO:
      return { ...state, docInfo: action.info }
    case SET_SEARCH_VALUE:
      return { ...state, searchValue: action.value }
    default:
      return state
  }
}
