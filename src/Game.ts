import { Box } from "./Box.ts";
import { Grid } from "./Grid.ts";
import rl from "./raylib.ts";
import { UnitSelector } from "./Unit.ts";

const { GetColor: Color, CStr: Str } = rl;

export class Game {
	screenW: number;
	screenH: number;
	money: number;
	unitSelector: UnitSelector;
	box: Box;
	grid: Grid;
	showFAQ: boolean;
	isHoveringFAQ: boolean;
	hitsounds: Array<Uint8Array>;
	hitsound_id: number;
	deathsounds: Array<Uint8Array>;
	deathsound_id: number;
	soundsPlayed: number;
	prevSoundsPlayed: number;

	constructor() {
		this.screenW = 800;
		this.screenH = 600;
		this.money = 100;
		this.unitSelector = new UnitSelector(this);
		this.box = new Box(
			this.screenW / 2 - 100 / 2,
			this.screenH / 2 - 100 / 2,
			100,
		);
		this.grid = new Grid({ game: this });
		this.showFAQ = false;
		this.isHoveringFAQ = false;

		this.hitsounds = [];
		this.hitsound_id = 0;
		this.deathsounds = [];
		this.deathsound_id = 0;
		this.soundsPlayed = 0;
		this.prevSoundsPlayed = 0;
	}

	update() {
		this.unitSelector.handleInput(this);
		this.updateFAQ();
		this.box.update();
	}

	updateFAQ() {
		const mouseX = rl.GetMouseX();
		const mouseY = rl.GetMouseY();
		const questionX = this.screenW - 40;
		const questionY = 10;

		this.isHoveringFAQ = mouseX >= questionX &&
			mouseX <= questionX + 30 &&
			mouseY >= questionY &&
			mouseY <= questionY + 30;

		if (this.isHoveringFAQ && rl.IsMouseButtonPressed(rl.MouseButton.LEFT)) {
			this.showFAQ = !this.showFAQ;
		}

		if (
			this.showFAQ && !this.isHoveringFAQ &&
			rl.IsMouseButtonPressed(rl.MouseButton.LEFT)
		) {
			this.showFAQ = false;
		}
	}

	draw() {
		rl.DrawText(
			Str(`Money: $${this.money}`),
			10,
			10,
			24,
			Color(0xFFD700FF),
		);

		const questionColor = this.isHoveringFAQ ? 0xFFFFFFFF : 0xAAAAAAFF;
		rl.DrawText(
			Str("?"),
			this.screenW - 40,
			10,
			30,
			Color(questionColor),
		);

		if (this.showFAQ) {
			this.drawFAQPopup();
		}

		this.unitSelector.draw(this);
	}

	drawFAQPopup() {
		const popupWidth = 400;
		const popupHeight = 300;
		const popupX = (this.screenW - popupWidth) / 2;
		const popupY = (this.screenH - popupHeight) / 2;
		const padding = 20;
		const lineHeight = 24;

		rl.DrawRectangle(
			0,
			0,
			this.screenW,
			this.screenH,
			Color(0x00000088),
		);

		rl.DrawRectangle(
			popupX,
			popupY,
			popupWidth,
			popupHeight,
			Color(0x1A1A1AFF),
		);

		rl.DrawRectangleLines(
			popupX,
			popupY,
			popupWidth,
			popupHeight,
			Color(0xFFFFFFFF),
		);

		rl.DrawText(
			Str("How to Play"),
			popupX + padding,
			popupY + padding,
			24,
			Color(0xFFFFFFFF),
		);

		const bulletPoints = [
			"- Build units to attack the box!",
			"- Press left/right keys",
			"  to switch stages!",
			"- Replace units by other units!",
			"- Have fun!",
			"",
			"",
			"",
			"",
			'- cheat button is "Q"',
		];

		bulletPoints.forEach((point, index) => {
			rl.DrawText(
				Str(point),
				popupX + padding,
				popupY + padding + 40 + (index * lineHeight),
				20,
				Color(0xFFFFFFFF),
			);
		});
	}

	addMoney(amount: number) {
		this.money += amount;
	}

	spendMoney(amount: number): boolean {
		if (this.money >= amount) {
			this.money -= amount;
			return true;
		}
		return false;
	}

	playHitsound() {
		this.soundsPlayed += 1;
		rl.PlaySound(this.hitsounds[this.hitsound_id]);
		this.hitsound_id = (this.hitsound_id + 1) % this.hitsounds.length;
	}

	playDeathsound() {
		this.soundsPlayed += 1;
		rl.PlaySound(this.deathsounds[this.deathsound_id]);
		this.deathsound_id = (this.deathsound_id + 1) % this.deathsounds.length;
	}

	resetSoundCounters() {
		rl.SetMasterVolume(
			Math.min(0.75, 2 / (this.prevSoundsPlayed + this.soundsPlayed)),
		);
		this.prevSoundsPlayed = this.soundsPlayed;
		this.soundsPlayed = 0;
	}

	run() {
		rl.InitWindow(this.screenW, this.screenH, Str("Tower Defense"));
		rl.SetTargetFPS(60);

		rl.InitAudioDevice();

		this.hitsounds.push(rl.LoadSound(Str("assets/hit.wav")));
		this.hitsounds.push(
			...Array(2).fill(new Uint8Array()).map(() =>
				rl.LoadSoundAlias(this.hitsounds[0])
			),
		);
		this.deathsounds.push(rl.LoadSound(Str("assets/death.wav")));
		this.deathsounds.push(rl.LoadSoundAlias(this.deathsounds[0]));

		while (!rl.WindowShouldClose()) {
			this.resetSoundCounters();
			rl.BeginDrawing();
			rl.ClearBackground(Color(0x123456ff));

			this.update();
			this.grid.draw(this);
			this.box.draw();
			this.draw();

			rl.EndDrawing();
		}
		rl.UnloadSound(this.hitsounds[0]);
		rl.UnloadSound(this.deathsounds[0]);

		rl.CloseAudioDevice();

		rl.CloseWindow();
	}
}
