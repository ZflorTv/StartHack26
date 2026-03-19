import { TUTORIAL_STEPS } from '../../constants/config'

export class TutorialScreen {
  private container: HTMLElement
  private currentStep: number = 0
  private onComplete: () => void
  private onSkip: () => void

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
      <div class="screen" style="background: rgba(240,237,230,0.95);">
        <div class="tutorial-step">
          <div class="tutorial-progress mb-lg">
            ${dots}
          </div>

          <div style="font-size: 64px; margin-bottom: var(--space-lg);">${current.emoji}</div>

          <h2 class="text-h1 mb-md" style="color: var(--pf-petrol);">${current.title}</h2>

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
        </div>
      </div>
    `

    document.getElementById('btn-next')?.addEventListener('click', () => {
      this.currentStep++
      this.render()
    })

    document.getElementById('btn-skip')?.addEventListener('click', this.onSkip)
    document.getElementById('btn-finish')?.addEventListener('click', this.onComplete)
  }

  destroy(): void {
    this.container.innerHTML = ''
  }
}
