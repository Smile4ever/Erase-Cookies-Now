// "abandoned cookie" by IronHide is licensed under CC BY-NC 2.0
// https://ccsearch.creativecommons.org/photos/de53a802-3342-4886-881d-59cb7f50d0eb
// https://www.flickr.com/photos/89978190@N00/3151598538

// Events
browser.browserAction.onClicked.addListener(async (tab) => {
	await deleteCookies(tab);
	await browser.tabs.reload();
	// Page was reloaded
});

// Functionality
async function deleteCookies(tab){
	let cookies = await browser.cookies.getAll({
		url: tab.url,
		storeId: tab.cookieStoreId,
		firstPartyDomain: null
	});

	let promises = cookies.map(cookie =>
		browser.cookies.remove({
			url: getCookieUrl(cookie),
			name: cookie.name,
			storeId: cookie.storeId,
			firstPartyDomain: cookie.firstPartyDomain
		})
	);

	return Promise.all(promises);
}

// Helper
function getCookieUrl(cookie) {
    var cookieProtocol = (cookie.secure) ? 'https://' : 'http://';
    return cookieProtocol + cookie.domain + cookie.path;
}
