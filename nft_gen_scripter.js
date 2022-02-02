// INSTRUCTIONS
// 1. create components variants for each layer you want
// 2. Add your layers into a frame
// 3. your instances need be directly under the frame. And should not have any other layers added

// Change 'max' to limit generated
// Large numbers take a while to generate. Give some time.
// Link to tutorial 
const max = 10 // will set the max number
const colnumb = 300 // will set number of columns


//The code don't touch
let selection = figma.currentPage.selection[0]

let layers = []
let childs = selection.children

childs.forEach((item) => {
	if (
		item.type == "INSTANCE" &&
		item.mainComponent.parent.type == "COMPONENT_SET"
	) {
		layers.push(item);
	}
})


function propertyFind(node){
	let properties = node.mainComponent.parent.variantGroupProperties
	return Object.keys(properties)[0]
}

function variantsFind(node, property){
	let variants = node.mainComponent.parent.variantGroupProperties[property].values
	return variants
}

var keyVariant = layers.map((item)=>{
	let prop = propertyFind(item)
	let vari = variantsFind(item, prop)
	return [prop, vari]
})

//calc max number
var variantNumb = keyVariant.map((item)=>{
	return item[1].length
})
console.log(variantNumb.reduce((a,b)=>{
	return a*b
}))

const cartesian = (...sets) => sets.reduce((acc, set) => acc.flatMap((x) => set.map((y) => [...x, y])), [[]])

let combolist = cartesian(...keyVariant.map(item=>item[1]))

function positionSet(node, index){
	let start = index
	let row = Math.floor(start / colnumb)
	let col = start - (colnumb * row)
	node.y  = node.y + ( node.height + 50 ) + (row * node.height + row * 50)
	node.x = node.x + (node.width * col)+ (50 * col)
}

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

// reduce to specific number and randomize
combolist = shuffle(combolist)
combolist = combolist.slice(0,max)

let propList = keyVariant.map(item=>item[0])

function setVariant(node, propList, combo){
	let allchilds = node.children
	let childs = []
	allchilds.forEach((item) => {
		if (
			item.type == "INSTANCE" &&
			item.mainComponent.parent.type == "COMPONENT_SET"
		) {
			childs.push(item)
		}
	})

	childs.forEach((child, index)=>{
		let prop = propList[index]
		let variant = combo[index]
		child.setProperties({[prop]: variant})
	})
}

combolist.forEach((combo, index)=>{
	const newcomb = selection.clone()
	newcomb.name = (index+1).toString()
	setVariant(newcomb, propList, combo)
	positionSet(newcomb, index)
}
