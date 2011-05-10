/*
 * Statics
 */
var preferenceService;

/*
 * Preferences
 */
var accountName;
var folderUri;
var exclusionList;
var mappingList;

/*
 * Graphic elements
 */
var accountPicker;
var folderPicker;
var exclusionListbox;
var mappingListbox;

/**
 * Initialize preferences pane
 */
function init() {
    debug("init()");
    //
    preferenceService = getPreferenceBranch();
    initGeneralTab();
    initExclusionTab();
    initMappingTab();
}

/*
 * ******************************** GENERAL ********************************
 */

/**
 * Initialize general tab
 */
function initGeneralTab() {
    debug("initGeneralTab()");
    accountPicker = document.getElementById("accountPicker");
    folderPicker = document.getElementById("folderPicker");
    accountName = preferenceService.getCharPref(PREFID_ACCOUNTNAME);
    folderUri = preferenceService.getCharPref(PREFID_FOLDERURI);

    try {
        initAccountPicker(accountName);
    } catch (e) {
        debug("Problem during init of accountPicker, the account probably doesn't exists." + e);
        debug("accountName : " + accountName);
    }

    try {
        var folder = getFolderFromURI(folderUri);
        initFolderPicker(folder);
    } catch (e) {
        debug("Problem during init of accountPicker, the folder probably doesn't exists." + e);
        debug("folderUri : " + folderUri);
        debug("folder" + folder);
    }
}

/**
 * Initialize account picker
 * @param email address
 */
function initAccountPicker(email) {
    debug("initAccountPicker()");
    accountPicker.setAttribute("label", email);
}

/**
 * Initialize folder picker
 * @param folder
 */
function initFolderPicker(folder) {
    debug("initFolderPicker()");
    try {
        folderPicker.firstChild.selectFolder(folder);
    } catch (ex) {
        folderPicker.setAttribute("label", folder.prettyName);
    }
    folderPicker.folder = folder;
}

/**
 * @param event
 */
function accountChange(event) {
    debug("accountChange()");
    var account = event.target.label;
    debug("change : " + account);
    preferenceService.setCharPref(PREFID_ACCOUNTNAME, account);
}

/**
 * @param event
 */
function folderChange(event) {
    debug("folderChange()");
    var folder = event.target._folder.folderURL;
    debug("change : " + folder);
    preferenceService.setCharPref(PREFID_FOLDERURI, folder);
}

/*
 * ******************************** EXCLUSION ********************************
 */

/**
 * 
 */
function initExclusionTab() {
    debug("initExclusionTab()");
    exclusionListbox = document.getElementById("exclusionList");
    exclusionList = preferenceService.getCharPref(PREFID_EXCLUSIONLIST);
    initExclusionListbox();
}

/**
 * 
 */
function initExclusionListbox() {
    debug("initExclusionListbox()");
    var exclusionTab = exclusionList.split(LIST_SEPARATOR);
    for ( var exclusion in exclusionTab) {
        exclusionListbox.appendItem(exclusion, exclusion);
    }
}

/**
 * 
 */
function onButtonAddExclusion() {
    debug("onButtonAddExclusion()");
    var args = {
        result : "",
        okCallback : onAddExclusionCallback
    };
    var dialog = window.openDialog(EXCLUSION_DIALOG, "", "chrome,titlebar,modal", args);
}

/**
 * @param value exclusion
 */
function onAddExclusionCallback(value) {
    debug("onAddExclusionCallback()");
    exclusionListbox.appendItem(value, value);
    // saveExclusionList();
}

/**
 * 
 */
function onButtonEditExclusion() {
    debug("onButtonEditExclusion()");
    var index = exclusionListbox.selectedIndex;
    if (index >= 0) {
        var args = {
            result : "",
            exclusionToEdit : exclusionListbox.getItemAtIndex(index),
            okCallback : onEditExclusionCallback
        };
        var dialog = window.openDialog(EXCLUSION_DIALOG, "", "chrome,titlebar,modal", args);
    }
}

/**
 * @param value exclusion
 */
function onEditExclusionCallback(value) {
    debug("onEditExclusionCallback()");
    // TODO
    // saveExclusionList();
}

/**
 * 
 */
function onButtonRemoveExclusion() {
    debug("onRemoveExclusionCallback()");

    var index = exclusionListbox.selectedIndex;
    if (index >= 0) {
        exclusionListbox.removeItemAt(index);
        var numItemsInListBox = exclusionListbox.getRowCount();
        exclusionListbox.selectedIndex = index < numItemsInListBox ? index : numItemsInListBox - 1;
    }

    // saveExclusionList();
}

/**
 * 
 */
function saveExclusionList() {
    debug("saveExclusionList()");
    var exclusionList = "";
    var count = exclusionList.getRowCount();
    for ( var i = 0; i < count; i++) {
        if (i != 0) {
            exclusionList += LIST_SEPARATOR;
        }
        exclusionList += exclusionList.getItemAtIndex(i);
    }
    preferenceService.setCharPref(PREFID_EXCLUSIONLIST, exclusionList);
    loadExclusionList();
}

/*
 * ******************************** MAPPING ********************************
 */

/**
 * 
 */
function initMappingTab() {
    debug("initMappingTab()");
    mappingListbox = document.getElementById("mappingList");
    mappingList = preferenceService.getCharPref(PREFID_MAPPINGLIST);
    initMappingListbox();
}

/**
 * 
 */
function initMappingListbox() {
    debug("initMappingListbox()");
    // TODO
}

/**
 * 
 */
function onButtonAddMapping() {
    debug("onButtonAddMapping()");
    // TODO
}

/**
 * 
 */
function onButtonEditMapping() {
    debug("onButtonEditMapping()");
    // TODO
}

/**
 * 
 */
function onButtonRemoveMapping() {
    debug("onButtonRemoveMapping()");
    // TODO
}