/*
 * author : Pierre-Marie Dhaussy <domainclassifier@hinatafr.net>
 */

/**
 * TODO LIST :
 * <ul>
 * <li>maybe TDC can be rewrite with use more object style</li>
 * <li>maybe TDC can stop moving mails, and maintain a list of redirection rules</li>
 * <li>include js from js http://ljouanneau.com/blog/2005/03/18/408-inclure-du-js-dans-un-js</li>
 * </ul>
 */

/*
 * Statics
 */
var preferenceService;

/**
 * Convert a list to a js array
 * @param list a list
 * @param separator element separator
 * @returns an array
 */
function listToArray(list, separator) {
    debug("listToArray");
    var list = [];
    // TODO
    return list;
}

/**
 * Convert a list to a associated array
 * @param list a list
 * @param listSeparator list elements separator
 * @param mappingSeparator mapping elements separator
 * @returns an array
 */
function listToMap(list, listSeparator, mappingSeparator) {
    debug("listToMap");
    var map = [];
    // TODO
    return map;
}

/**
 * Main procedure
 */
function main() {
    debug("main");

    // initialize preferences service
    preferenceService = getPreferenceBranch();

    // retrieve inbox folder
    var accountName = preferenceService.getCharPref(PREFID_ACCOUNTNAME);
    debug("accountName : " + accountName);
    var account = getAccountFromMailAddress(accountName);
    debug("account : " + account);
    var rootFolder = getAccountFolder(account);
    debug("rootFolder : " + rootFolder);

    dumpSubfolders(rootFolder);
    // debug("rootFolder.folderURL : " + rootFolder.folderURL);
    // var inboxFolder = getFolderFromURI(rootFolder.folderURL + "/INBOX");
    var inboxFolder = getSubfolderFromURI(rootFolder, "INBOX");
    debug("inboxFolder : " + inboxFolder);
    debug("inboxFolder.folderURL : " + inboxFolder.folderURL);

    // retrieve folder for TDC
    var folderUri = preferenceService.getCharPref(PREFID_FOLDERURI);
    debug("folderUri : " + folderUri);
    var tdcFolder = getFolderFromURI(folderUri);
    debug("tdcFolder : " + tdcFolder);
    debug("tdcFolder.folderURL : " + tdcFolder.folderURL);

    // TODO to be completed
    var neededMessageCount = preferenceService.getIntPref(PREFID_MESSAGECOUNT);
    debug("neededMessageCount : " + neededMessageCount);

    // TODO to be completed
    var exclusion = listToArray(preferenceService.getCharPref(PREFID_EXCLUSIONLIST), LIST_SEPARATOR);
    debug("exclusion : " + exclusion);

    // TODO to be completed
    var mapping = listToMap(preferenceService.getCharPref(PREFID_MAPPINGLIST), LIST_SEPARATOR, MAPPING_SEPARATOR);
    debug("mapping : " + mapping);

    // GO !
    classify(inboxFolder, tdcFolder, neededMessageCount, exclusion, mapping);
}
