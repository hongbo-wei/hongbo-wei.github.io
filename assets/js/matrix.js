// By Hongbo Wei

// geting canvas by Boujjou Achraf
let c = document.getElementById("c");
let ctx = c.getContext("2d");

//making the canvas full screen
c.height = window.innerHeight;
c.width = window.innerWidth;

// ----
// Set characters for the matrix
// Classic
// let matrix = "01";

//chinese characters - taken from the unicode charset
let matrix = "黑客帝国abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()*&^%+-/~{[|`]}";

// Reloaded/Revolutions:
// let matrix = 'モエヤキオカ7ケサスz152ヨタワ4ネヌナ98ヒ0ホア3ウ セ¦:"꞊ミラリ╌ツテニハソ▪—<>0|+*コシマムメ'

// Resurrections:
// let matrix = 'モエヤキオカ7ケサスz152ヨタワ4ネヌナ98ヒ0ホア3ウ セ¦:"꞊ミラリ╌ツテニハソコ—<ム0|*▪メシマ>+'
// ----

//converting the string into an array of single characters
matrix = matrix.split("");

let font_size = 10;
let columns = c.width/font_size; //number of columns for the rain
//an array of drops - one per column
let drops = [];
//x below is the x coordinate
//1 = y co-ordinate of the drop(same for every drop initially)
for(let x = 0; x < columns; x++)
    drops[x] = 1; 

//drawing the characters
function draw()
{
    //Black BG for the canvas
    //translucent BG to show trail
    ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
    ctx.fillRect(0, 0, c.width, c.height);

    ctx.fillStyle = "#00FF46";//green text
    ctx.font = font_size + "px arial";
    //looping over drops
    for(let i = 0; i < drops.length; i++)
    {
        //a random chinese character to print
        let text = matrix[Math.floor(Math.random()*matrix.length)];
        //x = i*font_size, y = value of drops[i]*font_size
        ctx.fillText(text, i*font_size, drops[i]*font_size);

        //sending the drop back to the top randomly after it has crossed the screen
        //adding a randomness to the reset to make the drops scattered on the Y axis
        if(drops[i]*font_size > c.height && Math.random() > 0.975)
            drops[i] = 0;

        //incrementing Y coordinate
        drops[i]++;
    }
}

setInterval(draw, 35); //default 35

// Reference to the audio element
const audio = document.getElementById("background-music");

// Ensure the audio is playable on click
function togglePlay() {
    if (audio.paused) {
        audio.play().catch(error => {
            console.error("Playback failed:", error);
        });
    } else {
        audio.pause();
    }
}

// Add event listener to the entire page to toggle play/pause on click
document.body.addEventListener("click", togglePlay);