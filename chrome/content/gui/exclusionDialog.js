var dialog;

/**
 * Pass in keyToEdit as a window argument to turn this dialog into an edit tag dialog.
 */
function onLoad() {
    debug("onLoad()");
    var arguments = window.arguments[0];

    dialog = {};

    dialog.OKButton = document.documentElement.getButton("accept");
    dialog.nameField = document.getElementById("name");
    dialog.nameField.focus();

    // call this when OK is pressed
    dialog.okCallback = arguments.okCallback;
    if (arguments.keyToEdit) {
        initializeForEditing(arguments.keyToEdit);
    }

    doEnabling();
}

/**
 * 
 */
function doEnabling() {
    debug("doEnabling()");
    dialog.OKButton.disabled = !dialog.nameField.value;
}

/**
 * 
 */
function onOKExclusion() {
    debug("onOKExclusion()");
    dialog.okCallback(dialog.nameField.value);
}