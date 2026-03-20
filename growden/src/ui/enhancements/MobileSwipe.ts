/**
 * MobileSwipe — Touch gesture support for navigating between screens,
 * swipeable plant chips, and drag-to-dismiss bottom sheets.
 */

/** Simple swipe detector — no external dependency needed */
export class SwipeDetector {
  private startX = 0
  private startY = 0
  private element: HTMLElement
  private threshold = 50
  private onSwipeLeft?: () => void
  private onSwipeRight?: () => void
  private onSwipeDown?: () => void

  constructor(
    element: HTMLElement,
    callbacks: {
      onSwipeLeft?: () => void
      onSwipeRight?: () => void
      onSwipeDown?: () => void
    },
    threshold = 50,
  ) {
    this.element = element
    this.threshold = threshold
    this.onSwipeLeft = callbacks.onSwipeLeft
    this.onSwipeRight = callbacks.onSwipeRight
    this.onSwipeDown = callbacks.onSwipeDown

    this.element.addEventListener('touchstart', this.handleStart, { passive: true })
    this.element.addEventListener('touchend', this.handleEnd, { passive: true })
  }

  private handleStart = (e: TouchEvent) => {
    this.startX = e.touches[0].clientX
    this.startY = e.touches[0].clientY
  }

  private handleEnd = (e: TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - this.startX
    const deltaY = e.changedTouches[0].clientY - this.startY

    // Require horizontal swipe to be more prominent than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > this.threshold) {
      if (deltaX < 0 && this.onSwipeLeft) {
        this.onSwipeLeft()
      } else if (deltaX > 0 && this.onSwipeRight) {
        this.onSwipeRight()
      }
    } else if (deltaY > this.threshold && this.onSwipeDown) {
      this.onSwipeDown()
    }
  }

  destroy(): void {
    this.element.removeEventListener('touchstart', this.handleStart)
    this.element.removeEventListener('touchend', this.handleEnd)
  }
}

/** Make a bottom sheet drag-to-dismiss */
export function makeDragToDismiss(
  sheet: HTMLElement,
  onDismiss: () => void,
): void {
  let startY = 0
  let currentY = 0
  let isDragging = false

  const handle = sheet.querySelector('.drawer-handle') || sheet

  handle.addEventListener('touchstart', (e) => {
    const touch = (e as TouchEvent).touches[0]
    startY = touch.clientY
    isDragging = true
    sheet.style.transition = 'none'
  }, { passive: true })

  handle.addEventListener('touchmove', (e) => {
    if (!isDragging) return
    const touch = (e as TouchEvent).touches[0]
    currentY = touch.clientY - startY
    if (currentY > 0) {
      sheet.style.transform = `translateY(${currentY}px)`
    }
  }, { passive: true })

  handle.addEventListener('touchend', () => {
    if (!isDragging) return
    isDragging = false
    sheet.style.transition = 'transform 0.3s ease'

    if (currentY > 100) {
      // Dismiss
      sheet.style.transform = 'translateY(100%)'
      setTimeout(onDismiss, 300)
    } else {
      // Snap back
      sheet.style.transform = 'translateY(0)'
    }
    currentY = 0
  }, { passive: true })
}

/** Show swipe hint on mobile */
export function showSwipeHint(direction: 'left' | 'right' = 'left'): void {
  if (window.innerWidth > 768) return // Desktop — no hint needed

  const existing = document.querySelector('.swipe-hint')
  if (existing) existing.remove()

  const hint = document.createElement('div')
  hint.className = 'swipe-hint'
  hint.innerHTML = `
    <span class="swipe-hint-arrow">${direction === 'left' ? '←' : '→'}</span>
    Swipe to navigate
  `
  document.getElementById('ui-layer')?.appendChild(hint)

  // Auto-remove after 3 seconds
  setTimeout(() => hint.remove(), 5000)
}
