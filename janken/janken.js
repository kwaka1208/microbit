let kindsOfHand = 0
let yourHand = 0
let hands: number[] = []
let myHand = 0
radio.onDataPacketReceived(({ receivedNumber }) => {
	hands[receivedNumber] = 1
	judge()
})
input.onGesture(Gesture.Shake, () => {
	reset()
})
function judge() {
	let kindsOfHand = 0
	for (let i = 1; i <= 3; i++) {
		if (hands[i] != 0) {
			kindsOfHand += 1
		}
	}
	if (kindsOfHand == 0 || myHand == 0)
		return;

	basic.pause(1000)
	hands[myHand] = 1
	kindsOfHand = 0
	for (let i = 0; i <= 3; i++) {
		if (hands[i] != 0) {
			kindsOfHand += 1
			if (i != myHand) {
				yourHand = i
			}
		}
		hands[i] = 0 // 次の回のために手をクリアしておく
	}
	if (kindsOfHand != 0) {
		if (kindsOfHand != 2) {
			basic.showIcon(IconNames.Triangle)
		} else if (myHand + 1 == yourHand) {
			basic.showIcon(IconNames.Heart)
		} else if (myHand == 3 && yourHand == 1) {
			basic.showIcon(IconNames.Heart)
		} else {
			basic.showIcon(IconNames.Skull)
		}
	}
	myHand = 0
}
function reset() {
	myHand = 0
	yourHand = 0
	hands = []
	basic.showIcon(IconNames.Yes)
}
input.onButtonPressed(Button.A, () => {
	if (myHand == 0) {
		myHand = 1
		radio.sendNumber(myHand)
		basic.showIcon(IconNames.Diamond)
		judge()
	}
})

input.onButtonPressed(Button.B, () => {
	if (myHand == 0) {
		myHand = 2
		radio.sendNumber(myHand)
		basic.showIcon(IconNames.Scissors)
		judge()
	}
})

input.onButtonPressed(Button.AB, () => {
	if (myHand == 0) {
		myHand = 3
		radio.sendNumber(myHand)
		basic.showIcon(IconNames.Square)
		judge()
	}
})
radio.setGroup(1)
reset()
