let vehicles = [];  // Tableau pour stocker les véhicules
let targets = [];   // Tableau pour stocker les cibles
let targetDirections = [];  // Vecteurs pour la direction de sortie des cibles
let numVehiclesMenu = 29;  // Nombre de véhicules pour le menu
let numVehiclesSketch = 10;  // Nombre de véhicules pour le sketch
let allArrived = false;  // Indique si tous les véhicules sont arrivés
let moveTargets = false;  // Indique si les cibles doivent commencer à bouger après le délai
let trails = [];  // Tableau pour stocker les traînées des véhicules
let font; // Variable pour la police
let textPoints = [];  // Points pour dessiner "Press the key D"

// Initialisation de l'état du jeu pour l'affichage de la page 
let gameState = "menu"; // 'menu' ou 'jeu'

// Chargement de la police pour le texte
function preload() {
  font = loadFont('../VarelaRound-Regular.ttf');  
}

function setup() {
  createCanvas(800, 820);
  
  // Créer les points pour dessiner "Press the key D"
  let points = font.textToPoints('Press the key D', 0, 0, 96, {
    sampleFactor: 0.1
  });

  textPoints = points;  // Stocker les points pour les utiliser dans draw

  // Calculs pour centrer le texte sur la page 
  let minX = Math.min(...points.map(p => p.x));
  let maxX = Math.max(...points.map(p => p.x));
  let minY = Math.min(...points.map(p => p.y));
  let maxY = Math.max(...points.map(p => p.y));
  
  let textWidth = maxX - minX;
  let textHeight = maxY - minY;
  let offsetX = (width - textWidth) / 2 - minX;
  let offsetY = (height - textHeight) / 2 - minY;
 
  textPoints = points.map(p => ({
    x: p.x + offsetX,
    y: p.y + offsetY
  }));

  // Initialisation pour le menu
  setupMenu();
}

function setupMenu() {

  // Affichae du mot "HEY" 
  let gridSize = 60; 
  let startX = 100;  // Point de départ horizontal
  let startY = 200;  // Point de départ vertical
  
  // H 
  targets.push(createVector(startX, startY));
  targets.push(createVector(startX, startY + gridSize));
  targets.push(createVector(startX, startY + 2 * gridSize));
  targets.push(createVector(startX, startY + 3 * gridSize));
  targets.push(createVector(startX, startY + 4 * gridSize));
  targets.push(createVector(startX + gridSize, startY + 2 * gridSize));  // Barre centrale
  targets.push(createVector(startX + 2 * gridSize , startY + 2 * gridSize)); // Barre centrale
  targets.push(createVector(startX + 3 * gridSize, startY));
  targets.push(createVector(startX + 3 * gridSize, startY + gridSize));
  targets.push(createVector(startX + 3 * gridSize, startY + 2 * gridSize));
  targets.push(createVector(startX + 3 * gridSize, startY + 3 * gridSize));
  targets.push(createVector(startX + 3 * gridSize, startY + 4 * gridSize));
  
  // E 
  let offsetX = 5 * gridSize; // Espacement entre les lettres
  targets.push(createVector(startX + offsetX, startY));
  targets.push(createVector(startX + offsetX, startY + gridSize));
  targets.push(createVector(startX + offsetX, startY + 2 * gridSize));
  targets.push(createVector(startX + offsetX, startY + 3 * gridSize));
  targets.push(createVector(startX + offsetX, startY + 4 * gridSize));
  targets.push(createVector(startX + offsetX + gridSize, startY));  // Barre supérieure
  targets.push(createVector(startX + offsetX + 2 * gridSize, startY));  // Barre supérieure
  targets.push(createVector(startX + offsetX + gridSize, startY + 2 * gridSize));  // Barre centrale
  targets.push(createVector(startX + offsetX + gridSize, startY + 4 * gridSize));  // Barre inférieure
  targets.push(createVector(startX + offsetX + 2 * gridSize, startY + 4 * gridSize));  // Barre inférieure
  
  // Y 
  offsetX = 9 * gridSize; // Espacement pour Y
  targets.push(createVector(startX + offsetX, startY));
  targets.push(createVector(startX + offsetX + 2 * gridSize, startY));
  targets.push(createVector(startX + offsetX + 0.5 * gridSize, startY + gridSize));
  targets.push(createVector(startX + offsetX + 1.5 * gridSize, startY + gridSize));
  targets.push(createVector(startX + offsetX + gridSize, startY + 2 * gridSize));
  targets.push(createVector(startX + offsetX + gridSize, startY + 3 * gridSize));
  targets.push(createVector(startX + offsetX + gridSize, startY + 4 * gridSize));
  
  // Créer les véhicules à des positions aléatoires
  for (let i = 0; i < numVehiclesMenu; i++) {
    let x = random(width);
    let y = random(height);
    vehicles.push(new Vehicle(x, y));  // Ajouter un véhicule au tableau

    // Initialiser une traînée vide pour chaque véhicule
    trails.push([]);
    
    // Calculer la direction pour chaque cible en fonction de sa position initiale
    let direction = createVector(targets[i % targets.length].x - width / 2, targets[i % targets.length].y - height / 2);
    direction.normalize();  
    targetDirections.push(direction);  // Stocker la direction dans le tableau
  }
}

// Affichage de la page selon le gameState
function draw() {
  background(0);

  if (gameState === "menu") {
    drawMenu();
  } else if (gameState === "jeu") {
    drawSketch();
  }
}

function drawMenu() {
  if (moveTargets) {
    targets.forEach((target, index) => {
      let velocity;
      if (targetDirections[index]) {  
        velocity = targetDirections[index].copy();  
      } else {
        velocity = createVector(0, 0);  
      }
      velocity.mult(5);  
      target.add(velocity);
  
      // Vérifier si la cible est hors du cadre et la supprimer si c'est le cas
      if (target.x < 0 || target.x > width || target.y < 0 || target.y > height) {
        targets.splice(index, 1);  // Supprimer la cible
        targetDirections.splice(index, 1);  // Supprimer sa direction associée
      }
    });
  }
  
  // Dessiner les cibles restantes
  targets.forEach(target => {
    fill(255, 255, 255, 0);  
    noStroke();
    ellipse(target.x, target.y, 40);  
  });
  
  // Vérifier si tous les véhicules sont arrivés
  allArrived = vehicles.every((vehicle, index) => {
    let targetIndex = index % targets.length;
    let target = targets[targetIndex];
    let distance = p5.Vector.dist(vehicle.pos, target);
    return distance < 5;  // Considère qu'un véhicule est arrivé si la distance est petite
  });

  // Contrôler chaque véhicule
  vehicles.forEach((vehicle, index) => {
    if (targets.length > 0) {
      let targetIndex = index % targets.length;  
      let target = targets[targetIndex];
      let steering = vehicle.arrive(target);
  
      let distance = p5.Vector.dist(vehicle.pos, target);
      if (distance < 20) {
        vehicle.r = map(distance, 0, 20, 18, 30);  // "Rebond" du cercle
      } else {
        vehicle.r = 16;  
      }
  
      vehicle.applyForce(steering);
      vehicle.update();
      vehicle.show();
    }
  });



  // Passer à l'état "jeu" si tous les véhicules sont arrivés
  if (allArrived) {
    gameState = "jeu";
  }
}

function drawSketch() {

  // Dessiner les points du texte "Press the key D"
  textPoints.forEach(pt => {
    let d = dist(mouseX, mouseY, pt.x, pt.y);

    // Changement de couleur à l'approche de la souris
    let redValue = map(d/2, 0, 100, 255, 255);  
    let greenValue = map(d/2, 0, 100, 0, 255);  
    let blueValue = map(d/2, 0, 100, 0, 255);   

    fill(redValue, greenValue, blueValue);  // Couleur dynamique entre rouge et blanc


    ellipse(pt.x, pt.y, 5, 5);  // Affiche chaque point
  });
 

  // Cible qui suit la souris
  let target = createVector(mouseX, mouseY);
  fill(255, 0, 0);
  noStroke();
  ellipse(target.x, target.y, 32);

  // On parcourt le tableau des véhicules
  for (let i = 0; i < numVehiclesSketch; i++) {
    let vehicle = vehicles[i];
    let steering;

    if (i === 0) {
      // 1er véhicule : comportement arrive normal
      steering = vehicle.arrive(target);
    } else {
      // Pour les autres véhicules : ils suivent le précédent
      let newTarget = vehicles[i - 1].pos;
      steering = vehicle.arrive(newTarget, 40);
    }

    // Appliquer la force et mettre à jour le véhicule
    vehicle.applyForce(steering);
    vehicle.update();
    vehicle.show();

    // Ajouter la position actuelle du véhicule à sa traînée
    trails[i].push(vehicle.pos.copy());

    // Limiter la longueur de la traînée 
    if (trails[i].length > 300) {  
      trails[i].splice(0, 1);  
    }

    // Dessiner la traînée
    noFill();
    stroke(255, 100);
    beginShape();
    trails[i].forEach(pos => {
      vertex(pos.x, pos.y);
    });
    endShape();
  }
}

function keyPressed() {
  if (key === 'd') {
    Vehicle.debug = !Vehicle.debug;
  }
}
