'use strict';
var showingCatNames = true;

var catNames = {

};

var thisUser = getMetaContents('user-login');
var morphedOnce = false;

function getMetaContents(name){
    var m = document.getElementsByTagName('meta');
    for(var i in m){
      if (m[i].getAttribute) { // For some reason, sometimes odd stuff is in m
        if(m[i].getAttribute("name") == name || m[i].getAttribute("property") == name){ // because some metas have name; content, some property; content
          return m[i].content;
        }
      }
    }
}

function getCatName(username) {
  var n = catNames[username];
  if (n) {
    return n;
  }
  var breed = breeds[Math.floor(Math.random() * breeds.length)];
  var adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  catNames[username] = [adjective, breed];
  return [adjective, breed]
}

class Morpher {
    constructor() {}
    selector(){}
    morph(showingCats) {
        for (var item of this.selector()){
            if (showingCats === true) {
                this.toCat(item);
            } else {
                this.toHuman(item);
            }
        };
    }
    toCat(node) {};
    toHuman(node) {};
}

class ImgMorpher extends Morpher {
    constructor() {
        super();
    }

    selector(){
        // First selector string: select non-empty alt attribute
        // Needed because this is broken for profile pictures
        return document.querySelectorAll("img.avatar:not([alt='']), .avatar img[alt], .user-profile-mini-avatar img[alt], .Popover-message img.d-block[alt]");
    }

    toCat(node) {
        if ( !node.hasAttribute('data-original-src') ) {
            node.setAttribute('data-original-src', node.getAttribute('src'));
            node.setAttribute('data-original-alt', node.getAttribute('alt'));
        }
        var username = node.getAttribute('data-original-alt');
        if (username[0] === "@"){
            username = username.slice(1);
        }
        if (username != thisUser){
            var catName = getCatName(username);
            var resource = 'img/' + catName[1] + '.jpg';
            node.setAttribute('src', chrome.extension.getURL(resource));
            node.setAttribute('alt', '@' + catName[1]);
        }
    }

    toHuman(node) {
        node.setAttribute('src', node.getAttribute('data-original-src'));
        node.setAttribute('alt', node.getAttribute('data-original-alt'));
    }
}

class LinkMorpher extends Morpher {
    constructor() {
        super();
    }

    selector() {
        var selectors = [
            "a.text-bold[data-hovercard-user-id]",
            "a.author[data-hovercard-user-id]",
            "ai.muted-link[data-hovercard-user-id]",
            "a.user-mention",
            ".Popover-message a.f5"
        ];
        return document.querySelectorAll(selectors.join(", "))
    }

    toCat(node) {
        var text = node.textContent
        if (!node.hasAttribute("data-original-text")) {
            node.setAttribute("data-original-text", text)
        }

        var username = node.getAttribute("data-original-text").trim()

        if (username != thisUser){
            var catName = getCatName(username);
            node.textContent = catName[0] + catName[1]
        }
    }
}

function obscureUserPage() {
  var details = document.querySelectorAll('.vcard-details li');
  for (var i = 0; i < details.length; i++) {
    if (details[i].hasAttribute("aria-label")) {
      if (details[i].getAttribute("aria-label") == "Home location") {
        details[i].textContent = "Cat country";
      } else if (details[i].getAttribute("aria-label") == "Email") {
        details[i].textContent = "hello@meow.com";
      }
    }
  }
}

var i = new ImgMorpher();
var a = new LinkMorpher();

function update() {
    if (!morphedOnce && !showingCatNames) {
        return
    } else {
        morphedOnce = true;
    }
    i.morph(showingCatNames);
}

function updateWrapper() {
  chrome.storage.local.get('catNames', function (item) {
    catNames = item.catNames || {};
    update();
    chrome.storage.local.set({'catNames': catNames})
    // setTimeout(updateWrapper, 1000);
  })
}

var observer = new MutationObserver(function(mutations, observer){
    updateWrapper();
});

observer.observe(document, {
    subtree: true,
    childList: true
})

chrome.runtime.sendMessage({action: "get-showingCatNames"}, function(response) {
  showingCatNames = response.showingCatNames;
  updateWrapper();
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'toggle') {
    showingCatNames = message.showingCatNames;
    updateWrapper();
  }
});
