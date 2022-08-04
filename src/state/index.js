const SET_LOADING = 'SET_LOADING'
const SET_DOC_INFO = 'GET_DOC_INFO'
const SET_SEARCH_VALUE = 'SET_SEARCH_VALUE'
const SET_LANG_SWITCHABLE = 'SET_LANG_SWITCHABLE'
const SET_DOC_DATA = 'SET_DOC_DATA'
const SET_TAB_GROUP = 'SET_TAB_GROUP'

export const setLoading = bool => ({
  type: SET_LOADING,
  loading: bool,
})

export const setSearchValue = value => ({
  type: SET_SEARCH_VALUE,
  value,
})

export const setDocInfo = info => ({
  type: SET_DOC_INFO,
  info,
})

export const setLangSwitchable = langSwitchable => ({
  type: SET_LANG_SWITCHABLE,
  langSwitchable,
})

export const setDocData = docData => ({
  type: SET_DOC_DATA,
  docData,
})

export const setTabGroup = tabGroup => ({
  type: SET_TAB_GROUP,
  tabGroup,
})

export const defaultDocInfo = {
  lang: 'en',
  type: 'tidb',
  version: 'stable',
}

const initialState = {
  loading: false,
  searchValue: '',
  docInfo: defaultDocInfo,
  langSwitchable: true,
  docData: {},
  tabGroup: {},
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOADING:
      return { ...state, loading: action.loading }
    case SET_SEARCH_VALUE:
      return { ...state, searchValue: action.value }
    case SET_DOC_INFO:
      return { ...state, docInfo: action.info }
    case SET_LANG_SWITCHABLE:
      return { ...state, langSwitchable: action.langSwitchable }
    case SET_DOC_DATA:
      return { ...state, docData: action.docData }
    case SET_TAB_GROUP:
      return { ...state, tabGroup: action.tabGroup }
    default:
      return state
  }
}

export default reducer
