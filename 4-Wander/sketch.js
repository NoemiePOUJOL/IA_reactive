let vehicles = [];
const nbVehicles = 20;  // Nombre initial de véhicules

function setup() {
  createCanvas(800, 820);

  // Création des véhicules initiaux
  for(let i = 0; i < nbVehicles; i++) {
    addNewVehicle();
  }
}

function draw() {
  background(0);

  // Afficher et mettre à jour chaque véhicule
  vehicles.forEach(vehicle => {
    vehicle.wander();
    vehicle.update();
    vehicle.show();
    vehicle.edges();
  });
}

// Fonction pour ajouter un nouveau véhicule avec des caractéristiques aléatoires
function addNewVehicle() {
  let x = random(width);  // Position aléatoire en x
  let y = random(height);  // Position aléatoire en y
  let size = random(10, 30);  // Taille aléatoire entre 10 et 30
  let r = random(255);  // Couleur aléatoire (RVB)
  let g = random(255);
  let b = random(255);

  // Créer un véhicule et l'ajouter au tableau
  let vehicle = new Vehicle(x, y, size, r, g, b);
  vehicles.push(vehicle);
}

// Fonction pour activer/désactiver le mode debug avec la touche 'd'
// et ajouter un véhicule avec la touche 'a'
function keyPressed() {
  if (key === 'd') {
    Vehicle.debug = !Vehicle.debug;
  } else if (key === 'a') {
    addNewVehicle();  // Ajouter un nouveau véhicule si on appuie sur 'a'
  }
}
