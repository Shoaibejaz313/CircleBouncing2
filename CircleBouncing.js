let canvs = document.querySelector("canvas");
let c = canvs.getContext("2d");


//set the size
canvs.width = window.innerWidth;
canvs.height = window.innerHeight;

window.addEventListener("resize", () => {
    canvs.width = window.innerWidth;
    canvs.height = window.innerHeight;
})

let mouse = {
    x: 10,
    y: 10,
}

let circleArray = [];

window.addEventListener("mousemove", function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
})


let maxRadius = 50;

let colorArray = [
    "#2596be",
    "#2e177d",
    "#5C177D",
    "#7D174B",
    "#2DCABD",
]

let gravity = 0.2;
let firction = 0.50;


function randomfunc(max, min) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}


function randomColor() {
    return colorArray[Math.floor(Math.random() * colorArray.length)]
}


function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}




function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        // Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        // Velocity before equation
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        // Velocity after 1d collision equation
        const v1 = {
  x: (u1.x * (m1 - m2) + u2.x * 2 * m2) / (m1 + m2),
  y: u1.y
};

const v2 = {
  x: (u2.x * (m2 - m1) + u1.x * 2 * m1) / (m1 + m2),
  y: u2.y
};

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effec+ u2.x t
        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;

        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
    }
}


function Circle(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.velocity ={
        x:randomfunc(0,8),
        y:randomfunc(0,8)
    }
    this.radius = radius;
    this.color = color;
    this.mass  =1;
    this.opacity = 0;



    this.draw = function () {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.save();
        c.globalAlpha = this.opacity;
        c.fillStyle = this.color;
        c.fill()
        c.restore();
        c.lineWidth = 5;
        c.strokeStyle = this.color;
        c.stroke();
    }

    this.updated = (particles) => {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        if(this.x + this.radius > canvs.width || this.x - this.radius <0){
            this.velocity.x = -this.velocity.x;
        }
        if(this.y + this.radius > canvs.height ||this.y - this.radius <0){
           this.velocity.y = -this.velocity.y;
        }

         let distance = getDistance(this.x,this.y,mouse.x,mouse.y);
            if(distance  < 300 && this.opacity < 0.2){
                this.opacity += 0.5;
            }else if(this.opacity >0){
                this.opacity -= 0.01;
                this.opacity = Math.max(0,this.opacity);
            }

        for(let i=0;i<particles.length;i++){
            if(this === particles[i]) continue;
            if(getDistance(this.x,this.y,particles[i].x,particles[i].y) - this.radius *2 <0){
                resolveCollision(this,particles[i])
            }
           
        }
    }
}



// function init(){
//     circleArray = [];
// for (let i = 0; i < 100; i++) {
//     let x = randomfunc(0,canvs.width);
//     let y = randomfunc(0,canvs.height);
//     let raduius = randomfunc(10,50);
//     let dx = randomfunc(-2,2);
//     let dy = randomfunc(-2,2);
//     let color = randomColor(colorArray);
//     circleArray.push(new Circle(x, y, dx,dy, raduius, color));
// }
// }


// window.addEventListener("click",() => {
//     init()
// })


function getDistance(x1, y1, x2, y2) {
    let positionX = x2 - x1;
    let positionY = y2 - y1;

    return Math.sqrt(Math.pow(positionX, 2) + Math.pow(positionY, 2));

}




let particles;
function init() {

    particles = [];
    for (let i = 0; i < 100; i++) {
        const radius = 30;
        let x = randomfunc(radius,canvs.width - radius);
        let y = randomfunc(radius,canvs.height - radius);
        let color = colorArray[randomfunc(0,colorArray.length)]
        


        if (i !== 0) {
            for (let j = 0; j < particles.length; j++) {
                if (getDistance(x, y, particles[j].x, particles[j].y) - radius*2 < 0) {
                    x = randomfunc(radius,canvs.width - radius);
                    y = randomfunc(radius,canvs.height - radius);
                    j = -1;
                }
            }
            
        }
            particles.push(new Circle(x, y, radius, color));
    }
}


init();
let distance = 0;
function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);



    for (let i = 0; i < particles.length; i++) {
        particles[i].updated(particles);
    }

}
animate()



