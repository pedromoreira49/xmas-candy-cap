import { imageLoad } from './loaders/imageLoad.js'
import { soundLoad } from './loaders/soundLoad.js'
import { keyPress, key } from './keyboard.js'
import Player from './player.js'
import Enemy from './enemy.js'
import Candy from './candy.js'

//Constantes
const frames = 60
const totalEnemies = 8

//Alternaveis
let canvas
let context
let msg
let animation
let limits
let score = 0
let gameOver = false
let enemies = Array.from({length: totalEnemies})
let background
let candySound
let gameOverSound
let gameSound
let inimigo


//Jogador e Inimigo
const player = new Player(310, 100, 20, 6, 60, 60, '/sprites/player-sprite.png', frames)

//Frutas
const candy = new Candy(410, 200, 12, 5, 35, 35, '/sprites/candy.png', frames)

const init = async () => {
    canvas = document.querySelector('canvas')
    canvas.width = 700
    canvas.height = 400
    context = canvas.getContext('2d')

    msg = document.querySelector('h2')

    console.log(player.x)
    //render background
    background = await imageLoad('/sprites/background-florest.png')
    inimigo = await imageLoad('/sprites/enemy-sprite.png')
    //render sounds
    candySound = await soundLoad('/sounds/candy-cap.mp3')
    candySound.volume = .6
    gameOverSound = await soundLoad('/sounds/gameover.mp3')
    gameOverSound.volume = .5
    gameSound = await soundLoad('/sounds/gamemusic.mp3')
    gameSound.volume = .7
    gameSound.loop = true

    limits = {
        width: canvas.width,
        height: canvas.height
    }

    enemies = enemies.map(e =>
        new Enemy(
            Math.random() * limits.width,
            30, 20,
            Math.floor(Math.random() * (6 - 3)) + 3,
            60, 66,
            inimigo,
            frames
        )
    )
    keyPress(window)
    loopAnimation()
}

const loopAnimation = () => {
    setTimeout(() => {
        console.log(player.x)
        context.drawImage(background, 0, 0, limits.width, limits.height)
        player.move(limits, key)
        player.draw(context)

        candy.draw(context) 

        enemies.forEach(enemy => {
            enemy.draw(context)
            enemy.move(limits)
            gameOver = !gameOver ? enemy.colision(player.hurtbox) : true
        })

        if(player.status != 'down')
            gameSound.play()

        if(candy.colision(player.hurtbox)){
            candy.x = (Math.random() * limits.width) - 12
            candy.y = (Math.random() * limits.height) - 12
            candy.hurtbox.x = candy.x + candy.width / 2
            candy.hurtbox.y = candy.y + candy.height / 2
            candy.cellX = Math.floor(Math.random() * 7)
            console.log(candy)
            candySound.load()
            candySound.play()
            score++
            msg.innerHTML = `SCORE: ${score}`
        }

        if(gameOver){
            gameOverSound.play()
            gameSound.pause()
            cancelAnimationFrame(animation)
            msg.style.color = 'darkblue'
            msg.innerHTML = `GAME OVER! SCORE: ${score}`
        }else{
            animation = requestAnimationFrame(loopAnimation)
        }
    }, 1000 / frames)
}

export { init  }


