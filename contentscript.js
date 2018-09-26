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

function getDescription(){
    var t = "meow ";
    var n = Math.floor(Math.random() * 6);
    return t.repeat(n);
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
        var selectors = [
            "img.avatar:not([alt=''])",
            ".avatar img[alt]",
            ".user-profile-mini-avatar img[alt]",
            ".Popover-message img.d-block[alt]",
            ".commits img.mr-1[alt]"
        ];
        return document.querySelectorAll(selectors.join(", "))
    }

    getUsername(node) {
        return node.getAttribute('data-original-alt');
    }

    toCat(node) {
        if ( !node.hasAttribute('data-original-src') ) {
            node.setAttribute('data-original-src', node.getAttribute('src'));
            node.setAttribute('data-original-alt', node.getAttribute('alt'));
        }
        var username = this.getUsername(node);
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
        if (!node.hasAttribute('data-original-src')) {
            return;
        }
        node.setAttribute('src', node.getAttribute('data-original-src'));
        node.setAttribute('alt', node.getAttribute('data-original-alt'));
    }
}

class ProfileImgMorpher extends ImgMorpher {
    constructor() {
        super();
    }

    selector() {
        var selectors = [
            "a[itemprop=image] img.avatar"
        ];
        return document.querySelectorAll(selectors.join(", "))
    }

    getUsername(node){
        return getMetaContents("profile:username");
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
            "a.muted-link[data-hovercard-user-id]",
            "a.user-mention",
            ".Popover-message a.f5",

            ".vcard-username",
            ".js-user-profile-following-mini-toggle strong"
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
            node.textContent = catName[0] + " " + catName[1]
        }
    }

    toHuman(node) {
        node.textContent = node.getAttribute("data-original-text");
    }
}

class DescriptionMorpher extends Morpher {
    constructor() {
        super();
    }

    selector(){
        var selectors = [
            ".user-profile-bio div"
        ];
        return document.querySelectorAll(selectors.join(", "))
    }

    toCat(node){
        var text = node.textContent
        if (!node.hasAttribute("data-original-text")){
            node.setAttribute("data-original-text", text);
        }

        node.textContent = getDescription();
    }

    toHuman(node){
        node.textContent = node.getAttribute("data-original-text");
    }
}

class HovercardDescriptionMorpher extends DescriptionMorpher {
    // The Link and Image in Hovercards is already handled by
    // ImageMorpher and LinkMorpher. This handles possible additional info
    constructor() {
        super();
    }

    selector(){
        var selectors = [
            ".Popover-message .ml-3 .mt-1 div"
        ];
        return document.querySelectorAll(selectors.join(", "))
    }

    toHuman(node){
        return;
    }
}

class HovercardLocationMorpher extends Morpher {
    // The Link and Image in Hovercards is already handled by
    // ImageMorpher and LinkMorpher. This handles possible location
    constructor() {
        super();
    }

    selector(){
        var selectors = [
            ".Popover-message .ml-3 .mt-2"
        ];
        return document.querySelectorAll(selectors.join(", "))
    }

    toCat(node){
        var text = node.textContent
        if (!node.hasAttribute("data-original-text")){
            node.setAttribute("data-original-text", text);
        }

        // preserve svg
        var svg = node.getElementsByTagName('svg')[0];

        node.textContent = " Cardboard Box";
        node.prepend(svg);
    }

    toHuman(node){
        return;
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
var d = new HovercardDescriptionMorpher();
var l = new HovercardLocationMorpher();

function update() {
    if (!morphedOnce && !showingCatNames) {
        return
    } else {
        morphedOnce = true;
    }
    i.morph(showingCatNames);
    a.morph(showingCatNames);
    d.morph(showingCatNames);
    l.morph(showingCatNames);
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
    for (var mutation of mutations) {
        for (var node of mutation.addedNodes){
            if (node.nodeType != 3 && node.tagName != "svg"){
                // one of the added nodes is not a text node
                updateWrapper();
                return;
            }
        }
    }
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
