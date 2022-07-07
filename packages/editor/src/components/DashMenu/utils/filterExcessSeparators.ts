import { MenuItem } from '@wix-slides/common/types'
type Item = MenuItem

export default function filterExcessSeparators(items: Item[]): Item[] {
  return items
    .reduce((acc, item) => {
      // trim separator if the previous item was a separator
      if (
        item.key === 'separator' &&
        acc[acc.length - 1]?.key === 'separator'
      ) {
        return acc
      }
      return [...acc, item]
    }, [] as Item[])
    .filter((item, index, arr) => {
      if (
        item.key === 'separator' &&
        (index === 0 || index === arr.length - 1)
      ) {
        return false
      }
      return true
    })
}
