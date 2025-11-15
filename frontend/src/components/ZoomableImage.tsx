import { useRef, useState } from "react"

const RAW_IMAGE_WIDTH = 2040;
const RAW_IMAGE_HEIGHT = 1536;

const ZoomableImage = ({ journalId, pageId, activeLineNumber }: ZoomableImageProps) => {
  const [offsetX, setOffsetX] = useState<number>(0)
  const [offsetY, setOffsetY] = useState<number>(0)
  const [zoomHeight, setZoomHeight] = useState<number>(700)
  const imgRef = useRef<HTMLImageElement>(null)

  const onMouseWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    console.log(event.deltaX, event.deltaY)

    // Move the image
    if (!event.getModifierState('Meta')) {
      let deltaModifier = Math.abs(event.deltaX) > 10 ? 10 : Math.abs(event.deltaY) > 10 ? 10 : 1
      let newOffsetX = offsetX - (event.deltaX / deltaModifier)
      let newOffsetY = offsetY - (event.deltaY / deltaModifier)

      // TODO: Fix this logic, it doesn't work when zoomed in or out
      if (imgRef.current) {
        if ((newOffsetX <= imgRef.current.parentElement!.clientWidth) && (newOffsetX >= -imgRef.current.parentElement!.clientWidth)) {
          setOffsetX(newOffsetX)
        }
        if ((newOffsetY <= imgRef.current.parentElement!.clientHeight) && (newOffsetY >= -imgRef.current.parentElement!.clientHeight)) {
          setOffsetY(newOffsetY)
        }
      }
    }
    // Zoom the image
    else {
      // TODO: Zoom towards cursor position
      const newZoomHeight = zoomHeight - event.deltaY - event.deltaX
      if (newZoomHeight >= 200 && newZoomHeight <= RAW_IMAGE_HEIGHT) {
        setZoomHeight(newZoomHeight)
      }
    }
  }

  const onDragImage = (event: React.DragEvent<HTMLImageElement>) => {

  }

  // TODO: Pinch to zoom on Mac touchpad
  return (
    <div className="zoom-wrapper" onWheel={onMouseWheel}>
      <img ref={imgRef} src={`../camera/${journalId}/1_orig.jpg`} onDrag={onDragImage} style={{ transform: `translate(${offsetX}px, ${offsetY}px)`, height: `${zoomHeight}px` }} />
    </div>
  )
}

export default ZoomableImage

interface ZoomableImageProps {
  journalId: string
  pageId: string
  activeLineNumber: number
}