<template>
  <div ref="gameDiv" class="game"></div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import Phaser from 'phaser'

const gameDiv = ref<HTMLDivElement | null>(null)
let game: Phaser.Game | null = null

onMounted(() => {
  if (!gameDiv.value) return

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: gameDiv.value,
    width: gameDiv.value.clientWidth,
    height: gameDiv.value.clientHeight,
    physics: {
      default: 'arcade'
    },
    scene: {
      create: create
    }
  }

  game = new Phaser.Game(config)

  function create(this: Phaser.Scene) {
    let clickCount = 0

    // Create clickable button
    const button = this.add.rectangle(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      200,
      100,
      0x3b82f6
    )
    button.setInteractive()

    // Create text
    const text = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY - 150,
      'Clicks: 0',
      {
        fontSize: '32px',
        color: '#ffffff',
        align: 'center'
      }
    )
    text.setOrigin(0.5)

    // Button text
    const btnText = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      'CLICK ME!',
      {
        fontSize: '24px',
        color: '#ffffff',
        align: 'center'
      }
    )
    btnText.setOrigin(0.5)

    button.on('pointerdown', () => {
      clickCount++
      text.setText(`Clicks: ${clickCount}`)

      // Visual feedback
      this.tweens.add({
        targets: button,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 100,
        yoyo: true
      })
    })

    button.on('pointerover', () => {
      button.setFillStyle(0x60a5fa)
    })

    button.on('pointerout', () => {
      button.setFillStyle(0x3b82f6)
    })
  }
})

onBeforeUnmount(() => {
  if (game) {
    game.destroy(true)
    game = null
  }
})
</script>

<style scoped>
.game {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>
