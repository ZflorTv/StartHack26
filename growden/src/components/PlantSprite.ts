import { Container, Graphics, Text, TextStyle, Sprite, Texture } from 'pixi.js'
import type { PlantState } from '../types'

export class PlantSprite extends Container {
  public plantId: string
  public assetCategory: string
  private body: Graphics
  private plantImage: Sprite | null = null
  private emojiText: Text
  private labelText: Text
  private currentState: PlantState = 'healthy'
  private plantColor: number
  private baseScale: number = 1

  constructor(
    plantId: string,
    emoji: string,
    color: string,
    category: string,
    icon: string,
    position: { x: number; y: number; scale: number },
  ) {
    super()
    this.plantId = plantId
    this.assetCategory = category
    this.plantColor = parseInt(color.replace('#', ''), 16)

    // Create plant body (hidden if PNG loads, fallback if it doesn't)
    this.body = new Graphics()
    this.drawPlantBody()
    this.addChild(this.body)

    // Emoji on top (hidden if PNG loads)
    this.emojiText = new Text({
      text: emoji,
      style: new TextStyle({
        fontSize: 28,
        align: 'center',
      }),
    })
    this.emojiText.anchor.set(0.5, 0.5)
    this.emojiText.y = -10
    this.addChild(this.emojiText)

    // Load actual plant PNG image
    if (icon) {
      try {
        this.plantImage = Sprite.from(icon)
        this.plantImage.anchor.set(0.5, 0.5)
        this.plantImage.width = 48
        this.plantImage.height = 48
        this.plantImage.y = -10
        this.addChild(this.plantImage)

        // Hide the emoji and geometric shape since we have the real image
        this.emojiText.visible = false
        this.body.visible = false
      } catch (e) {
        // If PNG fails to load, keep emoji + shape as fallback
        console.warn(`Failed to load plant image: ${icon}, using emoji fallback`)
      }
    }

    // Label below
    this.labelText = new Text({
      text: '',
      style: new TextStyle({
        fontSize: 10,
        fill: 0x666666,
        align: 'center',
        fontFamily: 'Inter, sans-serif',
      }),
    })
    this.labelText.anchor.set(0.5, 0)
    this.labelText.y = 22
    this.labelText.visible = false
    this.addChild(this.labelText)

    // Position
    this.x = position.x
    this.y = position.y
    this.baseScale = position.scale
    this.scale.set(position.scale)

    // Make interactive
    this.eventMode = 'static'
    this.cursor = 'pointer'
  }

  private drawPlantBody(): void {
    this.body.clear()

    // Draw a stylized plant shape based on category
    switch (this.assetCategory) {
      case 'equity':
        // Tree shape: trunk + round canopy
        this.body.rect(-3, 0, 6, 18)
        this.body.fill({ color: 0x8B6914 })
        this.body.circle(0, -8, 20)
        this.body.fill({ color: this.plantColor, alpha: this.getAlphaForState() })
        break
      case 'bonds':
        // Bush shape: wide oval
        this.body.ellipse(0, 0, 22, 16)
        this.body.fill({ color: this.plantColor, alpha: this.getAlphaForState() })
        break
      case 'cash':
        // Grass shape: small patch
        this.body.ellipse(0, 5, 24, 8)
        this.body.fill({ color: this.plantColor, alpha: this.getAlphaForState() })
        break
      case 'commodities':
        // Cactus: rounded rectangle
        this.body.roundRect(-10, -10, 20, 28, 8)
        this.body.fill({ color: this.plantColor, alpha: this.getAlphaForState() })
        break
      case 'crypto':
        // Orchid: diamond/flower shape
        this.body.moveTo(0, -18)
        this.body.lineTo(14, 0)
        this.body.lineTo(0, 18)
        this.body.lineTo(-14, 0)
        this.body.closePath()
        this.body.fill({ color: this.plantColor, alpha: this.getAlphaForState() })
        break
      default:
        this.body.circle(0, 0, 16)
        this.body.fill({ color: this.plantColor, alpha: this.getAlphaForState() })
    }

    // Ground shadow
    this.body.ellipse(0, 20, 16, 4)
    this.body.fill({ color: 0x000000, alpha: 0.08 })
  }

  private getAlphaForState(): number {
    switch (this.currentState) {
      case 'healthy': return 0.9
      case 'growing': return 1.0
      case 'damaged': return 0.6
      case 'wilted': return 0.35
      default: return 0.9
    }
  }

  setState(state: PlantState): void {
    this.currentState = state
    this.drawPlantBody()

    // Adjust opacity based on state (works for both PNG and emoji)
    const alpha = this.getAlphaForState()

    if (this.plantImage) {
      this.plantImage.alpha = alpha
    }

    switch (state) {
      case 'healthy':
        this.emojiText.alpha = 1.0
        break
      case 'growing':
        this.emojiText.alpha = 1.0
        break
      case 'damaged':
        this.emojiText.alpha = 0.7
        break
      case 'wilted':
        this.emojiText.alpha = 0.4
        break
    }
  }

  getState(): PlantState {
    return this.currentState
  }

  setLabel(text: string): void {
    this.labelText.text = text
    this.labelText.visible = text.length > 0
  }

  // Called to show growth effect (+positive)
  showGrowthEffect(): void {
    this.setState('growing')
  }

  // Called to show damage effect (-negative)
  showDamageEffect(): void {
    this.setState('damaged')
  }

  // Return to healthy
  recover(): void {
    this.setState('healthy')
  }

  // Get the base scale for animation reset
  getBaseScale(): number {
    return this.baseScale
  }
}