/** Multi-step tutorial walkthrough — explains plants, weather, diversification, and flowers */

import { TUTORIAL_STEPS } from '../../constants/config'
import gsap from 'gsap'

export class TutorialScreen {
  private container: HTMLElement
  private currentStep: number = 0
  private onComplete: () => void
  private onSkip: () => void
  private touchStartX = 0

  constructor(container: HTMLElement, onComplete: () => void, onSkip: () => void) {
    this.container = container
    this.onComplete = onComplete
    this.onSkip = onSkip
  }

  render(step?: number): void {
    if (step !== undefined) this.currentStep = step
    const totalSteps = TUTORIAL_STEPS.length
    const current = TUTORIAL_STEPS[this.currentStep]

    if (!current) {
      this.onComplete()
      return
    }

    const dots = TUTORIAL_STEPS.map((_, i) => {
      if (i < this.currentStep) return '<div class="tutorial-dot tutorial-dot-done"></div>'
      if (i === this.currentStep) return '<div class="tutorial-dot tutorial-dot-active"></div>'
      return '<div class="tutorial-dot"></div>'
    }).join('')

    this.container.innerHTML = `
      <div class="screen" id="tutorial-screen">
        <div class="tutorial-step" id="tutorial-content">
          <div class="tutorial-progress mb-lg">
            ${dots}
          </div>

          <div class="tutorial-emoji" style="font-size: 72px; margin-bottom: var(--space-lg);">${current.emoji}</div>

          <h2 class="text-h1 text-display mb-md" style="color: var(--pf-petrol);">${current.title}</h2>

          <p class="text-body mb-xl" style="color: var(--text-secondary); line-height: 1.7;">
            ${current.content}
          </p>

          <div style="display: flex; gap: var(--space-md); justify-content: center;">
            ${this.currentStep < totalSteps - 1 ? `
              <button class="btn btn-primary" id="btn-next">Next →</button>
              <button class="btn btn-secondary btn-small" id="btn-skip">Skip Tutorial</button>
            ` : `
              <button class="btn btn-primary btn-large" id="btn-finish">Start Playing! 🌱</button>
            `}
          </div>

          <p class="text-small text-muted mt-lg">Step ${this.currentStep + 1} of ${totalSteps}</p>
          ${this.currentStep < totalSteps - 1 ? '<p class="text-small text-muted" style="margin-top: 4px; opacity: 0.5;">Swipe left to continue →</p>' : ''}
        </div>
      </div>
    `

    // Animate entrance
    const content = document.getElementById('tutorial-content')
    if (content) {
      gsap.fromTo(content,
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' },
      )
    }

    // Emoji bounce animation
    const emoji = this.container.querySelector('.tutorial-emoji') as HTMLElement
    if (emoji) {
      gsap.fromTo(emoji,
        { scale: 0, rotation: -15 },
        { scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(3)', delay: 0.15 },
      )
    }

    // Button handlers
    document.getElementById('btn-next')?.addEventListener('click', () => this.goNext())
    document.getElementById('btn-skip')?.addEventListener('click', this.onSkip)
    document.getElementById('btn-finish')?.addEventListener('click', this.onComplete)

    // Swipe support
    const screen = document.getElementById('tutorial-screen')
    if (screen) {
      screen.addEventListener('touchstart', (e) => {
        this.touchStartX = e.touches[0].clientX
      }, { passive: true })

      screen.addEventListener('touchend', (e) => {
        const deltaX = e.changedTouches[0].clientX - this.touchStartX
        if (deltaX < -50 && this.currentStep < totalSteps - 1) {
          this.goNext()
        } else if (deltaX > 50 && this.currentStep > 0) {
          this.goPrev()
        }
      }, { passive: true })
    }
  }

  private goNext(): void {
    const content = document.getElementById('tutorial-content')
    if (content) {
      gsap.to(content, {
        opacity: 0, x: -40, duration: 0.2, ease: 'power2.in',
        onComplete: () => {
          this.currentStep++
          this.render()
        },
      })
    } else {
      this.currentStep++
      this.render()
    }
  }

  private goPrev(): void {
    const content = document.getElementById('tutorial-content')
    if (content) {
      gsap.to(content, {
        opacity: 0, x: 40, duration: 0.2, ease: 'power2.in',
        onComplete: () => {
          this.currentStep--
          this.render()
        },
      })
    } else {
      this.currentStep--
      this.render()
    }
  }

  destroy(): void {
    this.container.innerHTML = ''
  }
}
