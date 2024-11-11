import type { Game } from "./Game.ts";
import rl from "./raylib.ts";
import { Unit } from "./Unit.ts";

const { GetColor: Color } = rl;

export const GRID_SIZE = 50;
export const CENTER_BOX_SIZE = 100;

const GRID_CELLS_FROM_CENTER = 3;
export const GRID_COLS = GRID_CELLS_FROM_CENTER * 2 + 1;
export const GRID_ROWS = GRID_COLS;

export class GridCell {
	x: number;
	y: number;
	enabled: boolean;
	unit: Unit | null;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
		this.enabled = true;
		this.unit = null;
	}

	draw(isHovered: boolean, game: Game) {
		if (!this.enabled) return;

		const color = isHovered ? 0xfaca88FF : 0xaaaaaaFF;

		if (isHovered && this.unit === null) {
			const selectedUnit = game.unitSelector.getSelectedUnit();

			rl.DrawRectangle(
				this.x + 5,
				this.y + 5,
				GRID_SIZE - 10,
				GRID_SIZE - 10,
				Color(selectedUnit.color),
			);
		}

		rl.DrawRectangleLines(
			this.x,
			this.y,
			GRID_SIZE,
			GRID_SIZE,
			Color(color),
		);

		if (this.unit !== null) {
			rl.DrawRectangle(
				this.x + 5,
				this.y + 5,
				GRID_SIZE - 10,
				GRID_SIZE - 10,
				Color(this.unit.color),
			);

			const currentTime = rl.GetTime();
			const timeSinceLastAttack = currentTime - this.unit.lastAttackTime;
			const cooldownProgress = Math.min(
				timeSinceLastAttack * this.unit.attackSpeed,
				1,
			);

			const barWidth = GRID_SIZE - 10;
			const barHeight = 4;

			rl.DrawRectangle(
				this.x + 5,
				this.y + 5,
				barWidth,
				barHeight,
				rl.GetColor(0xFF0000FF),
			);

			rl.DrawRectangle(
				this.x + 5,
				this.y + 5,
				Math.floor(barWidth * cooldownProgress),
				barHeight,
				rl.GetColor(0x00FF00FF),
			);
		}
	}

	update(isHovered: boolean, game: Game): void {
		if (!this.enabled) return;

		if (isHovered) {
			if (rl.IsMouseButtonPressed(rl.MouseButton.LEFT)) {
				const selectedUnit = game.unitSelector.getSelectedUnit();
				const scaledCost = selectedUnit.getScaledCost();

				if (game.spendMoney(scaledCost)) {
					if (this.unit !== null) {
						const refundAmount = Math.floor(this.unit.getScaledCost() * 0.5);
						game.addMoney(refundAmount);
					}

					this.unit = new Unit(
						selectedUnit.damage,
						selectedUnit.color,
						selectedUnit.attackSpeed,
						selectedUnit.cost,
					);
					selectedUnit.purchase();
				}
			}
		}

		if (this.unit !== null) {
			const currentTime = rl.GetTime();
			if (this.unit.canAttack(currentTime)) {
				const damage = this.unit.attack(currentTime);
				game.playHitsound();
				if (game.box.takeDamage(damage)) {
					game.addMoney(game.box.moneyDrop);
					game.playDeathsound();
				}
			}
		}
	}
}

export class Grid {
	cells: GridCell[][];
	x: number;
	y: number;

	constructor(params: { game: Game }) {
		this.cells = [];
		const centerRow = Math.floor(GRID_ROWS / 2);
		const centerCol = Math.floor(GRID_COLS / 2);

		this.x = (params.game.screenW / 2) - ((GRID_COLS * GRID_SIZE) / 2);
		this.y = (params.game.screenH / 2) - ((GRID_ROWS * GRID_SIZE) / 2);

		for (let row = 0; row < GRID_ROWS; row++) {
			this.cells[row] = [];
			for (let col = 0; col < GRID_COLS; col++) {
				const x = this.x + (col * GRID_SIZE);
				const y = this.y + (row * GRID_SIZE);
				this.cells[row][col] = new GridCell(x, y);

				const distanceFromCenter = Math.max(
					Math.abs(row - centerRow),
					Math.abs(col - centerCol),
				);

				if (distanceFromCenter <= 1) {
					this.cells[row][col].enabled = false;
				}
			}
		}
	}

	draw(game: Game) {
		const mouseX = rl.GetMouseX() - this.x;
		const mouseY = rl.GetMouseY() - this.y;

		const beingHovered = {
			x: Math.floor(mouseX / GRID_SIZE),
			y: Math.floor(mouseY / GRID_SIZE),
		};

		for (let row = 0; row < GRID_ROWS; row++) {
			for (let col = 0; col < GRID_COLS; col++) {
				const cell = this.cells[row][col];
				const isHovered = beingHovered.x === col && beingHovered.y === row;

				cell.update(isHovered, game);
				cell.draw(isHovered, game);
			}
		}
	}
}
