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
      default: 'arcade',
      arcade: {
        gravity: { y: 300 },
        debug: false
      }
    },
    scene: {
      create: create,
      update: update
    }
  }

  game = new Phaser.Game(config)

  let ball: Phaser.Physics.Arcade.Sprite

  function create(this: Phaser.Scene) {
    ball = this.physics.add.sprite(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      undefined
    )

    // Create ball graphics
    const graphics = this.make.graphics({ x: 0, y: 0, add: false })
    graphics.fillStyle(0xff6b6b, 1)
    graphics.fillCircle(15, 15, 15)
    graphics.generateTexture('ball', 30, 30)
    graphics.destroy()

    ball.setTexture('ball')
    ball.setBounce(0.8, 0.8)
    ball.setCollideWorldBounds(true)
    ball.setVelocity(Phaser.Math.Between(-200, 200), -300)
  }

  function update() {
    // Game logic per frame
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
}
</style>
