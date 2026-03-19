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
          <h1 class="text-hero mb-md" style="color: var(--pf-petrol); display: inline-flex; align-items: center; gap: 10px;">
            <span>Growden</span>
            <img src="/icons/plant.png" alt="Hands with plants" style="height: 46px; width: 46px; object-fit: contain;" />
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
              <div style="height: 40px; display: flex; align-items: center; justify-content: center; margin-bottom: 6px;">
                <img src="/icons/plant.png" alt="Hands with plants" style="height: 36px; width: 36px; object-fit: contain;" />
              </div>
              <div class="text-small text-muted">Hands with plants</div>
            </div>
            <div class="text-center">
              <div style="height: 40px; display: flex; align-items: center; justify-content: center; margin-bottom: 6px;">
                <img src="/icons/weather.png" alt="Calendar weather" style="height: 36px; width: 36px; object-fit: contain;" />
              </div>
              <div class="text-small text-muted">Calendar weather</div>
            </div>
            <div class="text-center">
              <div style="height: 40px; display: flex; align-items: center; justify-content: center; margin-bottom: 6px;">
                <img src="/icons/profit.png" alt="Growth chart" style="height: 36px; width: 36px; object-fit: contain;" />
              </div>
              <div class="text-small text-muted">Growth chart</div>
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
