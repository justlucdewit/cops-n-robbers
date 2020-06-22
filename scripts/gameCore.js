const map = (n, start1, stop1, start2, stop2) => (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;

class Entity {
	x = 0;
	y = 0;
	type = 0;// 0=cop; 1=theif; 3=diamond; 4=drugs;
	hasItem = false;
	id = 0;
	static lastId = 0;
	element;
	selected = false;

	constructor(x, y, type, el) {
		this.x = x;
		this.y = y;
		this.type = type;
		Entity.lastId++;
		this.id = Entity.lastId;
		this.element = el;
	}

	moveHorizontal(right) {
		const oldX = this.x;
		const animated = this;
		let interval = setInterval(() => {
			animated.x += (right? 1 : -1);
			animated.element.style.left = animated.x + "vw";
			if ((window.innerWidth/100 * animated.x >= window.innerWidth/100*(4.98+oldX) && right) || (window.innerWidth/100 * animated.x <= window.innerWidth/100*(oldX-4.98) && !right)){
				animated.x = oldX + (right ? 4.98 : -4.98);
				animated.element.style.left = animated.x + "vw";
				clearInterval(interval);
			}
		}, 100);
	}

	moveVertical(up) {
		const oldHeight = map(this.y, 0, 100, 0, window.innerHeight);
		const animated = this;
		const goal = oldHeight - (board.height/100*9) * (up? 1 : -1);

		let interval = setInterval(() => {
			animated.y -= 1.3 * (up? 1 : -1);
			animated.element.style.top = animated.y + "vh";

			if ((map(animated.y, 0, 100, 0, window.innerHeight) <= goal && up) || (map(animated.y, 0, 100, 0, window.innerHeight) >= goal && !up)){
				animated.y = map(goal, 0, window.innerHeight, 0, 100);
				animated.element.style.top = animated.y + "vh";
				clearInterval(interval);
			}
		}, 100);
	}

	reset() {
		this.element.style.backgroundColor = "";
		this.element.style.border = "";
		this.element.style.marginLeft = "0";
		this.element.style.marginTop = "0";
		this.selected = false;
	}
}

const entities = [];
let turn = 0;
let entitySize;
let boardheight = document.getElementById("board").height;
let gameArea = document.getElementById("board").height * 100 / window.innerHeight;

const canvas = document.getElementById("hud");
const ctx = canvas.getContext("2d");

const resetGame = () => {
	// spawn cops
	for (let i = 0; i < 6; i++) {
		const x = 0.75;
		const y = map(1.3 + i * 18, 0, 100, 0, gameArea);
		const newPlayer = document.createElement("img");
		newPlayer.src = "assets/cop.png";
		newPlayer.classList.add("player");
		newPlayer.style.left = x + "vw";
		newPlayer.style.top = y + "vh";
		document.body.appendChild(newPlayer);
		entities.push(new Entity(x, y, 0, newPlayer));
	}

	// spawn theifs
	for (let i = 0; i < 6; i++) {
		const x = 95.2;
		const y = map(1.4 + i * 18, 0, 100, 0, gameArea);
		const newPlayer = document.createElement("img");
		newPlayer.src = "assets/theif.png";
		newPlayer.classList.add("player");
		newPlayer.style.left =  x + "vw";
		newPlayer.style.top = y + "vh";
		document.body.appendChild(newPlayer);
		entities.push(new Entity(x, y, 1, newPlayer));
	}

	// spawn diamonds
	for (let i = 0; i < 3; i++) {
		const x = 20.4;
		const y = map(37 + i * 9, 0, 100, 0, gameArea);
		const newItem = document.createElement("img");
		newItem.src = "assets/diamond.png";
		newItem.classList.add("player");
		newItem.style.left = x + "vw";
		newItem.style.top = y + "vh";
		document.body.appendChild(newItem);
		entities.push(new Entity(x, y, 2, newItem));
	}

	// spawn drugs
	for (let i = 0; i < 3; i++) {
		const x = 75.5;
		const y = map(37 + i * 9, 0, 100, 0, gameArea);
		const newItem = document.createElement("img");
		newItem.src = "assets/drugs.png";
		newItem.classList.add("player");
		newItem.style.left = x + "vw";
		newItem.style.top = y + "vh";
		document.body.appendChild(newItem);
		entities.push(new Entity(x, y, 3, newItem));
	}

	entitySize = document.getElementsByClassName("player")[0].width;
};

const resetAllClickables = () => {
	for (const entity of entities)
		entity.reset();
};

window.onresize = () => {
	oldGameArea = gameArea;
	gameArea = document.getElementById("board").height * 100 / window.innerHeight;
	entitySize = document.getElementsByClassName("player")[0].width;

	for (const entity of entities) {
		entity.y = map(entity.y, 0, oldGameArea, 0, gameArea);
		entity.element.style.top = entity.y + "vh";
	}
};

canvas.onclick = (e) => {
	const x = e.clientX;
	const y = e.clientY;

	let movingEntity = false;
	for (const entity of entities) {
		if (entity.selected){
			movingEntity = entity;
		}

		if (x > window.innerWidth/100 * entity.x &&
			x < window.innerWidth/100 * entity.x + entitySize &&
			y > window.innerHeight/100 * entity.y &&
			y < window.innerHeight/100 * entity.y + entitySize &&
			(entity.type === 0 || entity.type === 1) ) {

			if (entity.selected) {
				entity.reset();
				return;
			}

			resetAllClickables();

			entity.selected = true;
			entity.element.style.backgroundColor = "rgba(255, 255, 255, .7)";
			entity.element.style.border = "1px solid black";
			entity.element.style.left 
			entity.element.style.marginLeft = "-1px";
			entity.element.style.marginTop = "-1px";
			return;
		}
	}

	if (movingEntity) {
		if (x - window.innerWidth/100 * movingEntity.x > window.innerWidth/100*4.2)
			movingEntity.moveHorizontal(true);

		if (x - window.innerWidth/100 * movingEntity.x < 0)
			movingEntity.moveHorizontal(false);

		if (y - window.innerHeight/100 * movingEntity.y < 0)
			movingEntity.moveVertical(true);

		if (y - window.innerHeight/100 * movingEntity.y > window.innerWidth/100*4.2)
			movingEntity.moveVertical(false);
	}

	resetAllClickables();

};