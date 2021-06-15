function el(css) {
	return document.querySelector(css);
}
function con(parameter) {
	console.log(parameter);
}

function getElements(css) {
	return document.querySelectorAll(css);
};
function cont(t) {
	return console.table(t);
};
// التصريح
let array = [[], [], [], [], [], [], [], [], []]; //die array wo wir spielen 
let arrayBackUp = [[], [], [], [], [], [], [], [], []]; //die orginale array hat die werte die nicht löschbar sind 
let arrayAddedNumber = []; //arry wird die zahlen die ich villeicht einen Rückzug machen will
let selectedNumber = 0; 
let newX = -1;//neue x Koordinaten wo man hinzufügen möchte
let newY = -1; //neue y Koordinaten wo man hinzufügen möchte
let lives = 3;	// 3 versuch hat man um das Spiel zu beenden
let ziel = 0;  //counter wieviel leere stelle noch in meinem array habe ich
let gameNow = false; //game ist stop
let zeit = 0; 

const bgColor = "rgba(148, 156, 37, 0.911)"; //default style
const nivaueHard = "hard";
const nivaueMedium = "medium";
const nivaueEasy = "easy";
const urlSudoku = "https://sugoku.herokuapp.com/board?difficulty=";

el("#btnEasy").addEventListener("click", loadGame);
el("#btnMedium").addEventListener("click", loadGame);
el("#btnHard").addEventListener("click", loadGame);


el("#btnStart").addEventListener("click", startGame);
el("#btnStart").disabled = true;
el("#resetbtn").addEventListener("click", restGame);
el("#resetbtn").disabled = true;
document.addEventListener("keydown", getKey);

//////////////

// اعادة الخلايا للستايل الافتراضي setze alle zellen die default style ein
function clearStyle() {
	for (let i = 0; i < 9; i++) {
		for (j = 0; j < 9; j++) {
			el("#c" + i + j).style.backgroundColor = "khaki";
			el("#c" + i + j).style.color = "#312E2B";

		}
	}
};
// لرسم الخطول بين كل تسع من التسع التسعات border zeichnen zwischen den Boexen
function drawBorder() {

	for (let i = 0; i < 9; i++) {
		el("#c" + 2 + i).style.borderBottom = "thick solid black";
		el("#c" + 5 + i).style.borderBottom = "thick solid black";
		el("#c" + i + 2).style.borderRight = "thick solid black";
		el("#c" + i + 5).style.borderRight = "thick solid black";
	}
};
// اعداد المصفوفة بقيم بدائية صفرية initializieren von array mit zero werten	
function iniT_Array() {
	let arr = [[], [], [], [], [], [], [], [], []];
	for (let i = 0; i < 9; i++) {
		for (let j = 0; j < 9; j++) {
			arr[i][j] = 0;
		}
	}
	return arr;
};
//////////////////////////////
// اضافه الاحداث للخليه كليك و دل كليك add eventlistener für alle zellen mit klick und double klick dann zeichnen der Border
// رسم حدود داخل الشبكة كل مربع تسعه 
function iniT_cell_of_div() {
	for (let i = 0; i < 9; i++) {
		for (j = 0; j < 9; j++) {
			el("#c" + i + j).addEventListener("click",getBoxIdAndSelect);
			el("#c" + i + j).addEventListener("dblclick", clearStyle);
		}
	};
	drawBorder();
};
////////////////////////////

function getBoxIdAndSelect(){ //Get cell ID in Board
	let boxId = this.id;// "C23" 
	let cell = boxId.substr(1, 2); // => "23"
	selectBoxes(cell); //"23"
}

///////////////////////////
//res=23 .
//give style to rows colums and same value
function selectBoxes(res) {
	clearStyle();

	
	let rowOfCell = getRow(res); //zbs "23" => "2"
	let ColumOfCell = getColumn(res); //"3"

	for (let i = 0; i < 9; i++) {

		//select all the columns where the element take aplace
		el("#c" + rowOfCell + i).style.backgroundColor = bgColor;
		el("#c" + rowOfCell + i).style.color = "black";//2,0/2,1--

		//select all the rows where the element take aplace
		el("#c" + i + ColumOfCell).style.backgroundColor = bgColor;
		el("#c" + i + ColumOfCell).style.color = "black";//0.3,1,3--
	};

	// شرط استدعاء التابع لتعليم المربع اذا لم تكن فيمه الخليه صفر.
	//kondition für quadrat highlighten 3*3
	if (array[rowOfCell][ColumOfCell] > 0) {
		setStyleToSelectedBox(getBigBoxNo(parseInt(res))); //zbs:  res "32"=>32=>4
	};

    //set style to the same value 5 5 5/ 9 9 9
	setStyleToSameValues(array[rowOfCell][ColumOfCell]);

	newX = rowOfCell; //from local variable to global  //newX=3
	newY = ColumOfCell;                               //newY=2

};
// اختيار نفس الخانات ووضع نفس الستايل-
//set style to the same value in array(board)
function setStyleToSameValues(val) { //value from cell
	for (let i = 0; i < 9; i++) {
		for (let j = 0; j < 9; j++) {
			if (array[i][j] === val && array[i][j] > 0) { //array[i][j]>0 not empty 

				el("#c" + i + j).style.backgroundColor = "#312E2B";
				el("#c" + i + j).style.color = "white";
			}

		}
	}
}

function setStyleToSelectedBox(num) {  //zbs num=4

	//wo ist zerostand koordinaten von dem Box 
	let i_zero = 0;
	let j_zero = 0

	switch (num) {
		case 1: i_zero = 0; j_zero = 0;
			break;
		case 2: i_zero = 0; j_zero = 3;
			break;
		case 3: i_zero = 0; j_zero = 6;
			break;
		case 4: i_zero = 3; j_zero = 0;
			break;
		case 5: i_zero = 3; j_zero = 3;// box 4=>(3,0) first cell
			break;
		case 6: i_zero = 3; j_zero = 6;
			break;
		case 7: i_zero = 6; j_zero = 0;
			break;
		case 8: i_zero = 6; j_zero = 3;
			break;
		case 9: i_zero = 6; j_zero = 6;
			break;
	};
	let i_end = i_zero + 3; // last cell
	let j_end = j_zero + 3; // last cell in box

	//set style to the box4 zbs
	for (let i = i_zero; i < i_end; i++) {
		for (let j = j_zero; j < j_end; j++) {
			el("#c" + i + j).style.backgroundColor = bgColor;
			el("#c" + i + j).style.color = "black";
		}
	}

};

function getRow(cell) {
	return cell.substr(0, 1);
};

function getColumn(cell) {
	return cell.substr(1, 1);
};

// add eventlistener for aside bar numbers contains 1-9 number 
function iniT_SelectedNumber() { //n1,n2,n3
	for (let i = 1; i < 10; i++) {
		el("#n" + i).addEventListener("click", getNumberToadd);

	};
};

function removeEventListenerSelectedNumber() { //when the game is finish or 9 times   selected 
	for (let i = 1; i < 10; i++) {
		el("#n" + i).removeEventListener("click", getNumberToadd);
	};
};


function getNumberOfBtnID(id) {
	return parseInt(id.substr(1, 1)); //zbs "n1" =>"1"
};

function getNumberToadd(){
	let newValue = getNumberOfBtnID(this.id);
	addNumber(newValue);
	
}


//newValue-1/2/3/4/5/6/7/8/9
function addNumber(newValue) { //notitz arraybackup: the orginal array
	if ((gameNow) && (newX >= 0 && newY >= 0) && arrayBackUp[newX][newY] === 0) {
		
		let t1 = chkVadility(newX, newY, newValue);
		//في حالة عدم تحديد خليه يجب ان لا يتنفذ شيء
		// أو اذا لم تكن القيمة
		// GameNow صحيحة
		if (t1) {
			array[newX][newY] = newValue; //set new value zbs 5
			el("#c" + newX + newY).innerHTML = newValue; //zeig auf dem screen
			ziel--;  

			arrayAddedNumber.unshift("" + newX + newY); //um rueckzug we have an array  arrayAddedNumber = []; to save the value of the new added value


			if (isNumberDone(newValue)) {

				//we add the number 9 times then we remove the eventlistener
				el("#n" + newValue).removeEventListener("click", getNumberToadd);
			};

		} else {  //t1 false error in input
			lives--;
			el("#life").value = lives;
			if (lives > 0) {
				alert("Fehlernummer... \n Sie Haben noch Leben  (" + lives + ")");
			} else { //live==0
				gameNow = false;
				el("#resetbtn").disabled = false; //turn on
				el("#btnStart").value = "Sudoku Spielen";
				el("#btnStart").disabled = true; //turn off
				el("#btnEasy").disabled = false;
				el("#btnMedium").disabled = false;
				el("#btnHard").disabled = false;
				setGameOverOnBoard();
				removeEventListenerSelectedNumber();
				alert("Game Over... \n Wollen Sie nochmal Spielen ");
			};
		};


		if (ziel === 0) { //you win ther is no more zero  or empty places in your arry

			setGameOverOnBoard();
			removeEventListenerSelectedNumber();
			gameNow = false;

			el("#resetbtn").disabled = false;
			el("#btnStart").value = "Sudoku Spielen";
			el("#btnStart").disabled = true;
			el("#btnEasy").disabled = false;
			el("#btnMedium").disabled = false;
			el("#btnHard").disabled = false;

			el("#c20").innerHTML = "S";
			el("#c21").innerHTML = "e";
			el("#c22").innerHTML = "h";
			el("#c23").innerHTML = "r";

			el("#c25").innerHTML = "g";
			el("#c26").innerHTML = "u";
			el("#c27").innerHTML = "t";
		};
	};
}

function setGameOverOnBoard() {
	clearStyle();
	for (let i = 0; i < 9; i++) {
		for (let j = 0; j < 9; j++) {
			el("#c" + i + j).innerHTML = "";
		}
	}
	el("#c40").innerHTML = "G";
	el("#c41").innerHTML = "a";
	el("#c42").innerHTML = "m";
	el("#c43").innerHTML = "e";

	el("#c45").innerHTML = "O";
	el("#c46").innerHTML = "v";
	el("#c47").innerHTML = "e";
	el("#c48").innerHTML = "r";

};


function setPause() {
	clearStyle();
	for (let i = 0; i < 9; i++) {
		for (let j = 0; j < 9; j++) {
			el("#c" + i + j).innerHTML = "";
		}
	}
	el("#c40").innerHTML = "P";
	el("#c41").innerHTML = "a";
	el("#c42").innerHTML = "u";
	el("#c43").innerHTML = "s";

	el("#c44").innerHTML = "e";
	el("#c46").innerHTML = ".";
	el("#c47").innerHTML = "!";
	el("#c48").innerHTML = "!";

};

function isNumberDone(num) {  
	let count = 0; //wie mussen hier zaehlen wie viel mals wird die zahl hinzugefuegt in whole array
	array.forEach((Element) => {
		Element.forEach((val) => {
			val === num ? count++ : count;
		});
	});
	return (count === 9); //هل وصل الرقم المضاف الى 9 مرات 

};

function startTimer() {
	if (gameNow) {
		setTimeout(startTimer, 1000);
		el("#time").value = showTime(zeit); //zeit:global variable
		zeit++
	}
};

function showTime(t) {
	let result = "";
	let hrs = Math.floor(t / 3600);
	let mins = Math.floor((t % 3600) / 60);
	let secs = Math.floor(t % 60);
	if (hrs > 0) {
		result += "" + hrs + ":" + (mins < 10 ? "0" : "");
	};
	result += "" + mins + ":" + (secs < 10 ? "0" : "");
	result += "" + secs;
	return result;
}

function chkVadility(r, c, val) {
	//cellid  from selected cell on board
	let cellId = r + c;
	con(cellId)
	let t1, t2;
	t1 = chkRowandColumn(r, c, val);
	t2 = chkByBoxNo(getBigBoxNo(parseInt(cellId)), val);
	return (t1 && t2);

}

//check if you can add 
function chkRowandColumn(i_index, j_index, val) { //x,y ,val
	let yesWeCan;
	for (let i = 0; i < 9; i++) {

		if (((array[i_index][i]) === val) || ((array[i][j_index]) === val)) {//if the value exist in the same column and row
			yesWeCan = false;
			break;
		} else {
			yesWeCan = true;
		}
	}
	return yesWeCan;
}

function chkByBoxNo(no, val) { 
	let i_zero = 0;
	let j_zero = 0
	switch (no) {
		case 1: i_zero = 0; j_zero = 0;
			break;
		case 2: i_zero = 0; j_zero = 3;
			break;
		case 3: i_zero = 0; j_zero = 6;
			break;
		case 4: i_zero = 3; j_zero = 0;
			break;
		case 5: i_zero = 3; j_zero = 3;
			break;
		case 6: i_zero = 3; j_zero = 6;
			break;
		case 7: i_zero = 6; j_zero = 0;
			break;
		case 8: i_zero = 6; j_zero = 3;
			break;
		case 9: i_zero = 6; j_zero = 6;
			break;

	}
	let i_end = i_zero + 3;
	let j_end = j_zero + 3;

	for (let i = i_zero; i < i_end; i++) {
		for (let j = j_zero; j < j_end; j++) {
			if (array[i][j] === val) {
				return false;
			};
		};
	};
	return true;

}

function getBigBoxNo(index) { //index=res´23
	/*  1/9 box in Array */
	//  1   2   3 //
	//  4   5   6 //
	//  7   8   9 //
	let viertel = 0;
	switch (index) {
		case 00: case 01: case 02:
		case 10: case 11: case 12:
		case 20: case 21: case 22: viertel = 1;
			break;
		case 03: case 04: case 05:
		case 13: case 14: case 15:
		case 23: case 24: case 25: viertel = 2; //23=>return 2
			break;
		case 06: case 07: case 08:
		case 16: case 17: case 18:
		case 26: case 27: case 28: viertel = 3;
			break;
		case 30: case 31: case 32:
		case 40: case 41: case 42:
		case 50: case 51: case 52: viertel = 4;
			break;
		case 33: case 34: case 35:
		case 43: case 44: case 45:
		case 53: case 54: case 55: viertel = 5;
			break;
		case 36: case 37: case 38:
		case 46: case 47: case 48:
		case 56: case 57: case 58: viertel = 6;
			break;
		case 60: case 61: case 62:
		case 70: case 71: case 72:
		case 80: case 81: case 82: viertel = 7;
			break;
		case 63: case 64: case 65:
		case 73: case 74: case 75:
		case 83: case 84: case 85: viertel = 8;
			break;
		case 66: case 67: case 68:
		case 76: case 77: case 78:
		case 86: case 87: case 88: viertel = 9;
			break;

	};
	return viertel; //gibt die viertel an getbig boxno
}

function chkNivaue(level) { 
	let myNivaue = "";
	switch (level) {
		case "btnHard": myNivaue = nivaueHard;
			break;
		case "btnEasy": myNivaue = nivaueEasy;
			break;
		case "btnMedium": myNivaue = nivaueMedium;
			break;
	}
	return myNivaue;

};

/*const nivaueHard = "hard";
const nivaueMedium = "medium";
const nivaueEasy = "easy";
const urlSudoku = "https://sugoku.herokuapp.com/board?difficulty=";*/

async function getArrayFromURL(url) {
	ziel = 0; // counter of 1*1 empty div it is global variable
	try {
		const response = await fetch(url);
		var data = await response.json();
		//board is key in json file
		array = data.board;
		for (let i = 0; i < 9; i++) {
			for (let j = 0; j < 9; j++) {
				arrayBackUp[i][j] = array[i][j];
				array[i][j] === 0 ? ziel++ : ""; 
			}
		}
		// cont(array);
		// cont(arrayBackUp);
	} catch (e) {
		alert("Sorry , Kein Conection ..versuchen Sie Nochmal",e);
	}
};

function loadGame() {

	getArrayFromURL(urlSudoku + chkNivaue(this.id));
	el("#btnEasy").disabled = !el("#btnEasy").disabled; 
	el("#btnMedium").disabled = !el("#btnMedium").disabled;
	el("#btnHard").disabled = !el("#btnHard").disabled;
	el("#btnStart").disabled = !el("#btnStart").disabled;

}

function show_table() { //show array on screen 
	array.forEach((Element, i) => { 
		Element.forEach((cell, j) => { 
			if (cell > 0) {
				el("#c" + i + j).innerHTML = cell //array[i][j]
			} else {
				el("#c" + i + j).innerHTML = "";
			};
		});
	});

};


function startGame() { //for buttun start
	if (gameNow) { //game is off
		el("#btnStart").value = "Sudoku Spielen";
		setPause();
		gameNow = false;
	} else {
		gameNow = true; //game is on
		startTimer();
		show_table();
		el("#btnStart").value = "Stop Sudoku !!";
	};

};

function restGame() {
	arrayAddedNumber = [];
	zeit = 0;
	for (let i = 0; i < 9; i++) {
		for (let j = 0; j < 9; j++) {
			array[i][j] = arrayBackUp[i][j];
		};
	};
	iniT_SelectedNumber();
	startGame();
	el("#resetbtn").disabled = true;
	lives = 3;
	el("#life").value = lives;
};

function getKey(e) { //we deal with document and Keyboard
	if (gameNow) {
		switch (e.keyCode) {
			case 46: // delete
				if (arrayBackUp[newX][newY] === 0) {
					el("#c" + newX + newY).innerHTML = "";
					ziel++;

					if (isNumberDone(array[newX][newY])) {
						el("#n" + array[newX][newY]).addEventListener("click", getNumberToadd);
					}
					array[newX][newY] = 0;
				};
				break;
			case 32: unEditableNumberShow(); // space
				break;
			case 90: undo(); //CTRL + Z 
				break;
				//keyboard numberkey 1-9
			case 97:	
			case 49 :addNumber(1);
				break;
			case 98:	
			case 50 :addNumber(2);
				break;
			case 99 :	
			case 51 :addNumber(3);
				break;
			case 100:	
			case 52 :addNumber(4);
				break;
			case 101:
			case 53 :addNumber(5);
				break;
			case 102:	
			case 54 :addNumber(6);
				break;	
			case 103:
			case 55 :addNumber(7);
				break;
			case 104:
			case 56 :addNumber(8);
				break;
			case 105:
			case 57 :addNumber(9);
				break;
				//escape Taste set pause
				case 27 : 
					el("#btnStart").value = "Sudoku Spielen";
					setPause();
					gameNow = false;
			break;
			//arrow left-right-up-down
			case 37: 
			case 38:
			case 39:
			case 40:moveOnBoard(e.keyCode);
				break;			

		}
	}

		if ((!gameNow)&& (e.keyCode===13)){ //press Enter work with gamenow=false
			gameNow = true;
			startTimer();
			show_table();
			el("#btnStart").value = "Stop Sudoku !!";

}
}

//set style to orginal numbers which we cannot delete
function unEditableNumberShow() { 
	clearStyle();
	for (let i = 0; i < 9; i++) {
		for (let j = 0; j < 9; j++) {
			if (arrayBackUp[i][j] > 0) {
				el("#c" + i + j).style.color = "#c0392b";
			}
		}
	}
}


//to go back and undo value you added
function undo() {
	if (arrayAddedNumber.length > 0) { //array of undo (arrayAddedNumber) 

		//the last cell which we added has index 0 because unshift method
		el("#c" + arrayAddedNumber[0]).innerHTML = "";
		let cell = arrayAddedNumber.shift();
		ziel++;

		if (isNumberDone(array[getRow(cell)][getColumn(cell)])) {//[getRow(cell)]=i
			//[getColumn(cell)] =j
			el("#n" + array[getRow(cell)][getColumn(cell)]).addEventListener("click", getNumberToadd);

		array[getRow(cell)][getColumn(cell)] = 0;

	}
}}

//move between the rows and colums and style it
function moveOnBoard(code){

	if(newX < 0){
		newX = 0;
		newY=0;}

	switch(code){
		case 37 :if(newY > 0) {newY--;};
			break;
		case 38 :if(newX > 0 ) {newX--};
			break;	
		case 39 :if(newY < 8)  {newY++};
			break;
		case 40:if(newX < 8 ) {newX++};
			break;		
	}
	selectBoxes(""+newX+newY); 
}


function ini_Main() {
	iniT_SelectedNumber();
	array = iniT_Array();
	iniT_cell_of_div();
};

ini_Main();

/*
function sayGutenMorgen(){
	con("Hallo from Guten Morgen");

}

function sayGutenTag(){
	con("Hallo from Guten Tag");

}

let grossen;
con(typeof grossen);
let timenowis=14;

if (timenowis < 12 ){
	grossen =sayGutenMorgen;	
}else{
	grossen=sayGutenTag;
}


grossen();
con(typeof grossen);

if( grossen === sayGutenTag){
	con("Haaaa");
}


*/
/*

function sayGutenMorgen(){
	con("Hallo from Guten Morgen");

}

function sayGutenTag(){
	con("Hallo from Guten Tag");

}

let grossen;
//con(typeof grossen);


function welcheFunction(timenowis){
if (timenowis < 12 ){
	 return sayGutenMorgen;	
}else{
	 return sayGutenTag;
}	
}

grossen = welcheFunction(9);

grossen();
//con(typeof grossen);

if( grossen === sayGutenTag){
	con("Haaaa");
}



*/