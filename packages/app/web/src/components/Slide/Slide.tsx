import React from 'react'
import { usePlateSelectors } from '@udecode/plate'
import type { Slide } from '@wix-slides/common/types'
import { getSlideChildsWithMeasurement } from '@wix-slides/common/utils/measure'
import { templateEngine } from '@wix-slides/common/utils/template-engine'
import { templates } from '@wix-slides/templates'
import useDecksterStore from '../../stores'
import styles from './Slide.module.scss'

interface SlideProps {
  id: string
  index: number
  slide: Slide
}

const WixSlide = React.memo(({ slide, id, index }: SlideProps) => {
  const ref = React.createRef<HTMLDivElement>()
  const editor = usePlateSelectors().editor()
  const setDecksterStore = useDecksterStore((s) => s.set)
  const cursorOnSlide = useDecksterStore((s) => s.cursorOnSlide)
  const { tokens } = slide

  React.useEffect(() => {
    if (ref && ref.current && cursorOnSlide === index) {
      ref.current.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  }, [cursorOnSlide])

  React.useEffect(() => {
    setDecksterStore((s) => {
      const ctxSlideIndex = s.slides.findIndex((s) => s.id === id)
      s.slides[ctxSlideIndex] = {
        ...s.slides[ctxSlideIndex],
        template: templateEngine(tokens),
        elements: getSlideChildsWithMeasurement(
          ref.current,
          s.slides[ctxSlideIndex].width
        ),
      }
    })
  }, [tokens])

  React.useLayoutEffect(() => {
    if (ref && ref.current) {
      setDecksterStore((s) => {
        const ctxSlideIndex = s.slides.findIndex((s) => s.id === id)
        s.slides[ctxSlideIndex] = {
          ...s.slides[ctxSlideIndex],
          width: ref.current?.offsetWidth || 0,
          backgroundImage: slideBackgroundImage,
        }
      })
    }
  }, [])

  const ctxTemplate = React.useCallback(() => templateEngine(tokens), [tokens])
  const Template = templates[ctxTemplate()].render()
  const slideBackgroundImage = templates[ctxTemplate()].backgroundImage

  return (
    <div
      className={styles.root}
      data-deckster-template={templateEngine(tokens)}
      data-deckster-slide="true"
      id={`slide${index}`}
      ref={ref}
    >
      <div className={styles.content}>
        {editor && (
          <Template
            slideBackgroundImage={slideBackgroundImage}
            editor={editor}
            tokens={tokens}
          />
        )}
      </div>
    </div>
  )
})

export { WixSlide }
