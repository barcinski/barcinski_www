
let pallete = [
	["Brown 1" , 0x87693b , "0"],
	["Brown 2" , 0xaf8c3e , "1"],
	["Yellow 1" , 0xfffec1 , "2"],
	["Yellow 2" , 0xdbb724 , "3"],
	["Brown 3" , 0xcfb998 , "4"],
	["Salmon" , 0xfde6bd , "5"],
	["Yellow 3" , 0xfacd4b , "6"],
	
	["Red 1" , 0xe14d45 , "7"],
	["Red 2" , 0x7a0704 , "8"],
	["Red 3" , 0x640000 , "9"],
	["Red 4" , 0xc40101 , "a"],
	["Pink 1" , 0xf07e91 , "b"],

	["Blue 1" , 0x028e96 , "c"],
	["Blue 2" , 0x24b8c5 , "d"],
	["Green" , 0x405c08 , "e"],
	["Pink 2" , 0xf5aa9f , "f"]
]

let generatedPallete;
function makeRandomPalette(){

	let maxColors = Math.floor(Math.random() * 13) + 2;
	maxColors = Math.min(maxColors , pallete.length);
	
	let p = []
	for(let i = 0 ; i < maxColors; i++){
		let l = pallete.length;
		let i = Math.floor(Math.random()*l);	
		p.push(pallete.splice(i,1)[0])
	}

	generatedPallete = p;
}
makeRandomPalette();

function getRandomColor(){
	let l = generatedPallete.length;
	let i = Math.floor(Math.random()*l);
	return generatedPallete[i][1];
}

export {  getRandomColor    };