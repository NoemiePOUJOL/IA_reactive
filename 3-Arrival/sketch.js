let vehicles = [];  // Tableau pour stocker les véhicules
let targets = [];   // Tableau pour stocker les cibles obtenues via textToPoints
let trails = [];  // Tableau pour stocker les traînées des véhicules
let font;
let numVehiclesSketch = 10;  // Nombre de véhicules pour le sketch

// Initialisation de l'état du jeu
let gameState = "menu"; // 'menu' ou 'jeu'

// Chargement de la police
function preload() {
  font = loadFont('../VarelaRound-Regular.ttf');
}

function setup() {
  createCanvas(800, 800);
  
  // Initialisation des cibles à partir du texte
  let points = font.textToPoints('HEY', 100, 300, 200, { sampleFactor: 0.2 });

  for (let i = 0; i < points.length; i++) {
    let pt = points[i];
    targets.push(createVector(pt.x, pt.y));  // Ajouter les cibles à partir des points du texte
  }

  // Créer les véhicules à des positions aléatoires
  for (let i = 0; i < numVehiclesSketch; i++) {
    let x = random(width);
    let y = random(height);
    let vehicle = new Vehicle(x, y);  // Créer un véhicule
    vehicles.push(vehicle);  // Ajouter un véhicule au tableau

    // Initialiser une traînée vide pour chaque véhicule
    trails.push([]);
  }
}

function draw() {
  background(0);

  if (gameState === "menu") {
    drawMenu();  // On affiche les véhicules qui suivent les cibles (points du texte)
  } else if (gameState === "jeu") {
    drawSketch();  // Lancer le jeu (vague comportement des véhicules)
  }
}

function drawMenu() {
  // Dessiner les cibles restantes (points du texte)
  for (let i = 0; i < vehicles.length; i++) {
    let vehicle = vehicles[i];
    let target = targets[i % targets.length];  // On boucle sur les cibles si les véhicules sont plus nombreux

    let steering = vehicle.arrive(target);  // Arrivée à la cible
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

function drawSketch() {
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
