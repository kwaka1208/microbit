let move = 0;
let mode = 0;

input.onButtonPressed(Button.AB, () => {
    mode = 0;
})

function LeftForward() {
    pins.digitalWritePin(DigitalPin.P8, 0);
    pins.digitalWritePin(DigitalPin.P12, 1);
}

function LeftStop() {
    pins.digitalWritePin(DigitalPin.P8, 1);
    pins.digitalWritePin(DigitalPin.P12, 1);
}

function LeftBackword() {
    pins.digitalWritePin(DigitalPin.P8, 1);
    pins.digitalWritePin(DigitalPin.P12, 0);
}

function RightForward() {
    pins.digitalWritePin(DigitalPin.P0, 0);
    pins.digitalWritePin(DigitalPin.P16, 1);
}

function RightStop() {
    pins.digitalWritePin(DigitalPin.P0, 1);
    pins.digitalWritePin(DigitalPin.P16, 1);
}

function RightBackword() {
    pins.digitalWritePin(DigitalPin.P0, 1);
    pins.digitalWritePin(DigitalPin.P16, 0);
}


input.onButtonPressed(Button.A, () => {
    mode = 1;
})
radio.onDataPacketReceived(({ receivedString: name, receivedNumber: value }) => {
    if (name == "pitch") {
        if (value < -20) {
            RightForward();
            LeftForward();
        } else {
            RightStop();
            LeftStop();
        }
    }
    if (name == "roll") {
        if (value < -20) {
            RightForward();
            LeftStop();
        } else if (value > 20) {
            RightStop();
            LeftForward();
        } else {
            RightStop();
            LeftStop();
        }
    }
})
input.onButtonPressed(Button.B, () => {
    mode = 2;
})


mode = 0
radio.setGroup(1)
basic.forever(() => {
    if (mode == 1) {
        basic.showIcon(IconNames.Chessboard)
        radio.sendValue("pitch", input.rotation(Rotation.Pitch));
        radio.sendValue("roll", input.rotation(Rotation.Roll));
    }
})
