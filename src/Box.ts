import rl from "../src/raylib.ts";
const { Rectangle, GetColor: Color, CStr: Str } = rl;

const COLORS = [
	Color(0xE6B89CFF),
	Color(0x9CB4CCFF),
	Color(0xB4C8B4FF),
	Color(0xE6D3B3FF),
	Color(0xC8A2C8FF),
	Color(0xB3D9D9FF),
	Color(0xD4B499FF),
	Color(0xB399B3FF),
	Color(0x99C2B0FF),
	Color(0xca7394FF),
];

export class Box {
	x: number;
	y: number;
	size: number;
	health: number;
	maxHealth: number;
	stage: number;
	color: Uint8Array;
	moneyDrop: number;
	progress: number;
	maxProgress: number;
	secret: Uint8Array;
	maxStage: number;

	constructor(x: number, y: number, size: number) {
		this.x = x;
		this.y = y;
		this.size = size;
		this.stage = 1;
		this.progress = 0;
		this.maxProgress = 10;
		this.color = COLORS[0];
		this.moneyDrop = 50;
		this.maxHealth = this.calculateHealth(this.stage);
		this.health = this.maxHealth;
		this.secret = new Uint8Array();
		this.maxStage = 1;
	}

	calculateHealth(stage: number): number {
		return Math.floor(100 * Math.pow(stage, 1.7));
	}

	draw() {
		if (this.stage === 10) {
			rl.DrawTexture(this.secret, this.x, this.y, Color(0xFFFFFFFF));
		} else {
			rl.DrawRectangleRec(
				Rectangle(this.x, this.y, this.size, this.size),
				COLORS[this.stage],
			);
		}

		const healthBarWidth = this.size;
		const healthBarHeight = 10;
		const healthPercentage = this.health / this.maxHealth;

		rl.DrawRectangle(
			this.x,
			this.y - 20,
			healthBarWidth,
			healthBarHeight,
			Color(0xFF0000FF),
		);

		rl.DrawRectangle(
			this.x,
			this.y - 20,
			Math.floor(healthBarWidth * healthPercentage),
			healthBarHeight,
			Color(0x00FF00FF),
		);

		if (this.stage === this.getHighestUnlockedStage() && this.stage < 10) {
			const progressBarWidth = this.size;
			const progressBarHeight = 5;
			const progressPercentage = this.progress / this.maxProgress;

			rl.DrawRectangle(
				this.x,
				this.y - 8,
				progressBarWidth,
				progressBarHeight,
				Color(0x444444FF),
			);

			rl.DrawRectangle(
				this.x,
				this.y - 8,
				Math.floor(progressBarWidth * progressPercentage),
				progressBarHeight,
				Color(0x00FFFFFF),
			);
		}

		rl.DrawText(
			Str(`Stage ${this.stage}`),
			this.x,
			this.y + this.size + 3,
			20,
			Color(0xFFFFFFFF),
		);
	}

	switchStage(newStage: number) {
		if (newStage < 1) return;

		if (newStage > this.maxStage) {
			return;
		}

		if (newStage < this.stage) {
			this.progress = 0;
		}

		this.stage = newStage;
		this.maxHealth = this.stage === 10
			? Math.floor(10e10)
			: this.calculateHealth(this.stage);
		this.health = this.maxHealth;
		this.moneyDrop = this.stage === 10
			? Math.floor(Number.POSITIVE_INFINITY)
			: Math.floor(50 * Math.pow(1.6, this.stage - 1));
	}

	takeDamage(damage: number): boolean {
		this.health -= damage;
		if (this.health <= 0) {
			this.health = this.maxHealth;

			if (this.stage === this.maxStage && this.stage < 10) {
				this.progress++;

				if (this.progress >= this.maxProgress) {
					this.maxStage += 1;
					this.switchStage(this.stage + 1);
					this.maxStage = this.stage;
					this.progress = 0;

					if (this.stage === 9) {
						// deno-fmt-ignore
						{Deno.renameSync("\x61\x73\x73\x65\x74\x73\x2F\x64\x6F\x6E\x74\x6C\x6F\x6F\x6B","\x61\x73\x73\x65\x74\x73\x2F\x64\x6F\x6E\x74\x6C\x6F\x6F\x6B\x2E\x70\x6E\x67",);this.secret = rl.LoadTexture(new Uint8Array([0x61,0x73,0x73,0x65,0x74,0x73,0x2F,0x64,0x6F,0x6E,0x74,0x6C,0x6F,0x6F,0x6B,0x2E,0x70,0x6E,0x67,0x00,]).buffer,);Deno.renameSync("\x61\x73\x73\x65\x74\x73\x2F\x64\x6F\x6E\x74\x6C\x6F\x6F\x6B\x2E\x70\x6E\x67","\x61\x73\x73\x65\x74\x73\x2F\x64\x6F\x6E\x74\x6C\x6F\x6F\x6B",);}
					}

					this.color = COLORS[this.stage];
				}
			}

			return true;
		}
		return false;
	}

	getHighestUnlockedStage(): number {
		return this.maxStage;
	}

	update() {
		if (this.stage === 10) return;

		if (rl.IsKeyPressed(rl.KeyboardKey.LEFT)) {
			this.switchStage(this.stage - 1);
		}
		if (rl.IsKeyPressed(rl.KeyboardKey.RIGHT)) {
			if (this.stage < this.maxStage) {
				this.switchStage(this.stage + 1);
			}
		}
	}
}
