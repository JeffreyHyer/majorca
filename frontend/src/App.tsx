import { useEffect, useState } from 'react'
import type { KeyboardEvent, MouseEvent } from 'react'
import { getJournalPage, patchJournalPage, getPreviousPage, getNextPage } from './utils/api.ts'
import ZoomableImage from './components/ZoomableImage.tsx'

const filteredWords = ['-']

const App = () => {
  const [activeLineNumber, setActiveLineNumber] = useState<number>(1)
  const [journalId, setJournalId] = useState<string>('october_1990')
  const [pageId, setPageId] = useState<string>('2')
  const [text, setText] = useState<string>('')
  const [first, setFirst] = useState<string>('')
  const [second, setSecond] = useState<string>('')
  const [third, setThird] = useState<string>('')
  const [words, setWords] = useState<string[][]>([[], [], []])
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
        text
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

  const onPrevPage = () => {
    setIsLoading(true)

    getPreviousPage(journalId, pageId)
      .then(data => {
        setPageId(data.id)
        setFirst(data.ocr_results?.[0]?.text ?? '')
        setSecond(data.ocr_results?.[1]?.text ?? '')
        setThird(data.ocr_results?.[2]?.text ?? '')
        setText(data.text ?? '')
        setActiveLineNumber(1)
      })
      .catch(err => {
        // TODO: Show error message
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const onNextPage = () => {
    setIsLoading(true)

    getNextPage(journalId, pageId)
      .then(data => {
        setPageId(data.id)
        setFirst(data.ocr_results?.[0]?.text ?? '')
        setSecond(data.ocr_results?.[1]?.text ?? '')
        setThird(data.ocr_results?.[2]?.text ?? '')
        setText(data.text ?? '')
        setActiveLineNumber(1)
      })
      .catch(err => {
        // TODO: Show error message
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const sameWordsAndPlaceholders = () => {
    let result = ''

    for (let word = 0; word < Math.min(words[0]?.length ?? 0, words[1]?.length ?? 0, words[2]?.length ?? 0); word++) {
      const base = words[0]![word]
      const one = words[1]![word]
      const two = words[2]![word]

      if (
        (base === one) &&
        (base === two)
       ) {
        result += base + ' '
        continue
      }

      if (
        (base === one) ||
        (base === two)
       ) {
        result += base + ' '
        continue
      }

      if (one === two) {
        result += one + ' '
        continue
      }

      if (word > 0) {
        const prevOne = words[1]![word - 1]
        const nextOne = words[1]?.[word + 1] ?? ''
        const prevTwo = words[2]![word - 1]
        const nextTwo = words[2]?.[word + 1] ?? ''

        if (base === prevOne || base === prevTwo) {
          result += base + ' '
          continue
        }

        if (base === nextOne || base === nextTwo) {
          result += base + ' '
          continue
        }
      }

        // result += `[${words[0][word] ?? ''} | ${words[1][word] ?? ''} | ${words[2][word] ?? ''}] `
      result += '___ '
    }

    return result.trim()
  }

  useEffect(() => {
    getJournalPage(journalId, pageId).then(data => {
      setFirst(data.ocr_results?.[0]?.text ?? '')
      setSecond(data.ocr_results?.[1]?.text ?? '')
      setThird(data.ocr_results?.[2]?.text ?? '')
      setText(data.text ?? '')
    })
  }, [])

  useEffect(() => {
    if (first || second || third) {
      let newWords = []
      newWords[0] = first.replace(/\n/g, ' ').split(' ').filter(w => w.length > 0).filter(w => !filteredWords.includes(w))
      newWords[1] = second.replace(/\n/g, ' ').split(' ').filter(w => w.length > 0).filter(w => !filteredWords.includes(w))
      newWords[2] = third.replace(/\n/g, ' ').split(' ').filter(w => w.length > 0).filter(w => !filteredWords.includes(w))

      setWords(newWords)
    }
  }, [first, second, third])

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
        {/* <textarea disabled readOnly value={first} /> */}
        <textarea disabled readOnly value={sameWordsAndPlaceholders()} />

        <textarea onKeyUp={moveLineMarker} onMouseUp={moveLineMarker} value={text} onChange={(e) => setText(e.target.value)} />

        <ZoomableImage journalId={journalId} pageId={pageId} activeLineNumber={activeLineNumber} />

        <div className="line-marker" style={{ top: `calc(32px + (${activeLineNumber} * 1.2em))` }} />
      </div>
    </div>  
  )
}

export default App
