const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const control = document.getElementsByClassName("control")[0];
const credits = document.getElementsByClassName("credits")[0];

let [spawn, strategy, population, hitboxes, lines] = ["factionsSpawn", "attackHide", 100, false, false];

const rock = new Image();
rock.src = "assets/rock.png";

const paper = new Image();
paper.src = "assets/paper.png"; 

const scissors = new Image();
scissors.src = "assets/scissors.png";

const assets = [rock, paper, scissors];

let players = [];

class Player {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = 30;
        this.height = 30;
        this.hitbox = 15;
    }
    
    collide (player) {      
        const a = this.hitbox + player.hitbox;
        const x = this.x - player.x;
        const y = this.y - player.y;
      
        if (a > Math.sqrt((x * x) + (y * y))) {
          return true;
        } else {
          return false;
        } 
    }

    isKillable (player) {
        if (this.type == "rock" && player.type == "rock") return false;
        if (this.type == "rock" && player.type == "paper") return false;
        if (this.type == "rock" && player.type == "scissors") return true;

        if (this.type == "paper" && player.type == "rock") return true;
        if (this.type == "paper" && player.type == "paper") return false;
        if (this.type == "paper" && player.type == "scissors") return false;

        if (this.type == "scissors" && player.type == "rock") return false;
        if (this.type == "scissors" && player.type == "paper") return true;
        if (this.type == "scissors" && player.type == "scissors") return false;
    }

    isEnemy (player) {
        if (this.type == "rock" && player.type == "rock") return false;
        if (this.type == "rock" && player.type == "paper") return true;
        if (this.type == "rock" && player.type == "scissors") return false;

        if (this.type == "paper" && player.type == "rock") return false;
        if (this.type == "paper" && player.type == "paper") return false;
        if (this.type == "paper" && player.type == "scissors") return true;

        if (this.type == "scissors" && player.type == "rock") return true;
        if (this.type == "scissors" && player.type == "paper") return false;
        if (this.type == "scissors" && player.type == "scissors") return false;
    }

    draw () {
        const img = assets[["rock", "paper", "scissors"].indexOf(this.type)];

        ctx.drawImage(img, this.x - (this.width / 2), this.y - (this.height / 2), this.width, this.height);

        if (hitboxes) {
            ctx.beginPath();
            ctx.strokeStyle = "black";
            ctx.arc(this.x, this.y, this.hitbox, 0, 2 * Math.PI);
            ctx.stroke();
        }
    }

    closestKillable () {
        let closestK;
        let closestDistance;

        players.forEach((i) => {
            if (i == this) return;

            const a = this.x - i.x;
            const b = this.y - i.y;
            const c = Math.sqrt(a * a + b * b);

            if (!closestDistance || c < closestDistance) {
                if (this.isKillable(i)) {
                    closestK = i;
                    closestDistance = c;
                }
            }
        })

        return [closestK, closestDistance];
    }

    closestEnemy () {
        let closestE;
        let closestDistance;

        players.forEach((i) => {
            if (i == this) return;

            const a = this.x - i.x;
            const b = this.y - i.y;
            const c = Math.sqrt(a * a + b * b);

            if (!closestDistance || c < closestDistance) {
                if (this.isEnemy(i)) {
                    closestE = i;
                    closestDistance = c;
                }
            }
        })

        return [closestE, closestDistance];
    }

    move () {
        if (strategy == "attackHide") {
            const closestK = this.closestKillable();
            const closestE = this.closestEnemy();

            if (closestK[0]) {
                if (closestK[1] < closestE[1] || !closestE[0]) {
                    if (lines) {
                        ctx.beginPath();
                        ctx.strokeStyle = "green";
                        ctx.moveTo(this.x, this.y);
                        ctx.lineTo(closestK[0].x, closestK[0].y);

                        ctx.stroke();
                    }

                    const direction = Math.atan2(closestK[0].y - this.y, closestK[0].x - this.x) * 180 / Math.PI;
                    
                    this.x += Math.cos(direction * (Math.PI / 180));
                    this.y += Math.sin(direction * (Math.PI / 180)); 
                }
            }

            if (closestE[0]) {
                if (closestE[1] < closestK[1] || !closestK[0]) {
                    if (lines) {
                        ctx.beginPath();
                        ctx.strokeStyle = "red";
                        ctx.moveTo(this.x, this.y);
                        ctx.lineTo(closestE[0].x, closestE[0].y);

                        ctx.stroke();
                    }

                    const direction = Math.atan2(closestE[0].y - this.y, closestE[0].x - this.x) * 180 / Math.PI + 180;
                    
                    const escapedX = this.x + Math.cos(direction * (Math.PI / 180));
                    const escapedY = this.y + Math.sin(direction * (Math.PI / 180));

                    if (escapedX < canvas.width && escapedX > 0) this.x += Math.cos(direction * (Math.PI / 180)) * 0.5;
                    if (escapedY < canvas.height && escapedY > 0) this.y += Math.sin(direction * (Math.PI / 180)) * 0.5; 
                }
            }
        } else {
            const player = players[Math.floor(randomNum(0, players.length - 1))];

            if (lines) {
                ctx.beginPath();
                ctx.strokeStyle = "grey";
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(player.x, player.y);

                ctx.stroke();
            }

            const direction = Math.atan2(player.y - this.y, player.x - this.x) * 180 / Math.PI;
                    
            this.x += Math.cos(direction * (Math.PI / 180)) * 0.5;
            this.y += Math.sin(direction * (Math.PI / 180)) * 0.5; 
        }

        const newX = this.x + randomNum(-2, 2);
        const newY = this.y + randomNum(-2, 2);

        if (newX < canvas.width && newX > 0) this.x += randomNum(-2, 2);
        if (newY < canvas.height && newY > 0) this.y += randomNum(-2, 2);
    }

    change () {
        players.forEach((i) => {
            if (this.collide(i)) {
                if (this.isKillable(i)) {
                    i.type = this.type;
                }
            }
        })
    }
}

function randomNum(min, max) {
    return Math.random() * (max - min) + min;
}

function gameWon () {
    let type;
    let gameWon = true;

    players.forEach((i) => {
        if (!type) {
            type = i.type;
            return;
        }

        if (i.type != type) {
            gameWon = false;
        }
    })

    return [gameWon, type];
}

function startGame() {
    if (population < 3) population = 3;

    hitboxes = document.getElementsByTagName("input")[4].checked;
    lines = document.getElementsByTagName("input")[5].checked;

    players = [];

    resize();

    control.style.display = "none";
    credits.style.display = "none";

    if (spawn == "factionsSpawn") {
        const distance = population;

        let points = [
            [randomNum(0, canvas.width), randomNum(0, canvas.height)], 
            [randomNum(0, canvas.width), randomNum(0, canvas.height)], 
            [randomNum(0, canvas.width), randomNum(0, canvas.height)]
        ];

        function spawnRock () {
            let rockPoint = [randomNum(0, canvas.width), randomNum(0, canvas.width)];
            let rockDistance;

            const rockA = rockPoint[0] - points[0][0];
            const rockB = rockPoint[1] - points[0][1];
            const rockC = Math.sqrt(rockA * rockA + rockB * rockB);

            rockDistance = rockC;

            while (rockDistance > distance || rockPoint[0] < 0 || rockPoint[0] > canvas.width || rockPoint[1] > canvas.height || rockPoint[1] < 0) {
                rockPoint = [randomNum(0, canvas.width), randomNum(0, canvas.width)];

                const rA = rockPoint[0] - points[0][0];
                const rB = rockPoint[1] - points[0][1];
                const rC = Math.sqrt(rA * rA + rB * rB);

                rockDistance = rC;
            }

            players.push(new 
                Player (
                    rockPoint[0], 
                    rockPoint[1], 
                    "rock"
                )
            );
        }

        function spawnPaper () {
            let paperPoint = [randomNum(0, canvas.width), randomNum(0, canvas.width)];
            let paperDistance;

            const paperA = paperPoint[0] - points[1][0];
            const paperB = paperPoint[1] - points[1][1];
            const paperC = Math.sqrt(paperA * paperA + paperB * paperB);

            paperDistance = paperC;

            while (paperDistance > distance || paperPoint[0] < 0 || paperPoint[0] > canvas.width ||  paperPoint[1] > canvas.height || paperPoint[1] < 0) {
                paperPoint = [randomNum(0, canvas.width), randomNum(0, canvas.width)];

                const pA = paperPoint[0] - points[1][0];
                const pB = paperPoint[1] - points[1][1];
                const pC = Math.sqrt(pA * pA + pB * pB);

                paperDistance = pC;
            }

            players.push(new
                Player (
                    paperPoint[0],
                    paperPoint[1],
                    "paper"
                )
            );
        }

        function spawnScissors () {
            let scissorsPoint = [randomNum(0, canvas.width), randomNum(0, canvas.width)];
            let scissorsDistance;

            const scissorsA = scissorsPoint[0] - points[2][0];
            const scissorsB = scissorsPoint[1] - points[2][1];
            const scissorsC = Math.sqrt(scissorsA * scissorsA + scissorsB * scissorsB);

            scissorsDistance = scissorsC;

            while (scissorsDistance > distance || scissorsPoint[0] < 0 || scissorsPoint[0] > canvas.width ||  scissorsPoint[1] > canvas.height || scissorsPoint[1] < 0) {
                scissorsPoint = [randomNum(0, canvas.width), randomNum(0, canvas.width)];

                const sA = scissorsPoint[0] - points[2][0];
                const sB = scissorsPoint[1] - points[2][1];
                const sC = Math.sqrt(sA * sA + sB * sB);

                scissorsDistance = sC;
            }

            players.push(new
                Player (
                    scissorsPoint[0],
                    scissorsPoint[1],
                    "scissors"
                )
            );
        }


        for (let i = 0; i < Math.floor(population / 3); i++) {  
            spawnRock();
            spawnPaper();
            spawnScissors();
        }
    } else {
        for (let i = 0; i < Math.floor(population / 3); i++) {   
            players.push(new 
                Player (
                    randomNum(0, canvas.width), 
                    randomNum(0, canvas.height), 
                    "rock"
                )
            );

            players.push(new 
                Player (
                    randomNum(0, canvas.width), 
                    randomNum(0, canvas.height), 
                    "paper"
                )
            );

            players.push(new 
                Player (
                    randomNum(0, canvas.width), 
                    randomNum(0, canvas.height), 
                    "scissors"
                )
            );
        }
    }

    game();
}

function game () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    players.forEach((i) => {
        i.move();
        i.change();
        i.draw();
    })

    ctx.font = "15px Arial";
    ctx.fillText(`⛰️`, 3, 15);
    ctx.fillText(`📄`, 4.5, 33);
    ctx.fillText(`✂️`, 4, 52);

    ctx.fillText(`- ${players.filter(i => i.type == "rock").length}`, 30, 15);
    ctx.fillText(`- ${players.filter(i => i.type == "paper").length}`, 30, 33);
    ctx.fillText(`- ${players.filter(i => i.type == "scissors").length}`, 30, 52);

    if (players.length > 0 && gameWon()[0]) {
        const winner = gameWon()[1];

        alert(`${winner[0].toUpperCase()}${winner.substring(1)} ${["⛰️", "📄", "✂️"][["rock", "paper", "scissors"].indexOf(winner)]} has won!`)

        control.style.display = "inline";
        credits.style.display = "inline";
        
        return;
    }

    requestAnimationFrame(game);
}

function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight;;
}

function setSpawn(spawnType) {
    const factionsSpawn = document.getElementsByTagName("input")[0];
    const randomSpawn = document.getElementsByTagName("input")[1];

    if (spawnType.name == "factionsSpawn") {
        randomSpawn.checked = false;
    } else {
        factionsSpawn.checked = false;
    }

    if (spawnType.checked == false) spawnType.checked = true;

    spawn = spawnType.name;
}

function setStrategy(strategyType) {
    const attackHideStrategy = document.getElementsByTagName("input")[2];
    const randomStrategy = document.getElementsByTagName("input")[3];

    if (strategyType.name == "attackHideStrategy") {
        randomStrategy.checked = false;
    } else {
        attackHideStrategy.checked = false;
    }

    if (strategyType.checked == false) strategyType.checked = true;

    strategy = strategyType.value;
}

function setPopulation(populationNum) {
    if (!Number(populationNum.value) || populationNum.value.length > 5) populationNum.value = populationNum.value.slice(0, -1);

    population = Number(populationNum.value);
}

window.onload = function() {
    resize();
}