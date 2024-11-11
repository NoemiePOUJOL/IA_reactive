class Vehicle {
  constructor(x, y, r, red, green, blue) {
    this.pos = createVector(x, y);
    this.vel = createVector(1, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = random(1, 4);  // Vitesse max aléatoire
    this.maxForce = random(0.1, 0.3);  // Force max aléatoire
    this.r = r;  // Taille du véhicule passée en paramètre
    this.red = red;  // Couleur rouge
    this.green = green;  // Couleur verte
    this.blue = blue;  // Couleur bleue
    this.wanderTheta = PI / 2;
    this.displaceRange = 0.3;
    this.path = [];
    this.xoff = random(1000);  // Offset initial pour le Perlin noise
  }

  wander() {
    let wanderPoint = this.vel.copy();
    wanderPoint.setMag(100);
    wanderPoint.add(this.pos);

    let wanderRadius = 50;

    if (Vehicle.debug) {
      // Affichage des éléments de débogage
      fill(255, 0, 0);
      noStroke();
      circle(wanderPoint.x, wanderPoint.y, 8);

      // Cercle autour du point
      noFill();
      stroke(255);
      circle(wanderPoint.x, wanderPoint.y, wanderRadius * 2);

      // on dessine une ligne qui relie le vaisseau à ce point
      line(this.pos.x, this.pos.y, wanderPoint.x, wanderPoint.y);
      
    }

    // Calcul du point vert sur le cercle
    let theta = this.wanderTheta + this.vel.heading();
    let x = wanderRadius * cos(theta);
    let y = wanderRadius * sin(theta);
    wanderPoint.add(x, y);

    if (Vehicle.debug) {
      // Affichage du point vert en mode debug
      fill(0, 255, 0);
      noStroke();
      circle(wanderPoint.x, wanderPoint.y, 16);

      line(this.pos.x, this.pos.y, wanderPoint.x, wanderPoint.y);
    }

    let steer = wanderPoint.sub(this.pos);
    steer.setMag(this.maxForce);
    this.applyForce(steer);

    this.wanderTheta += random(-this.displaceRange, this.displaceRange);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.set(0, 0);

    // on rajoute la position courante dans le tableau du chemin
    this.path.push(this.pos.copy());

    // Limiter la taille du chemin à 50 points par exemple
    if (this.path.length > 100) {
      this.path.shift();  // Retirer le premier élément du tableau si on dépasse la taille limite
    }
  }

  show() {
    // Dessin du chemin
    this.path.forEach((p, index) => {
      if (!(index % 3)) {
        stroke(this.red,this.green,this.blue);
        fill(this.red,this.green,this.blue);
        circle(p.x, p.y, 1);
      }
    });

    // Dessin du véhicule avec sa couleur et sa taille
    fill(this.red, this.green, this.blue);  // Appliquer la couleur
    stroke(255);
    strokeWeight(2);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    triangle(-this.r, -this.r / 2, -this.r, this.r / 2, this.r, 0);
    pop();
  }

  edges() {
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    } else if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
    }
    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
    }
  }
}
