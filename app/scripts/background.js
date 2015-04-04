'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});

chrome.tabs.onUpdated.addListener(function (tabId, tabInfo, tab) {
    // if(tab.url.toLowerCase().indexOf('youtube.com') > -1){
    //   chrome.pageAction.show(tabId);
      if (tabInfo.status == 'complete') do_some_injecting(tab);
    // }
  });


function do_some_injecting(tab) {
    var tabUrl = tab.url;
    if (tabUrl && tabUrl.indexOf("youtube.com") != -1) {

      chrome.tabs.executeScript(null, { file: 'bower_components/jquery/dist/jquery.min.js' });
      chrome.tabs.executeScript(null, { file: 'scripts/content.js' });
      // chrome.tabs.executeScript(null, { file: 'bower_components/bootstrap/dist/js/bootstrap.min.js' });
        // changeBgkColour() here:
      // chrome.tabs.insertCSS(tab.id, {
      //     file: "bower_components/bootstrap/dist/css/bootstrap.min.css"
      // });
      chrome.tabs.insertCSS(tab.id, {
          file: "styles/main.css"
      });
    }
}

