'use strict';

var showingCatNames = true;

var breeds = [
  "Abyssinian",
  "Aegean",
  "American Curl",
  "American Bobtail",
  "American Shorthair",
  "American Wirehair",
  "Arabian Mau",
  "Australian Mist",
  "Asian",
  "Asian Semi-longhair",
  "Balinese",
  "Bambino",
  "Bengal",
  "Birman",
  "Bombay",
  "Brazilian Shorthair",
  "British Semi-longhair",
  "British Shorthair",
  "British Longhair",
  "Burmese",
  "Burmilla",
  "California Spangled",
  "Chantilly-Tiffany",
  "Chartreux",
  "Chausie",
  "Cheetoh",
  "Colorpoint Shorthair",
  "Cornish Rex",
  "Cymric",
  "Manx Longhair",
  "Cyprus",
  "Devon Rex",
  "Donskoy",
  "Don Sphynx",
  "Dragon Li",
  "Dwarf cat",
  "Dwelf",
  "Egyptian Mau",
  "European Shorthair",
  "Exotic Shorthair",
  "German Rex",
  "Havana Brown",
  "Highlander",
  "Himalayan",
  "Colorpoint Persian",
  "Japanese Bobtail",
  "Javanese",
  "Kurilian Bobtail",
  "Khao Manee",
  "Korat",
  "Korean Bobtail",
  "Korn Ja",
  "Kurilian Bobtail",
  "Kuril Islands Bobtail",
  "LaPerm",
  "Lykoi",
  "Maine Coon",
  "Manx",
  "Mekong Bobtail",
  "Minskin",
  "Munchkin",
  "Nebelung",
  "Napoleon",
  "Norwegian Forest cat",
  "Ocicat",
  "Ojos Azules",
  "Oregon Rex",
  "Oriental Bicolor",
  "Oriental Shorthair",
  "Oriental Longhair",
  "Persian Cat",
  "Peterbald",
  "Pixie-bob",
  "Raas",
  "Ragamuffin",
  "Ragdoll",
  "Russian Blue",
  "Russian White",
  "Russian Black",
  "Russian Tabby",
  "Sam Sawet",
  "Savannah",
  "Scottish Fold",
  "Selkirk Rex",
  "Serengeti",
  "Serrade petit",
  "Siamese",
  "Siberian",
  "Singapura",
  "Snowshoe",
  "Sokoke",
  "Somali",
  "Sphynx",
  "Suphalak",
  "Thai",
  "Thai Lilac",
  "Tonkinese",
  "Toyger",
  "Turkish Angora",
  "Turkish Van",
  "Ukrainian Levkoy"
];

var adjectives = [
  "adaptable",
  "adventurous",
  "affable",
  "affectionate",
  "agreeable",
  "ambitious",
  "amiable",
  "amicable",
  "amusing",
  "brave",
  "bright",
  "broad-minded",
  "calm",
  "careful",
  "charming",
  "communicative",
  "compassionate ",
  "conscientious",
  "considerate",
  "convivial",
  "courageous",
  "courteous",
  "creative",
  "decisive",
  "determined",
  "diligent",
  "diplomatic",
  "discreet",
  "dynamic",
  "easygoing",
  "emotional",
  "energetic",
  "enthusiastic",
  "exuberant",
  "fair-minded",
  "faithful",
  "fearless",
  "forceful",
  "frank",
  "friendly",
  "funny",
  "generous",
  "gentle",
  "good",
  "gregarious",
  "hard-working",
  "helpful",
  "honest",
  "humorous",
  "imaginative",
  "impartial",
  "independent",
  "intellectual",
  "intelligent",
  "intuitive",
  "inventive",
  "kind",
  "loving",
  "loyal",
  "modest",
  "neat",
  "nice",
  "optimistic",
  "passionate",
  "patient",
  "persistent ",
  "pioneering",
  "philosophical",
  "placid",
  "plucky",
  "polite",
  "powerful",
  "practical",
  "pro-active",
  "quick-witted",
  "quiet",
  "rational",
  "reliable",
  "reserved",
  "resourceful",
  "romantic",
  "self-confident",
  "self-disciplined",
  "sensible",
  "sensitive",
  "shy",
  "sincere",
  "sociable",
  "straightforward",
  "sympathetic",
  "thoughtful",
  "tidy",
  "tough",
  "unassuming",
  "understanding",
  "versatile",
  "warmhearted",
  "willing",
  "witty"
];

var catNames = {

};

function getMetaContents(mn){
    var m = document.getElementsByTagName('meta');
    for(var i in m){
        if(m[i].attributes[0].nodeValue == mn){
            return m[i].content;
        }
    }
}

function generateCatName(username) {
  if (catNames[username]) return;
  var thisUser = getMetaContents('user-login');
  if (username == thisUser) { // the current user shouldn't become a cat
    catNames[username] = thisUser;
    return;
  }
  var breed = breeds[Math.floor(Math.random() * breeds.length)];
  var adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  catNames[username] = adjective + " " + breed;
  // update(); // i don't think this is needed?
}

chrome.runtime.sendMessage({action: "get-showingCatNames"}, function(response) {
  showingCatNames = response.showingCatNames;
  updateWrapper();
  setInterval(updateWrapper, 1000);
});

function updateList(list, filter, getUsername, getHref, shouldAt) {
  for (var i = 0; i < list.length; i++) {
    if (filter(list[i])) {
      var username = getUsername(list[i]);
      generateCatName(username);
      if (showingCatNames) {
        list[i].textContent = (shouldAt && catNames[username] === username ? '@' : '') + catNames[username];
      } else {
        list[i].textContent = (shouldAt ? '@' : '') + username;
      }
    }
  }
}
function update() {
  updateList(document.getElementsByClassName('author'), function (author) {
    return author.hasAttribute('href');
  }, function (author) {
    return /\/([^\/]+)$/.exec(author.getAttribute('href'))[1];
  }, function (author) {
    return author.getAttribute('href');
  });
  updateList(document.querySelectorAll("[data-ga-click*='target:actor']"), function (author) {
    return author.hasAttribute('href');
  }, function (author) {
    return /\/([^\/]+)$/.exec(author.getAttribute('href'))[1];
  }, function (author) {
    return author.getAttribute('href');
  });
  updateList(document.getElementsByClassName('user-mention'), function (mention) {
    return mention.hasAttribute('href');
  }, function (mention) {
    return /\/([^\/]+)$/.exec(mention.getAttribute('href'))[1];
  }, function (mention) {
    return mention.getAttribute('href');
  }, true);
  updateList(document.getElementsByClassName('commit-author'), function (author) {
    return true;
  }, function (author) {
    if (author.hasAttribute('data-user-name')) {
      return author.getAttribute('data-user-name');
    } else {
      var username = author.textContent;
      if (username.indexOf('author=') !== -1) {
        username = username.split('author=').pop();
      }
      author.setAttribute('data-user-name', username);
      return username;
    }
  }, function (author) {
    return '/' + author.getAttribute('data-user-name');
  });
  updateList(document.querySelectorAll('.opened-by a.tooltipped.tooltipped-s'), function (author) {
    return true;
  }, function (author) {
    if (author.hasAttribute('data-user-name')) {
      return author.getAttribute('data-user-name');
    } else {
      var username = author.textContent;
      author.setAttribute('data-user-name', username);
      return username;
    }
  }, function (author) {
    return '/' + author.getAttribute('data-user-name');
  });
  updateList(document.querySelectorAll('.author-name a[rel="author"], .author a[rel="author"]'), function (author) {
    return author.hasAttribute('href');
  }, function (author) {
    return /\/([^\/]+)$/.exec(author.getAttribute('href'))[1];
  }, function (author) {
    return author.getAttribute('href');
  });

}

function updateWrapper() {
  chrome.storage.local.get('catNames', function (item) {
    catNames = item.catNames || {};
    update();
    chrome.storage.local.set({'catNames': catNames})
  })
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'toggle') {
    showingCatNames = message.showingCatNames;
    updateWrapper();
  }
});
