// links to latest raylib release
const raylib_5_0_url =
	"https://github.com/raysan5/raylib/releases/download/5.0/";
const linux_amd64 = "raylib-5.0_linux_amd64.tar.gz";
// const linux_i386 = 'raylib-5.0_linux_i386.tar.gz';
const macos = "raylib-5.0_macos.tar.gz";
// const webassembly = 'raylib-5.0_webassembly.zip';
// const win32_mingw = 'raylib-5.0_win32_mingw-w64.zip';
// const win32_msvc16 = 'raylib-5.0_win32_msvc16.zip';
// const win64_mingw = 'raylib-5.0_win64_mingw-w64.zip';
const win64_msvc16 = "raylib-5.0_win64_msvc16.zip";

let currentArchive: string;
switch (Deno.build.os) {
	case "linux":
		currentArchive = linux_amd64;
		break;
	case "darwin":
		currentArchive = macos;
		break;
	case "windows":
		currentArchive = win64_msvc16;
		break;
	default:
		console.log("Unsupported platform: " + Deno.build.os);
		Deno.exit(1);
}
const raylib_folder: string = currentArchive.replace(/\.tar\.gz$/, "").replace(
	/\.zip$/,
	"",
);

async function libExists(name: string): Promise<boolean> {
	return (await Deno.stat("./" + name).catch(() => false)) ? true : false;
}

async function downloadBinary(url: string): Promise<void> {
	console.log(`Downloading ${raylib_5_0_url + url}`);
	const res = await fetch(raylib_5_0_url + url);

	const file = await Deno.open("./" + url, { create: true, write: true });
	const total = parseInt(res.headers.get("content-length") || "0");
	let downloaded = 0;

	for await (const chunk of res.body!) {
		await file.write(chunk);
		downloaded += chunk.length;
		const progress = Math.round((downloaded / total) * 100);
		console.log(`Download progress: ${progress}%`);
	}
	file.close();
}

function extractArchive(name: string): void {
	console.log(`Extracting ${name}`);
	switch (Deno.build.os) {
		case "linux":
		case "darwin":
			new Deno.Command("tar", { args: ["xzf", name] }).outputSync();
			new Deno.Command("rm", { args: [name] }).outputSync();
			break;
		case "windows":
			if (!new Deno.Command("7z", { args: ["x", name] }).outputSync().success) {
				console.error("Failed to extract " + name);
				console.error("7z not found");
				Deno.exit(1);
			}
			new Deno.Command("del", { args: [name] }).outputSync();
			break;
		default:
			console.log("Only linux, macos and windows are supported");
			Deno.exit(1);
	}
}

if (Deno.build.arch != "x86_64") {
	console.log("Only x64 systems are supported");
	Deno.exit(1);
}



// Determine library extension based on
// your OS.
let libSuffix: string;
switch (Deno.build.os) {
	case "windows":
		libSuffix = "dll";
		break;
	case "darwin":
		libSuffix = "dylib";
		break;
	default:
		libSuffix = "so";
		break;
}

const libName = `./${raylib_folder}/lib/libraylib.${libSuffix}`;
// Open library and define exported symbols

export interface Vector2 {
	x: number;
	y: number;
}
export interface Vector3 {
	x: number;
	y: number;
	z: number;
}
export interface Vector4 {
	x: number;
	y: number;
	z: number;
	w: number;
}
export type Quaternion = Vector4;
export interface Matrix {
	m0: number;
	m1: number;
	m2: number;
	m3: number;
	m4: number;
	m5: number;
	m6: number;
	m7: number;
	m8: number;
	m9: number;
	m10: number;
	m11: number;
	m12: number;
	m13: number;
	m14: number;
	m15: number;
}
export interface Color {
	r: number;
	g: number;
	b: number;
	a: number;
}
export interface Rectangle {
	x: number;
	y: number;
	width: number;
	height: number;
}
export interface Image {
	data: Uint8Array;
	width: number;
	height: number;
	mipmaps: number;
	format: number;
}
export interface Texture {
	id: number;
	width: number;
	height: number;
	mipmaps: number;
	format: number;
}
export type Texture2D = Texture;
export type TextureCubemap = Texture;
export interface RenderTexture {
	id: number;
	texture: Texture2D;
	depth: Texture2D;
}
export interface NPatchInfo {
	source: Rectangle;
	left: number;
	top: number;
	right: number;
	bottom: number;
	layout: number;
}
export interface GlyphInfo {
	value: number;
	offsetX: number;
	offsetY: number;
	advanceX: number;
	image: Image;
}
export interface Font {
	baseSize: number;
	glyphCount: number;
	glyphPadding: number;
	texture: Texture2D;
	recs: Rectangle[];
	glyphs: GlyphInfo[];
}
export interface Camera3D {
	position: Vector3;
	target: Vector3;
	up: Vector3;
	fovy: number;
	projection: number;
}
export type Camera = Camera3D;
export interface Camera2D {
	offset: Vector2;
	target: Vector2;
	rotation: number;
	zoom: number;
}
export interface Mesh {
	vertexCount: number;
	triangleCount: number;
	vertices: Float32Array;
	texcoords: Float32Array;
	texcoords2: Float32Array;
	normals: Float32Array;
	tangents: Float32Array;
	colors: Uint8Array;
	indices: Uint16Array;
	animVertices: Float32Array;
	animNormals: Float32Array;
	boneIds: Uint8Array;
	boneWeights: Float32Array;
	vaoId: number;
	vboId: number[];
}
export interface Shader {
	id: number;
	locs: number[];
}
export interface MaterialMap {
	texture: Texture2D;
	color: Color;
	value: number;
}
export interface Material {
	shader: Shader;
	maps: MaterialMap[];
	/** @type {float params[4];} */
	params: number[];
}
export interface Transform {
	translation: Vector3;
	rotation: Quaternion;
	scale: Vector3;
}
export interface BoneInfo {
	/** @type {char name[32];} */
	name: string;
	parent: number;
}
export interface Model {
	transform: Transform;

	meshCount: number;
	materialCount: number;
	meshes: Mesh[];
	materials: Material[];
	meshMaterial: number[];

	// animation data
	boneCount: number;
	bones: BoneInfo[];
	bindPose: Transform[];
}
export interface ModelAnimation {
	boneCount: number;
	frameCount: number;
	bones: BoneInfo[];
	framePoses: Transform[][];
	name: string;
}
export interface Ray {
	position: Vector3;
	direction: Vector3;
}
export interface RayCollision {
	hit: boolean;
	distance: number;
	point: Vector3;
	normal: Vector3;
}
export interface BoundingBox {
	min: Vector3;
	max: Vector3;
}
export interface Wave {
	frameCount: number;
	sampleRate: number;
	sampleSize: number;
	channels: number;
	data: Uint8Array;
}
export type rAudioBuffer = Uint8Array;
export type rAudioProcessor = Uint8Array;
export interface AudioStream {
	buffer: rAudioBuffer; // TODO: get implementation from raudio module // this is a pointer
	processor: rAudioProcessor; // TODO: get implementation from raudio module // this is a pointer
	sampleRate: number;
	sampleSize: number;
	channels: number;
}
export interface Sound {
	stream: AudioStream;
	frameCount: number;
}
export interface Music {
	stream: AudioStream;
	frameCount: number;
	looping: boolean;
	ctxType: number;
	ctxData: Uint8Array;
}
export interface VrDeviceInfo {
	hResolution: number;
	vResolution: number;
	hScreenSize: number;
	vScreenSize: number;
	eyeToScreenDistance: number;
	lensSeparationDistance: number;
	interpupillaryDistance: number;
	lensDistortionValues: [number, number, number, number];
	chromaAbCorrection: [number, number, number, number];
}
export interface VrStereoConfig {
	projection: [Matrix, Matrix];
	viewOffset: [Matrix, Matrix];
	leftLensCenter: [number, number];
	rightLensCenter: [number, number];
	leftScreenCenter: [number, number];
	rightScreenCenter: [number, number];
	scale: [number, number];
	scaleIn: [number, number];
}
export interface FilePathList {
	capacity: number;
	count: number;
	paths: string[];
}
export interface AutomationEvent {
	frame: number;
	type: number;
	params: [number, number, number, number];
}
export interface AutomationEventList {
	capacity: number;
	count: number;
	events: AutomationEvent[];
}

// Raylib struct definitions
const Vector2Type: Deno.NativeStructType = { struct: ["f32", "f32"] };
const Vector3Type: Deno.NativeStructType = { struct: ["f32", "f32", "f32"] };
const Vector4Type: Deno.NativeStructType = {
	struct: ["f32", "f32", "f32", "f32"],
};
const QuaternionType: Deno.NativeStructType = Vector4Type;
const MatrixType: Deno.NativeStructType = {
	struct: [
		"f32",
		"f32",
		"f32",
		"f32",
		"f32",
		"f32",
		"f32",
		"f32",
		"f32",
		"f32",
		"f32",
		"f32",
		"f32",
		"f32",
		"f32",
		"f32",
	],
};
const ColorType: Deno.NativeStructType = { struct: ["u8", "u8", "u8", "u8"] };
const RectangleType: Deno.NativeStructType = {
	struct: ["f32", "f32", "f32", "f32"],
};
const ImageType: Deno.NativeStructType = {
	struct: ["pointer", "i32", "i32", "i32", "i32"],
};
const TextureType: Deno.NativeStructType = {
	struct: ["u32", "i32", "i32", "i32", "i32"],
};
const Texture2DType: Deno.NativeStructType = TextureType;
const TextureCubemapType: Deno.NativeStructType = TextureType;
const RenderTextureType: Deno.NativeStructType = {
	struct: ["u32", TextureType, TextureType],
};
const NPatchInfoType: Deno.NativeStructType = {
	struct: [RectangleType, "i32", "i32", "i32", "i32", "i32"],
};
const GlyphInfoType: Deno.NativeStructType = {
	struct: ["i32", "i32", "i32", "i32", ImageType],
};
const FontType: Deno.NativeStructType = {
	struct: ["i32", "i32", "i32", "pointer", "pointer"],
}; //Rectangle*, GlyphInfo*
const Camera3DType: Deno.NativeStructType = {
	struct: [Vector3Type, Vector3Type, Vector3Type, "f32", "i32"],
};
const CameraType: Deno.NativeStructType = Camera3DType;
const Camera2DType: Deno.NativeStructType = {
	struct: [Vector2Type, Vector2Type, "f32", "f32"],
};
const MeshType: Deno.NativeStructType = {
	struct: [
		"i32", // int vertexCount;        // Number of vertices stored in arrays
		"i32", // int triangleCount;      // Number of triangles stored (indexed or not)

		"pointer", // float *vertices;        // Vertex position (XYZ - 3 components per vertex) (shader-location = 0)
		"pointer", // float *texcoords;       // Vertex texture coordinates (UV - 2 components per vertex) (shader-location = 1)
		"pointer", // float *texcoords2;      // Vertex texture second coordinates (UV - 2 components per vertex) (shader-location = 5)
		"pointer", // float *normals;         // Vertex normals (XYZ - 3 components per vertex) (shader-location = 2)
		"pointer", // float *tangents;        // Vertex tangents (XYZW - 4 components per vertex) (shader-location = 4)
		"pointer", // unsigned char *colors;      // Vertex colors (RGBA - 4 components per vertex) (shader-location = 3)
		"pointer", // unsigned short *indices;    // Vertex indices (in case vertex data comes indexed)

		"pointer", // float *animVertices;    // Animated vertex positions (after bones transformations)
		"pointer", // float *animNormals;     // Animated normals (after bones transformations)
		"pointer", // unsigned char *boneIds; // Vertex bone ids, max 255 bone ids, up to 4 bones influence by vertex (skinning) (shader-location = 6)
		"pointer", // float *boneWeights;     // Vertex bone weight, up to 4 bones influence by vertex (skinning) (shader-location = 7)
		"pointer", // Matrix *boneMatrices;   // Bones animated transformation matrices

		"i32", // int boneCount;          // Number of bones

		"u32", // unsigned int vaoId;     // OpenGL Vertex Array Object id
		"pointer", // unsigned int *vboId;    // OpenGL Vertex Buffer Objects id (default vertex data)
	],
};
const ShaderType: Deno.NativeStructType = { struct: ["u32", "pointer"] };
const MaterialMapType: Deno.NativeStructType = {
	struct: [Texture2DType, ColorType, "f32"],
};
const MaterialType: Deno.NativeStructType = {
	struct: [
		ShaderType, // Shader shader;          // Material shader
		MaterialMapType, // MaterialMap *maps;      // Material maps array (MAX_MATERIAL_MAPS)
		"buffer", // float params[4];        // Material generic parameters (if required)
	],
};
const TransformType: Deno.NativeStructType = {
	struct: [Vector3Type, QuaternionType, Vector3Type],
};
const BoneInfoType: Deno.NativeStructType = { struct: ["buffer", "i32"] }; //  char name[32]; int parent;
const ModelType: Deno.NativeStructType = {
	struct: [
		MatrixType, // Matrix transform;       // Model transformation matrix
		"i32", // int meshCount;          // Number of meshes
		"i32", // int materialCount;      // Number of materials
		"pointer", // Mesh *meshes;           // Meshes array
		"pointer", // Material *materials;    // Materials array
		"pointer", // int *meshMaterial;      // Mesh material number
		"i32", // int boneCount;          // Number of bones
		"pointer", // BoneInfo *bones;        // Bones information (skeleton)
		"pointer", // Transform *bindPose;    // Bones base transformation (pose)
	],
};
const ModelAnimationType: Deno.NativeStructType = {
	struct: [
		"i32", // int boneCount;          // Number of bones
		"i32", // int frameCount;         // Number of animation frames
		"pointer", // BoneInfo *bones;        // Bones information (skeleton)
		"pointer", // Transform **framePoses; // Poses array by frame
		"buffer", // char name[32];          // Animation name
	],
};
const RayType: Deno.NativeStructType = {
	struct: [
		Vector3Type, // Vector3 position;       // Ray position (origin)
		Vector3Type, // Vector3 direction;      // Ray direction
	],
};
const RayCollisionType: Deno.NativeStructType = {
	struct: [
		"bool", // bool hit;               // Did the ray hit something?
		"f32", // float distance;         // Distance to the nearest hit
		Vector3Type, // Vector3 point;          // Point of nearest hit
		Vector3Type, // Vector3 normal;         // Surface normal of hit
	],
};
const BoundingBoxType: Deno.NativeStructType = {
	struct: [
		Vector3Type, // Vector3 min;            // Minimum vertex box corner
		Vector3Type, // Vector3 max;            // Maximum vertex box corner
	],
};
const WaveType: Deno.NativeStructType = {
	struct: [
		"u32", // unsigned int frameCount; // Total number of frames (considering channels)
		"u32", // unsigned int sampleRate; // Frequency (samples per second)
		"u32", // unsigned int sampleSize; // Bit depth (bits per sample): 8, 16, 32 (24 not supported)
		"u32", // unsigned int channels;   // Number of channels: 1 = mono, 2 = stereo
		"pointer", // unsigned char *data;     // Buffer data
	],
};
const rAudioBufferType: Deno.NativeStructType = { struct: [] }; // TODO: get implementation from raudio module
const rAudioProcessorType: Deno.NativeStructType = { struct: [] }; // TODO: get implementation from raudio module
const AudioStreamType: Deno.NativeStructType = {
	struct: [
		"pointer", // rAudioBuffer *buffer;            // Pointer to internal data
		"pointer", // rAudioProcessor *processor;      // Pointer to internal data
		"u32", // unsigned int sampleRate;        // Frequency (samples per second)
		"u32", // unsigned int sampleSize;        // Bit depth (bits per sample): 8, 16, 32 (24 not supported)
		"u32", // unsigned int channels;          // Number of channels (1-mono, 2-stereo, ...)
	],
};
const SoundType: Deno.NativeStructType = {
	struct: [
		AudioStreamType, // AudioStream stream;              // Audio stream
		"u32", // unsigned int frameCount;        // Total number of frames (considering channels)
	],
};
const MusicType: Deno.NativeStructType = {
	struct: [
		AudioStreamType, // AudioStream stream;              // Audio stream
		"u32", // unsigned int frameCount;        // Total number of frames (considering channels)
		"bool", // bool looping;                   // Music looping enable mode
		"i32", // int ctxType;                    // Type of music context (audio filetype)
		"pointer", // void *ctxData;                  // Additional music context data
	],
};
const VrDeviceInfoType: Deno.NativeStructType = {
	struct: [
		"i32", // int hResolution;                // Horizontal resolution in pixels
		"i32", // int vResolution;                // Vertical resolution in pixels
		"f32", // float hScreenSize;              // Horizontal size in meters
		"f32", // float vScreenSize;              // Vertical size in meters
		"f32", // float eyeToScreenDistance;      // Distance between eye and display in meters
		"f32", // float lensSeparationDistance;   // Lens separation distance in meters
		"f32", // float interpupillaryDistance;   // IPD (distance between pupils) in meters
		"buffer", // float lensDistortionValues[4];  // Lens distortion constant parameters
		"buffer", // float chromaAbCorrection[4];    // Chromatic aberration correction parameters
	],
};
const VrStereoConfigType: Deno.NativeStructType = {
	struct: [
		"buffer", // Matrix projection[2];           // VR projection matrices (per eye)
		"buffer", // Matrix viewOffset[2];           // VR view offset matrices (per eye)
		"buffer", // float leftLensCenter[2];        // VR left lens center
		"buffer", // float rightLensCenter[2];       // VR right lens center
		"buffer", // float leftScreenCenter[2];      // VR left screen center
		"buffer", // float rightScreenCenter[2];     // VR right screen center
		"buffer", // float scale[2];                 // VR distortion scale
		"buffer", // float scaleIn[2];               // VR distortion scale in
	],
};
const FilePathListType: Deno.NativeStructType = {
	struct: [
		"u32", // unsigned int capacity;          // Filepaths max entries
		"u32", // unsigned int count;             // Filepaths entries count
		"pointer", // char **paths;                   // Filepaths entries
	],
};
const AutomationEventType: Deno.NativeStructType = {
	struct: [
		"u32", // unsigned int frame;             // Event frame
		"u32", // unsigned int type;              // Event type (AutomationEventType)
		"buffer", // int params[4];                  // Event parameters (if required)
	],
};
const AutomationEventListType: Deno.NativeStructType = {
	struct: [
		"u32", // unsigned int capacity;          // Events max entries (MAX_AUTOMATION_EVENTS)
		"u32", // unsigned int count;             // Events entries count
		"pointer", // AutomationEvent *events;        // Events entries
	],
};

// Add these mouse button enums near the top of the file with other type definitions
enum MouseButton {
	LEFT = 0,
	RIGHT = 1,
	MIDDLE = 2,
	SIDE = 3,
	EXTRA = 4,
	FORWARD = 5,
	BACK = 6,
}

// Add these enums near the top of the file with other type definitions
enum KeyboardKey {
	NULL = 0, // Key: NULL, used for no key pressed
	// Alphanumeric keys
	APOSTROPHE = 39, // Key: '
	COMMA = 44, // Key: ,
	MINUS = 45, // Key: -
	PERIOD = 46, // Key: .
	SLASH = 47, // Key: /
	ZERO = 48, // Key: 0
	ONE = 49, // Key: 1
	TWO = 50, // Key: 2
	THREE = 51, // Key: 3
	FOUR = 52, // Key: 4
	FIVE = 53, // Key: 5
	SIX = 54, // Key: 6
	SEVEN = 55, // Key: 7
	EIGHT = 56, // Key: 8
	NINE = 57, // Key: 9
	SEMICOLON = 59, // Key: ;
	EQUAL = 61, // Key: =
	A = 65, // Key: A | a
	B = 66, // Key: B | b
	C = 67, // Key: C | c
	D = 68, // Key: D | d
	E = 69, // Key: E | e
	F = 70, // Key: F | f
	G = 71, // Key: G | g
	H = 72, // Key: H | h
	I = 73, // Key: I | i
	J = 74, // Key: J | j
	K = 75, // Key: K | k
	L = 76, // Key: L | l
	M = 77, // Key: M | m
	N = 78, // Key: N | n
	O = 79, // Key: O | o
	P = 80, // Key: P | p
	Q = 81, // Key: Q | q
	R = 82, // Key: R | r
	S = 83, // Key: S | s
	T = 84, // Key: T | t
	U = 85, // Key: U | u
	V = 86, // Key: V | v
	W = 87, // Key: W | w
	X = 88, // Key: X | x
	Y = 89, // Key: Y | y
	Z = 90, // Key: Z | z
	LEFT_BRACKET = 91, // Key: [
	BACKSLASH = 92, // Key: '\'
	RIGHT_BRACKET = 93, // Key: ]
	GRAVE = 96, // Key: `
	// Function keys
	SPACE = 32, // Key: Space
	ESCAPE = 256, // Key: Esc
	ENTER = 257, // Key: Enter
	TAB = 258, // Key: Tab
	BACKSPACE = 259, // Key: Backspace
	INSERT = 260, // Key: Ins
	DELETE = 261, // Key: Del
	RIGHT = 262, // Key: Cursor right
	LEFT = 263, // Key: Cursor left
	DOWN = 264, // Key: Cursor down
	UP = 265, // Key: Cursor up
	PAGE_UP = 266, // Key: Page up
	PAGE_DOWN = 267, // Key: Page down
	HOME = 268, // Key: Home
	END = 269, // Key: End
	CAPS_LOCK = 280, // Key: Caps lock
	SCROLL_LOCK = 281, // Key: Scroll down
	NUM_LOCK = 282, // Key: Num lock
	PRINT_SCREEN = 283, // Key: Print screen
	PAUSE = 284, // Key: Pause
	F1 = 290, // Key: F1
	F2 = 291, // Key: F2
	F3 = 292, // Key: F3
	F4 = 293, // Key: F4
	F5 = 294, // Key: F5
	F6 = 295, // Key: F6
	F7 = 296, // Key: F7
	F8 = 297, // Key: F8
	F9 = 298, // Key: F9
	F10 = 299, // Key: F10
	F11 = 300, // Key: F11
	F12 = 301, // Key: F12
	LEFT_SHIFT = 340, // Key: Shift left
	LEFT_CONTROL = 341, // Key: Control left
	LEFT_ALT = 342, // Key: Alt left
	LEFT_SUPER = 343, // Key: Super left
	RIGHT_SHIFT = 344, // Key: Shift right
	RIGHT_CONTROL = 345, // Key: Control right
	RIGHT_ALT = 346, // Key: Alt right
	RIGHT_SUPER = 347, // Key: Super right
	KB_MENU = 348, // Key: KB menu
	// Keypad keys
	KP_0 = 320, // Key: Keypad 0
	KP_1 = 321, // Key: Keypad 1
	KP_2 = 322, // Key: Keypad 2
	KP_3 = 323, // Key: Keypad 3
	KP_4 = 324, // Key: Keypad 4
	KP_5 = 325, // Key: Keypad 5
	KP_6 = 326, // Key: Keypad 6
	KP_7 = 327, // Key: Keypad 7
	KP_8 = 328, // Key: Keypad 8
	KP_9 = 329, // Key: Keypad 9
	KP_DECIMAL = 330, // Key: Keypad .
	KP_DIVIDE = 331, // Key: Keypad /
	KP_MULTIPLY = 332, // Key: Keypad *
	KP_SUBTRACT = 333, // Key: Keypad -
	KP_ADD = 334, // Key: Keypad +
	KP_ENTER = 335, // Key: Keypad Enter
	KP_EQUAL = 336, // Key: Keypad =
}

enum MouseCursor {
	DEFAULT = 0, // Default pointer shape
	ARROW = 1, // Arrow shape
	IBEAM = 2, // Text writing cursor shape
	CROSSHAIR = 3, // Cross shape
	POINTING_HAND = 4, // Pointing hand cursor
	RESIZE_EW = 5, // Horizontal resize/move arrow shape
	RESIZE_NS = 6, // Vertical resize/move arrow shape
	RESIZE_NWSE = 7, // Top-left to bottom-right diagonal resize/move arrow shape
	RESIZE_NESW = 8, // The top-right to bottom-left diagonal resize/move arrow shape
	RESIZE_ALL = 9, // The omnidirectional resize/move cursor shape
	NOT_ALLOWED = 10, // The operation-not-allowed shape
}
console.log(libName);
const dylib = Deno.dlopen(libName, {
	InitWindow: { parameters: ["i32", "i32", "buffer"], result: "void" }, // fn (width: i32, height: i32, title: &str) void
	CloseWindow: { parameters: [], result: "void" }, // fn () void
	WindowShouldClose: { parameters: [], result: "bool" }, // fn () bool
	GetScreenWidth: { parameters: [], result: "i32" }, // fn () i32
	GetScreenHeight: { parameters: [], result: "i32" }, // fn () i32

	DrawPixel: { parameters: ["i32", "i32", ColorType], result: "void" },
	DrawPixelV: { parameters: [Vector2Type, ColorType], result: "void" },
	DrawLine: {
		parameters: ["i32", "i32", "i32", "i32", ColorType],
		result: "void",
	},
	DrawLineV: {
		parameters: [Vector2Type, Vector2Type, ColorType],
		result: "void",
	},
	DrawLineEx: {
		parameters: [Vector2Type, Vector2Type, "f32", ColorType],
		result: "void",
	},
	DrawLineStrip: {
		parameters: ["buffer", "i32", ColorType],
		result: "void",
	},
	DrawLineBezier: {
		parameters: [Vector2Type, Vector2Type, "f32", ColorType],
		result: "void",
	},
	DrawCircle: {
		parameters: ["i32", "i32", "f32", ColorType],
		result: "void",
	},
	DrawCircleSector: {
		parameters: [Vector2Type, "f32", "f32", "f32", "i32", ColorType],
		result: "void",
	},
	DrawCircleSectorLines: {
		parameters: [Vector2Type, "f32", "f32", "f32", "i32", ColorType],
		result: "void",
	},
	DrawCircleGradient: {
		parameters: ["i32", "i32", "f32", ColorType, ColorType],
		result: "void",
	},
	DrawCircleV: {
		parameters: [Vector2Type, "f32", ColorType],
		result: "void",
	},
	DrawCircleLines: {
		parameters: ["i32", "i32", "f32", ColorType],
		result: "void",
	},
	DrawCircleLinesV: {
		parameters: [Vector2Type, "f32", ColorType],
		result: "void",
	},
	DrawEllipse: {
		parameters: ["i32", "i32", "f32", "f32", ColorType],
		result: "void",
	},
	DrawEllipseLines: {
		parameters: ["i32", "i32", "f32", "f32", ColorType],
		result: "void",
	},
	DrawRing: {
		parameters: [Vector2Type, "f32", "f32", "f32", "f32", "i32", ColorType],
		result: "void",
	},
	DrawRingLines: {
		parameters: [Vector2Type, "f32", "f32", "f32", "f32", "i32", ColorType],
		result: "void",
	},
	DrawRectangle: {
		parameters: ["i32", "i32", "i32", "i32", ColorType],
		result: "void",
	},
	DrawRectangleV: {
		parameters: [Vector2Type, Vector2Type, ColorType],
		result: "void",
	},
	DrawRectangleRec: {
		parameters: [RectangleType, ColorType],
		result: "void",
	},
	DrawRectanglePro: {
		parameters: [RectangleType, Vector2Type, "f32", ColorType],
		result: "void",
	},
	DrawRectangleGradientV: {
		parameters: ["i32", "i32", "i32", "i32", ColorType, ColorType],
		result: "void",
	},
	DrawRectangleGradientH: {
		parameters: ["i32", "i32", "i32", "i32", ColorType, ColorType],
		result: "void",
	},
	DrawRectangleGradientEx: {
		parameters: [RectangleType, ColorType, ColorType, ColorType, ColorType],
		result: "void",
	},
	DrawRectangleLines: {
		parameters: ["i32", "i32", "i32", "i32", ColorType],
		result: "void",
	},
	DrawRectangleLinesEx: {
		parameters: [RectangleType, "f32", ColorType],
		result: "void",
	},
	DrawRectangleRounded: {
		parameters: [RectangleType, "f32", "i32", ColorType],
		result: "void",
	},
	DrawRectangleRoundedLines: {
		parameters: [RectangleType, "f32", "i32", "f32", ColorType],
		result: "void",
	},
	DrawTriangle: {
		parameters: [Vector2Type, Vector2Type, Vector2Type, ColorType],
		result: "void",
	},
	DrawTriangleLines: {
		parameters: [Vector2Type, Vector2Type, Vector2Type, ColorType],
		result: "void",
	},
	DrawTriangleFan: {
		parameters: ["buffer", "i32", ColorType],
		result: "void",
	}, // fn (points: &Vector2, count: i32) void
	DrawTriangleStrip: {
		parameters: ["buffer", "i32", ColorType],
		result: "void",
	},
	DrawPoly: {
		parameters: [Vector2Type, "i32", "f32", "f32", ColorType],
		result: "void",
	},
	DrawPolyLines: {
		parameters: [Vector2Type, "i32", "f32", "f32", ColorType],
		result: "void",
	},
	DrawPolyLinesEx: {
		parameters: [Vector2Type, "i32", "f32", "f32", "f32", ColorType],
		result: "void",
	},

	SetTargetFPS: { parameters: ["i32"], result: "void" }, // fn (fps: i32) void
	GetFrameTime: { parameters: [], result: "f32" }, // fn () f32
	GetTime: { parameters: [], result: "f64" }, // fn () f64
	GetFPS: { parameters: [], result: "i32" }, // fn () i32

	ClearBackground: { parameters: [ColorType], result: "void" }, // fn (color: u32) void
	BeginDrawing: { parameters: [], result: "void" }, // fn () void
	EndDrawing: { parameters: [], result: "void" }, // fn () void

	GetColor: { parameters: ["u32"], result: ColorType }, // fn (hexValue: u32) u32
	DrawText: {
		parameters: ["buffer", "i32", "i32", "i32", ColorType],
		result: "void",
	},
	GetMouseX: { parameters: [], result: "i32" }, // fn () i32
	GetMouseY: { parameters: [], result: "i32" }, // fn () i32
	IsMouseButtonPressed: { parameters: ["i32"], result: "bool" }, // Add this line
	IsKeyPressed: { parameters: ["i32"], result: "bool" },
	MeasureText: { parameters: ["buffer", "i32"], result: "i32" },
	LoadImage: { parameters: ["buffer"], result: ImageType },
	LoadTexture: { parameters: ["buffer"], result: Texture2DType },
	LoadTextureFromImage: { parameters: [ImageType], result: Texture2DType },
	DrawTexture: {
		parameters: [Texture2DType, "i32", "i32", ColorType],
		result: "void",
	},
	SetShapesTexture: {
		parameters: [Texture2DType, RectangleType],
		result: "void",
	},
	InitAudioDevice: { parameters: [], result: "void" },
	CloseAudioDevice: { parameters: [], result: "void" },
	SetMasterVolume: { parameters: ["f32"], result: "void" },
	LoadWave: { parameters: ["buffer"], result: WaveType },
	IsWaveReady: { parameters: [WaveType], result: "bool" },
	UnloadWave: { parameters: [WaveType], result: "void" },
	LoadSound: { parameters: ["buffer"], result: SoundType },
	LoadSoundAlias: { parameters: [SoundType], result: SoundType },
	IsSoundReady: { parameters: [SoundType], result: "bool" },
	LoadSoundFromWave: { parameters: [WaveType], result: SoundType },
	UnloadSound: { parameters: [SoundType], result: "void" },
	PlaySound: { parameters: [SoundType], result: "void" },
	WaitTime: { parameters: ["f64"], result: "void" },
});
const dylibSymbols = dylib.symbols;

const encoder = new TextEncoder();

export default {
	...dylibSymbols,
	CStr: (str: string) => encoder.encode(str + "\0").buffer,
	Rectangle: (x: number, y: number, w: number, h: number) => {
		return new Float32Array([x, y, w, h]).buffer;
	},
	MouseButton,
	KeyboardKey,
	MouseCursor,
};
