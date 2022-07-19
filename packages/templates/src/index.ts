import { SlideTemplate, Temaplte } from '@wix-slides/common/types'
import Cover from './Cover'
import TitleWithP from './TitleWithP'
import TitleWithParagraphWithImage from './TitleWithPWithImg'

export const templates: Record<
  Temaplte,
  {
    backgroundImage: string
    render: () => ({
      tokens,
      slideBackgroundImage,
    }: SlideTemplate) => JSX.Element | null
  }
> = {
  cover: {
    backgroundImage:
      'https://static.wixstatic.com/media/0446d4_f57f64bce0864a53b4b129619a6efc68~mv2.png/v1/fill/w_1920,h_1080,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/0446d4_f57f64bce0864a53b4b129619a6efc68~mv2.png',
    render: () => Cover,
  },
  titleWithP: {
    backgroundImage: '',
    render: () => TitleWithP,
  },
  titleWithPWithImage: {
    backgroundImage: '',
    render: () => TitleWithParagraphWithImage,
  },
}
