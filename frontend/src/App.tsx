import { useEffect, useState } from 'react'
import type { KeyboardEvent, MouseEvent } from 'react'
import { getJournalPage } from './utils/api.ts'

const App = () => {
  const [activeLineNumber, setActiveLineNumber] = useState<number>(1)
  const [journalId, setJournalId] = useState<string>('october_1990')
  const [pageId, setPageId] = useState<string>('1_1')
  const [first, setFirst] = useState<string>('')
  const [second, setSecond] = useState<string>('')
  const [third, setThird] = useState<string>('')

  const moveLineMarker = (event: KeyboardEvent<HTMLTextAreaElement> | MouseEvent<HTMLTextAreaElement>) => {
    const target = event.target as HTMLTextAreaElement
    setActiveLineNumber(target.selectionEnd === 0 ? 1 : target.value.substring(0, target.selectionEnd).split('\n').length)
  }

  useEffect(() => {
    getJournalPage(journalId, pageId).then(data => {
      setFirst(data.ocr_results?.[0]?.text ?? '')
      setSecond(data.ocr_results?.[1]?.text ?? '')
      setThird(data.text ?? '')
    })
  }, [])

  return (
    <div className="container">
      <textarea disabled readOnly value={first} />

      <textarea disabled readOnly value={second} />

      <textarea onKeyUp={moveLineMarker} onMouseUp={moveLineMarker} value={third} onChange={(e) => setThird(e.target.value)} />

      <div className="line-marker" style={{ top: `calc(32px + (${activeLineNumber} * 1.2em))` }} />
    </div>
  )
}

export default App
