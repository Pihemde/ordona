/*
 * author : Pierre-Marie Dhaussy <domainclassifier@hinatafr.net>
 */

/*
 * Imports
 */
Components.utils.import("resource:///modules/MailUtils.js");

/**
 * It's a bunch of helpers functions about mail.<br>
 * This functions depends on utilities [utils.js] for log/services/...
 */

/**
 * Dump identities of all accounts. It's an utility/debug function.
 */
function dumpIdentities() {
    var sAccountManager = getAccountManager();
    var accounts = sAccountManager.accounts;
    if (accounts.Count() != 0) {
        for(var i = 0 ; i < accounts.Count() ; i++) {
            var account = accounts.QueryElementAt(i, Components.interfaces.nsIMsgAccount);
            var identity = getAccountIdentity(account);
            if (identity != null) {
                log(identity.identityName);
                log("\t" + identity.fullName);
                log("\t" + identity.email);
            } else {
                log("An identity is null !");
            }
        }
    }
}

/**
 * Dump sub-folders. It's an utility/debug function.
 * @param folder parent folder
 * @param slide slide characters
 */
function dumpSubfolders(folder, slide) {
    var subfolders = folder.subFolders;
    while(subfolders.hasMoreElements()) {
        var sub = subfolders.getNext().QueryInterface(Components.interfaces.nsIMsgFolder);
        log(sub.prettiestName);
    }
}

/**
 * Return the account associated with the identity mail address
 * @param email mail address
 * @returns account
 */
function getAccountFromMailAddress(email) {
	var sAccountManager = getAccountManager();
	var accounts = sAccountManager.accounts;
	if (accounts.Count() != 0) {
		for(var i = 0 ; i < accounts.Count() ; i++) {
			var account = accounts.QueryElementAt(i, Components.interfaces.nsIMsgAccount);
			var identity = getAccountIdentity(account);
			if (identity != null && identity.email == email ){
				return account;
			}
		}
	}
	return null;
}

/**
 * TODO rename getIdentityFromAccount<br>
 * Return identity associated with the account.
 * @param account account
 * @returns identity
 */
function getAccountIdentity(account) {
	var identities = account.identities;
	if (identities.Count() != 0) {
		return identities.QueryElementAt(0, Components.interfaces.nsIMsgIdentity);
	}
	return null;
}

/**
 * TODO rename getRootFolderFromAccount<br>
 * Return the root folder of the account
 * @param account account
 * @returns root folder
 */
function getAccountFolder(account) {
	var accountIncomingServer = account.incomingServer;
	return accountIncomingServer.rootMsgFolder;
}

/**
 * Return the folder identified by the URI
 * @param uri URI of the folder to retrieve
 * @returns folder
 */
function getFolderFromURI(uri) {
    return MailUtils.getFolderForURI(uri, false);
}

/**
 * Return the sub-folder identified by the name
 * @param folder parent folder
 * @param subfolderName sub-folder name
 * @returns folder
 */
function getSubfolderFromName(folder, subfolderName) {
    var subfolders = folder.subFolders;
    while(subfolders.hasMoreElements()) {
        var sub = subfolders.getNext().QueryInterface(Components.interfaces.nsIMsgFolder);
        if(sub.prettiestName == subfolderName) {
            return sub;
        }
    }
    return null;
}

/**
 * Return the sub-folder identified by the URI
 * @param folder parent folder
 * @param subfolderPartialURI sub-folder URI final part
 * @returns folder
 */
function getSubfolderFromURI(folder, subfolderPartialURI) {
    var subfolders = folder.subFolders;
    while(subfolders.hasMoreElements()) {
        var sub = subfolders.getNext().QueryInterface(Components.interfaces.nsIMsgFolder);
        debug("sub.folderURL : " + sub.folderURL);
        if(sub.folderURL.endsWith(subfolderPartialURI)) {
            return sub;
        }
    }
    return null;
}

/**
 * Return the header of a message
 * @param message a message
 * @returns the header of the message
 */
function getHeader(message) {
	return message.QueryInterface(Components.interfaces.nsIMsgDBHdr);
}

/**
 * Return the author of a message
 * @param message a message
 * @returns the author of the message
 */
function getAuthor(message) {
	return getHeader(message).author;
}

/**
 * Return the subject of a message
 * @param message a message
 * @returns the subject of the message
 */
function getSubject(message) {
	return getHeader(message).subject;
}

/**
 * Copy a message from sourceFolder to destinationFolder
 * @param sourceFolder source folder
 * @param message the message
 * @param destinationFolder destination folder
 */
function copyMessage(sourceFolder, message, destinationFolder) {
	copyOrMoveMessage(sourceFolder, createMutableArrayAndAdd(message), destinationFolder, false);
}

/**
 * Copy a bunch of messages from sourceFolder to destinationFolder
 * @param sourceFolder source folder
 * @param messages messages
 * @param destinationFolder destination folder
 */
function copyMessages(sourceFolder, messages, destinationFolder) {
	copyOrMoveMessage(sourceFolder, messages, destinationFolder, false);
}

/**
 * Move a message from sourceFolder to destinationFolder
 * @param sourceFolder source folder
 * @param message the message
 * @param destinationFolder destination folder
 */
function moveMessage(sourceFolder, message, destinationFolder) {
	copyOrMoveMessage(sourceFolder, createMutableArrayAndAdd(message), destinationFolder, true);
}

/**
 * Move a bunch of messages from sourceFolder to destinationFolder
 * @param sourceFolder source folder
 * @param messages messages
 * @param destinationFolder destination folder
 */
function moveMessages(sourceFolder, messages, destinationFolder) {
	copyOrMoveMessage(sourceFolder, messages, destinationFolder, true);
}

/**
 * Move or Copy a bunch of messages from sourceFolder to destinationFolder
 * @param sourceFolder source folder
 * @param messagesArray messages
 * @param destinationFolder destination folder
 * @param copyOrMove true : move, false copy
 */
function copyOrMoveMessage(sourceFolder, messagesArray, destinationFolder, copyOrMove) {
	if (DEBUG) {
		var enum = messagesArray.enumerate();
		while(enum.hasMoreElements()) {
			var message = enum.getNext();
			log("The mail from [" + getAuthor(message) + "] with subject [" + getSubject(message) + "] will be moved to [" + destinationFolder.prettiestName + "]");
		}
	}	
	var copyService = getMessageCopyService();
	copyService.CopyMessages(sourceFolder, messagesArray, destinationFolder, copyOrMove, newCopyServiceListener(), null, false);
}