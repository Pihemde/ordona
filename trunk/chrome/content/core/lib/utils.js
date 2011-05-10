/*
 * author : Pierre-Marie Dhaussy <domainclassifier@hinatafr.net>
 */

/**
 * It's a bunch of helpers functions about logging/services/...<br>
 */

// -- Logging part --
/*
 * I've not found a way to now if STEEL is present or not
 */
var isSteelExtension = true;
var consoleService = null;

/**
 * Write a log to console (old fashioned)
 * @param aLog a log
 */
function logWithoutSteel(aLog) {
    if (consoleService == null) {
        consoleService = getConsoleService();
    }
    consoleService.logStringMessage(aLog);
}

/**
 * Write a log to console if steel extension presents
 * @param aLog a log
 */
function logWithSteel(aLog) {
    Application.console.log(aLog);
}

/**
 * Write a log to console (check if steel extension presents)
 * @param aLog a log
 */
function log(aLog) {
    if (isSteelExtension) {
        logWithSteel(aLog);
    } else {
        logWithoutSteel(aLog);
    }
}

/**
 * Write a log to console for debugging only and only if DEBUG exists and set to true
 * @param aLog a log
 */
function debug(aLog) {
    if (DEBUG) {
        log(aLog);
    }
}

/**
 * Open console (only if steel extension is present)
 */
function openConsole() {
    if (isSteelExtension) {
        Application.console.open();
    }
}

/**
 * Clear console
 */
function resetConsole() {
    if (!isSteelExtension) {
        if (consoleService == null) {
            consoleService = getConsoleService();
        }
        consoleService.reset();
    }
}

// -- Components part --

// Factories

/**
 * Create an instance of an mutable array (nsIMutableArray)
 * @returns a mutable array
 */
function createMutableArray() {
    return Components.classes['@mozilla.org/array;1'].createInstance(Components.interfaces.nsIMutableArray);
}

// Singletons

/**
 * Return the account manager (nsIMsgAccountManager)
 * @returns the account manager
 */
function getAccountManager() {
    return Components.classes["@mozilla.org/messenger/account-manager;1"]
            .getService(Components.interfaces.nsIMsgAccountManager);
}

/**
 * Return the console service (nsIConsoleService)
 * @returns the console service
 */
function getConsoleService() {
    return Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
}

/**
 * Return the message copy service (nsIConsoleService)
 * @returns the message copy service
 */
function getMessageCopyService() {
    return Components.classes["@mozilla.org/messenger/messagecopyservice;1"].getService(Components.interfaces.nsIMsgCopyService);
}

/**
 * Return the preference service (nsIPrefService)
 * @returns the preference service
 */
function getPreferenceService() {
    return Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
}

/**
 * Return the ? (nsIPrefBranch)
 * @returns the ?
 */
function getPreferenceBranch() {
    return Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
}

// -- Misc part --

/**
 * Dump an object 1rst level hierarchy
 * @param object an object
 */
function dumpObject(object) {
    for ( var e in object) {
        log(e);
    }
}

/**
 * Create a nsIMutableArray and add the object to it
 * @param object an object to add to array
 * @returns a mutable array
 */
function createMutableArrayAndAdd(object) {
    var array = createMutableArray();
    array.appendElement(object, false);
    return array;
}

/**
 * Check id element is in list
 * @param element an object
 * @param list a list
 * @returns {Boolean} true if element is present in list, false otherwise
 */
function inList(element, list) {
    if (list == null || list.length == 0) {
        return false;
    }
    for(var e in list) {
        if (e == element) {
            return true;
        }
    }
    return false;
}

/**
 * 
 */
String.prototype.endsWith = function(str) {
    return this.match(str+"$")==str;
}

/**
 * ?
 * @returns nsIMsgCopyServiceListener
 */
function newCopyServiceListener() {
    var copyServiceListener = {
        QueryInterface : function(iid) {
            if (iid.equals(Components.interfaces.nsIMsgCopyServiceListener)
                    || iid.equals(Components.interfaces.nsISupports)) {
                return this;
            }
            throw Components.results.NS_NOINTERFACE;
            return 0;
        },
        OnProgress : function(progress, progressMax) {
        },
        OnStartCopy : function() {
        },
        OnStopCopy : function(status) {
        },
        SetMessageKey : function(key) {
            this.key = key;
        }
    }
    return copyServiceListener;
}