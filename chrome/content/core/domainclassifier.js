/*
 * author : Pierre-Marie Dhaussy <domainclassifier@hinatafr.net>
 */

var mailRegExp = "[^<]*<?[^@]+@([^>\\s]+)>?";
var associationsDomainFolder = [];

/**
 * Thunderbird Domain Classifier internal structure
 * @returns {TDCStructure}
 */
function TDCStructure() {
	this.folder = null;
	this.mails = createMutableArray();
	this.nbMails = 0;
}

/**
 * TDC main procedure
 * @param inboxFolder folder where mail should be read
 * @param tdcFolder folder where domain's folders should be create
 * @param neededMessageCount needed number of message necessary for handling a domain by TDC
 * @param exclusionList list of excluded domains
 * @param mappingList list of redirect domains
 */
function classify(inboxFolder, tdcFolder, neededMessageCount, exclusionList, mappingList) {
    var tdcStructArray = [];

    /*
     * Browse mail in inboxFolder except those are in exclusion list
     */
    debug("#################### browseMails ####################");
    browseMails(tdcStructArray, inboxFolder, exclusionList);
    if (DEBUG) {
        dumpObject(tdcStructArray);
        for ( var e in tdcStructArray) {
            log(tdcStructArray[e].nbMails + " => " + e);
        }
    }

    /*
     * List all subfolders in root folder and construct tdcStruct for each
     */
    debug("#################### browseFolders ####################");
    browseFolders(tdcStructArray, tdcFolder);
    if (DEBUG) {
        dumpObject(tdcStructArray);
    }

    /*
     * Create a folder for each domain (if not already exists)
     */
    debug("#################### createFolders ####################");
    createFolders(tdcStructArray, tdcFolder, neededMessageCount);

    /*
     * Move mails in correct folders
     */
    debug("#################### moveMails ####################");
    moveMails(tdcStructArray, inboxFolder);

    debug("#################### END ####################");
}

function getDomainFromAddress(mailAddress) {
	var domain = "null";
	var resultats = mailAddress.toLowerCase().match(mailRegExp);
	if(resultats != null) {
		domain = resultats[1];
	}
	debug("The address [" + mailAddress + "] will be converted to domain [" + domain + "]");
	return domain;
}

function browseFolders(tdcStructArray, folder) {
	var subfolders = folder.subFolders;
	while(subfolders.hasMoreElements()) {
		var subfolder = subfolders.getNext();
		var name = subfolder.prettiestName;
		if (tdcStructArray[name] != null) {
			tdcStructArray[name].folder = subfolder;	
		}
	}
}

function getAssociatedFolderName(domain) {
	if (associationsDomainFolder == null || associationsDomainFolder.length == 0) {
		return domain;
	}
	for(var e in associationsDomainFolder) {
		if (e == domain) {
			return associationsDomainFolder[e];
		}
	}
	return domain;
}

function browseMails(tdcStructArray, folder, exclusionList) {
	var messages = folder.messages;
	while(messages.hasMoreElements()) {
		var message = messages.getNext();
		var messageHeader = getHeader(message);
		var domain = getDomainFromAddress(messageHeader.author);
		if(!inList(domain, exclusionList)) {
			domain = getAssociatedFolderName(domain);
			if (tdcStructArray[domain] == null) {
				tdcStructArray[domain] = new TDCStructure();
			}
			tdcStructArray[domain].mails.appendElement(message, false);
			tdcStructArray[domain].nbMails = tdcStructArray[domain].nbMails + 1;
		}
	}
}

function createFolders(tdcStructArray, folder, neededMessageCount) {
	for(var domain in tdcStructArray) {
		if (tdcStructArray[domain].folder == null && tdcStructArray[domain].nbMails >= neededMessageCount) {
			var subfolder = folder.addSubfolder(domain);
			tdcStructArray[domain].folder = subfolder;
		}
	}
}

function moveMails(tdcStructArray, folder) {
	for(var domain in tdcStructArray) {
		if (tdcStructArray[domain].folder != null && tdcStructArray[domain].mails != null && tdcStructArray[domain].nbMails > 0) {
			debug("Moving " + tdcStructArray[domain].nbMails + " mails to [" + tdcStructArray[domain].folder.prettiestName + "]");
			moveMessages(folder, tdcStructArray[domain].mails, tdcStructArray[domain].folder);
		}
	}
}