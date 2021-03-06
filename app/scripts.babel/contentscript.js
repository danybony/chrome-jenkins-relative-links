'use strict';

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

// The current Jenkins Job in the form of 
// http://www.your.ci/view/All/job/jobname
function getJobUrl() { 
  var pathElements = document.URL.split('/')
  var lastElementLength = pathElements[pathElements.length - 1].length
  var i = document.URL.length - lastElementLength - 2
  while (isNumeric(document.URL[i])) {
      i--
  }
  return document.URL.substring(0, i)
}
var jobUrl = getJobUrl()

function getJobName(jobUrl) { 
  var pathElements = jobUrl.split('/')
  return pathElements[pathElements.length - 1]
}
var jobName = getJobName(jobUrl)

function replaceLink(link) {
  var oldHref = link.href
  var pathInWorkspace = oldHref.substring(oldHref.indexOf('workspace/' + jobName) + ('workspace/' + jobName).length)

  var newHref = jobUrl + '/ws' + pathInWorkspace
  link.href = newHref
  link.text = newHref
}

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

chrome.runtime.onMessage.addListener(
  function(request) {
    if (request.type === 'init' && document.getElementsByClassName('console-output')[0]) {
      arrayOf(document.getElementsByClassName('console-output')[0].getElementsByTagName('a')).filter(isLocalUrl).forEach(replaceLink)
    }
  }
);
