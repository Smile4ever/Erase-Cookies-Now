// "abandoned cookie" by IronHide is licensed under CC BY-NC 2.0
// https://ccsearch.creativecommons.org/photos/de53a802-3342-4886-881d-59cb7f50d0eb
// https://www.flickr.com/photos/89978190@N00/3151598538

// Init
let browserName = "NonFirefox"; // Default value

// browser.runtime.getBrowserInfo() is not available
// https://github.com/mozilla/webextension-polyfill/issues/116

async function init(){
	// Get the browserName (likely will only work in case it's Firefox)
	if(browser.runtime.getBrowserInfo !== undefined){
		let info = await browser.runtime.getBrowserInfo();
		browserName = info.name;
	}
	
	// Events
	browser.action.onClicked.addListener(async (tab) => {
		await deleteCookies(tab);
		await browser.tabs.reload();
		// Page was reloaded
	});
}

init();

// Functionality
async function deleteCookies(tab){	
	let cookies = await browser.cookies.getAll(
		getCookieQueryAll(tab)
	);

	let promises = cookies.map(cookie =>
		browser.cookies.remove(getCookieRemoveQuery(cookie))
	);

	return Promise.all(promises);
}

// Helper functions
function getCookieQueryAll(tab){
	let cookieQueryAll = {
		url: tab.url,
		storeId: tab.cookieStoreId
	};
	
	if(browserName === "Firefox"){
		cookieQueryAll.firstPartyDomain = null;
	}
		
	return cookieQueryAll;
}

function getCookieRemoveQuery(cookie){
	let cookieRemoveQuery = {
		url: getCookieUrl(cookie),
		name: cookie.name,
		storeId: cookie.storeId
	};

	if(browserName === "Firefox"){
		cookieRemoveQuery.firstPartyDomain = cookie.firstPartyDomain;
	}

	return cookieRemoveQuery;
}

function getCookieUrl(cookie) {
    let cookieProtocol = (cookie.secure) ? 'https://' : 'http://';
    return cookieProtocol + cookie.domain + cookie.path;
}
