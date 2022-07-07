import React from 'react'
import { Plate } from '@udecode/plate'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import styles from './Editor.module.scss'
import DashMenu from './components/DashMenu/DashMenu'
import { PLUGINS } from './config/plugins'

const DecksterEditor = () => {
  const editableProps = {
    placeholder: "Type '/' to insert, or start writing…",
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div id="deckster-editor" className={styles.root}>
        <Plate
          plugins={[
            ...PLUGINS.basicElements,
            ...PLUGINS.basicMarks,
            ...PLUGINS.logic,
          ]}
          editableProps={editableProps}
        >
          <DashMenu />
        </Plate>
      </div>
    </DndProvider>
  )
}

export { DecksterEditor }
