'use strict';

function isLocalUrl(url) {
    return url.getAttribute('href') && url.getAttribute('href').startsWith('file://')
}

function arrayOf(nodelist) {
  var result = [];
  for (var i = 0; i < nodelist.length; ++i) {
    result.push(nodelist.item(i))
  }

  return result;
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

// The current Jenkins Job in the form of 
// http://www.your.ci/view/All/job/jobname
function getJobUrl() { 
    var i = document.URL.length - '/console'.length -1
    while (isNumeric(document.URL[i])) {
        i--
    }
    return document.URL.substring(0, i)
}

function getJobName(jobUrl) { 
    var pathElements = jobUrl.split('/')
    return pathElements[pathElements.length - 1]
}

function replaceLink(link) {
    var jobUrl = getJobUrl()
    var jobName = getJobName(jobUrl)
    var oldHref = link.href
    var pathInWorkspace = oldHref.substring(oldHref.indexOf('workspace/' + jobName) + ('workspace/' + jobName).length)

    var newHref = getJobUrl() + '/ws' + pathInWorkspace
    link.href = newHref
    link.text = newHref
}

var init = function() {
  prToolbarHeight = getPrToolbarHeight();
  if (fileContainers.length !== 0) {
    resetAllHeaders();
    setFileContainersPadding();
    addCollapseExpandButtons();
    addCollapseExpandAllButtons();
    document.onscroll = makeCurrentHeaderSticky;
  } else {
    // remove onscroll listener if no file is present in the current page
    document.onscroll = null;
  }
};

chrome.runtime.onMessage.addListener(
  function(request) {
    if (request.type === 'init' && document.getElementsByClassName('console-output')[0]) {
      arrayOf(document.getElementsByClassName('console-output')[0].getElementsByTagName('a')).filter(isLocalUrl).forEach(replaceLink)
    }
  }
);
