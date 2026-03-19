export class LandingScreen {
  private container: HTMLElement
  private onStart: () => void
  private onBattle: () => void

  constructor(container: HTMLElement, onStart: () => void, onBattle: () => void) {
    this.container = container
    this.onStart = onStart
    this.onBattle = onBattle
  }

  render(): void {
    this.container.innerHTML = `
      <div class="screen" style="background: linear-gradient(180deg, rgba(232,244,248,0.9) 0%, rgba(240,237,230,0.95) 100%);">
        <div style="text-align: center; max-width: 500px;">
          <p class="text-caption text-muted mb-md">PostFinance · Wealth Manager Arena</p>
          <h1 class="text-hero mb-md" style="color: var(--pf-petrol);">
            Growden <span style="font-size: 48px;">🌱</span>
          </h1>
          <p class="text-body text-muted mb-lg" style="max-width: 380px; margin: 0 auto var(--space-xl);">
            Grow your knowledge. Grow your wealth.<br>
            Learn investing by building a garden.
          </p>

          <div style="display: flex; flex-direction: column; gap: var(--space-md); align-items: center;">
            <button class="btn btn-primary btn-large" id="btn-start">
              Start Growing →
            </button>
            <button class="btn btn-secondary" id="btn-battle">
              ⚡ Battle Mode
            </button>
          </div>

          <div style="margin-top: var(--space-2xl); display: flex; gap: var(--space-xl); justify-content: center;">
            <div class="text-center">
              <div style="font-size: 24px;">🌳</div>
              <div class="text-small text-muted">Plant assets</div>
            </div>
            <div class="text-center">
              <div style="font-size: 24px;">⛈️</div>
              <div class="text-small text-muted">Weather events</div>
            </div>
            <div class="text-center">
              <div style="font-size: 24px;">📈</div>
              <div class="text-small text-muted">Learn investing</div>
            </div>
          </div>
        </div>
      </div>
    `

    document.getElementById('btn-start')?.addEventListener('click', this.onStart)
    document.getElementById('btn-battle')?.addEventListener('click', this.onBattle)
  }

  destroy(): void {
    this.container.innerHTML = ''
  }
}
