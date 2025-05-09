
var picker = new KellyColorPicker(
    {
        input : 'color',
        place : 'color-picker', 
        size: 250,
        colorSaver : true,
        input_format: 'hex',
        methodSwitch : true,
        method : 'triangle',
        changeCursor : false, // cursor change disable, may be usefull in some cases
        // userEvents : {

        //     change : function(self) {
                
        //         if (self.updateColorButtonState) {
        //             self.updateColorButtonState();
        //         }
        //     },
        //     setmethod : function (handler, newMethod) {
        //        // on change method - triangle \ quad
        //     },
        //     selectcolorsaver : function (handler, colorSaverObj) {
        //         // on click on color saver
                
        //         picker.updateColorButtonState();
        //         // handler.getColorSaver(align) - select colorsaver where align = 'left' | 'right' | false - current slected
        //     },	
        // }
    }
);
var picker = new KellyColorPicker(
    {
        input : 'color',
        place : 'color-picker', 
        size: 250,
        colorSaver : true,
        input: 'color2',
        input_format: 'rgba',
        methodSwitch : true,
        method : 'triangle',
        changeCursor : false, // cursor change disable, may be usefull in some cases
        // userEvents : {

        //     change : function(self) {
                
        //         if (self.updateColorButtonState) {
        //             self.updateColorButtonState();
        //         }
        //     },
        //     setmethod : function (handler, newMethod) {
        //        // on change method - triangle \ quad
        //     },
        //     selectcolorsaver : function (handler, colorSaverObj) {
        //         // on click on color saver
                
        //         picker.updateColorButtonState();
        //         // handler.getColorSaver(align) - select colorsaver where align = 'left' | 'right' | false - current slected
        //     },	
        // }
    }
);

// user functions and vars

// picker.colorButtonInfoEl = document.getElementById('color-button-state');



picker.updateColorButtonState = function() {

    if (!picker.colorButtonInfoEl) return;
    
    var colorButton =  picker.getColorSaver();
    if (!colorButton) return;
    
    picker.colorButtonInfoEl.innerText = 'Side ' + colorButton.align + ' | Color : ' + colorButton.color;
};

picker.updateColorButtonState();
