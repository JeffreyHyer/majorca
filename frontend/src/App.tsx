import React, { useState } from 'react'
import type { KeyboardEvent, MouseEvent } from 'react'

const App = () => {
  const [activeLineNumber, setActiveLineNumber] = useState<number>(1)

  const [first, setFirst] = useState<string>(`Line one has some text on it
line two is a continuation of that line.

Line four is somewhere in the middle of a rather long
paragraph of text. Hopefully that all makes sense
and fits on the screen.`)
  const [second, setSecond] = useState<string>(`Line one has some text on it
line two is a continuation of that line.

Line four is somewhere in the middle of a rather long
paragraph of text. Hopefully that all makes sense
and fits on the screen.

This is line eight. Maybe it's getting too long? Not
quite. Perfect. We should have plenty of room for a
journal entry then. Line length may be a problem
but I think we can make it work by adjusting the font
size.`)
  const [third, setThird] = useState<string>('')

  const moveLineMarker = (event: KeyboardEvent<HTMLTextAreaElement> | MouseEvent<HTMLTextAreaElement>) => {
    const target = event.target as HTMLTextAreaElement
    setActiveLineNumber(target.selectionEnd === 0 ? 1 : target.value.substring(0, target.selectionEnd).split('\n').length)
  }

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
