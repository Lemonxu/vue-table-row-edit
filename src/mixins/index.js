import Searcher from './Searcher'
import Pagination from './Pagination'

export { default as Title } from './Title'
export { default as View } from './View'

export default function install (Vue, opt) {
  Vue.mixin(Searcher)
  Vue.mixin(Pagination)
}
