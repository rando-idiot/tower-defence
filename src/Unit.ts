import type { Game } from "./Game.ts";
import rl from "./raylib.ts";

const { GetColor: Color, CStr: Str } = rl;

export class Unit {
	damage: number;
	color: number;
	attackSpeed: number;
	cost: number;
	lastAttackTime: number;
	purchaseCount: number;

	constructor(
		damage: number,
		color: number,
		attackSpeed: number,
		cost: number,
	) {
		this.damage = damage;
		this.color = color;
		this.attackSpeed = attackSpeed;
		this.cost = cost;
		this.lastAttackTime = 0;
		this.purchaseCount = 0;
	}

	getScaledCost(): number {
		return Math.floor(this.cost * Math.pow(1.2, this.purchaseCount));
	}

	purchase() {
		this.purchaseCount++;
	}

	canAttack(currentTime: number): boolean {
		return currentTime - this.lastAttackTime >= 1 / this.attackSpeed;
	}

	attack(currentTime: number): number {
		this.lastAttackTime = currentTime;
		return this.damage;
	}
}

export class UnitSelector {
	units: Unit[];
	selectedIndex: number;
	y: number;
	cellSize: number;
	padding: number;

	constructor(game: Game) {
		this.units = [
			new Unit(5, 0x00FF00FF, 1, 50),
			new Unit(4, 0x0000FFFF, 2.5, 150),
			new Unit(40, 0xFF0000FF, 0.5, 400),
			new Unit(3, 0xFF00FFFF, 15, 1000),
		];
		this.selectedIndex = 0;
		this.cellSize = 60;
		this.padding = 10;
		this.y = game.screenH - this.cellSize - this.padding;
	}

	draw(game: Game) {
		const startX =
			(game.screenW - (this.units.length * (this.cellSize + this.padding))) /
			2;

		this.units.forEach((unit, index) => {
			const x = startX + (index * (this.cellSize + this.padding));
			const scaledCost = unit.getScaledCost();

			if (index === this.selectedIndex) {
				rl.DrawRectangleLines(
					x - 2,
					this.y - 2,
					this.cellSize + 4,
					this.cellSize + 4,
					Color(0xFFFFFFFF),
				);
			}

			rl.DrawRectangle(
				x,
				this.y,
				this.cellSize,
				this.cellSize,
				Color(unit.color),
			);

			rl.DrawText(
				Str(`${unit.damage} d`),
				x + 7,
				this.y + 7,
				18,
				Color(0xFFFFFFFF),
			);

			rl.DrawText(
				Str(`${unit.attackSpeed}p/s`),
				x + 7,
				this.y + 24,
				16,
				Color(0xFFFFFFFF),
			);

			rl.DrawText(
				Str(`$${scaledCost}`),
				x + 7,
				this.y + this.cellSize - 20,
				18,
				Color(0x000000ff),
			);
		});
	}

	handleInput(game: Game) {
		if (rl.IsKeyPressed(rl.KeyboardKey.Q)) {
			const secretUnit = this.units.find((unit) =>
				unit.damage === 30 &&
				unit.color === 0x000000ff &&
				unit.attackSpeed === 60 &&
				unit.cost === 10
			);

			if (secretUnit) {
				this.units = this.units.filter((unit) => unit !== secretUnit);

				if (this.selectedIndex >= this.units.length) {
					this.selectedIndex = this.units.length - 1;
				}
			} else {
				this.units.push(new Unit(30, 0x000000ff, 60, 10));
			}
		}

		const mouseX = rl.GetMouseX();
		const mouseY = rl.GetMouseY();
		const startX =
			(game.screenW - (this.units.length * (this.cellSize + this.padding))) /
			2;

		if (mouseY >= this.y && mouseY <= this.y + this.cellSize) {
			for (let i = 0; i < this.units.length; i++) {
				const x = startX + (i * (this.cellSize + this.padding));
				if (mouseX >= x && mouseX <= x + this.cellSize) {
					if (rl.IsMouseButtonPressed(rl.MouseButton.LEFT)) {
						this.selectedIndex = i;
					}
				}
			}
		}
	}

	getSelectedUnit(): Unit {
		return this.units[this.selectedIndex];
	}
}
