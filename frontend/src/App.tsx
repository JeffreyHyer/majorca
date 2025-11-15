import { useEffect, useState } from 'react'
import type { KeyboardEvent, MouseEvent } from 'react'
import { getJournalPage, patchJournalPage } from './utils/api.ts'
import ZoomableImage from './components/ZoomableImage.tsx'

const App = () => {
  const [activeLineNumber, setActiveLineNumber] = useState<number>(1)
  const [journalId, setJournalId] = useState<string>('october_1990')
  const [pageId, setPageId] = useState<string>('1_1')
  const [first, setFirst] = useState<string>('')
  const [second, setSecond] = useState<string>('')
  const [third, setThird] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const moveLineMarker = (event: KeyboardEvent<HTMLTextAreaElement> | MouseEvent<HTMLTextAreaElement>) => {
    const target = event.target as HTMLTextAreaElement

    setActiveLineNumber(
      target.selectionEnd === 0
        ? 1
        : target.value
            .substring(0, target.selectionEnd)
            .split('\n')
            .length
    )
  }

  const onSave = () => {
    setIsLoading(true)

    if (journalId && pageId) {
      patchJournalPage(journalId, pageId, {
        text: third
      })
      .then(resp => {
        if (resp.status === 'success') {
          // TODO: Show success message
        } else {
          // TODO: Show error message
        }
      })
      .catch(err => {
        // TODO: Show error message
      })
      .finally(() => {
        setIsLoading(false)
      })
    }
  }

  const onPrevPage = () => {}

  const onNextPage = () => {}

  useEffect(() => {
    getJournalPage(journalId, pageId).then(data => {
      setFirst(data.ocr_results?.[0]?.text ?? '')
      setSecond(data.ocr_results?.[1]?.text ?? '')
      setThird(data.text ?? '')
    })
  }, [])

  return (
    <div className="app">
      <div className="action-bar">
        <div className="left">
          <button type="button" onClick={onPrevPage} disabled={isLoading}>Previous Page</button>
        </div>

        <div className="right">
          <button type="button" onClick={onSave} disabled={isLoading}>{isLoading ? 'Saving...' : 'Save'}</button>
          <button type="button" onClick={onNextPage} disabled={isLoading}>Next Page</button>
        </div>
      </div>

      <div className="container">
        <textarea disabled readOnly value={first} />

        {/* <textarea disabled readOnly value={second} /> */}

        <textarea onKeyUp={moveLineMarker} onMouseUp={moveLineMarker} value={third} onChange={(e) => setThird(e.target.value)} />

        <ZoomableImage journalId={journalId} pageId={pageId} activeLineNumber={activeLineNumber} />

        <div className="line-marker" style={{ top: `calc(32px + (${activeLineNumber} * 1.2em))` }} />
      </div>
    </div>  
  )
}

export default App
