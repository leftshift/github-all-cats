'use strict';
var showingCatNames = true;

var breeds = [
  "Abyssinian",
  "Aegean",
  "American Curl",
  "American Bobtail",
  "American Shorthair",
  "American Wirehair",
  // "Arabian Mau",
  "Australian Mist",
  "Asian",
  "Asian Semi-longhair",
  "Balinese",
  // "Bambino",
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
  // "Cheetoh",
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
  // "Korean Bobtail",
  // "Korn Ja",
  // "Kurilian Bobtail",
  // "Kuril Islands Bobtail",
  "LaPerm",
  "Lykoi",
  "Maine Coon",
  "Manx",
  "Mekong Bobtail",
  "Minskin",
  "Munchkin",
  "Nebelung",
  // "Napoleon",
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
  // "Raas",
  "Ragamuffin",
  "Ragdoll",
  "Russian Blue",
  // "Russian White",
  // "Russian Black",
  // "Russian Tabby",
  // "Sam Sawet",
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

var adjectives = ['Adaptable',
 'Adventurous',
 'Affable',
 'Affectionate',
 'Agreeable',
 'Ambitious',
 'Amiable',
 'Amicable',
 'Amusing',
 'Brave',
 'Bright',
 'Broad-minded',
 'Calm',
 'Careful',
 'Charming',
 'Communicative',
 'Compassionate ',
 'Conscientious',
 'Considerate',
 'Convivial',
 'Courageous',
 'Courteous',
 'Creative',
 'Decisive',
 'Determined',
 'Diligent',
 'Diplomatic',
 'Discreet',
 'Dynamic',
 'Easygoing',
 'Emotional',
 'Energetic',
 'Enthusiastic',
 'Exuberant',
 'Fair-minded',
 'Faithful',
 'Fearless',
 'Forceful',
 'Frank',
 'Friendly',
 'Funny',
 'Generous',
 'Gentle',
 'Good',
 'Gregarious',
 'Hard-working',
 'Helpful',
 'Honest',
 'Humorous',
 'Imaginative',
 'Impartial',
 'Independent',
 'Intellectual',
 'Intelligent',
 'Intuitive',
 'Inventive',
 'Kind',
 'Loving',
 'Loyal',
 'Modest',
 'Neat',
 'Nice',
 'Optimistic',
 'Passionate',
 'Patient',
 'Persistent ',
 'Pioneering',
 'Philosophical',
 'Placid',
 'Plucky',
 'Polite',
 'Powerful',
 'Practical',
 'Pro-active',
 'Quick-witted',
 'Quiet',
 'Rational',
 'Reliable',
 'Reserved',
 'Resourceful',
 'Romantic',
 'Self-confident',
 'Self-disciplined',
 'Sensible',
 'Sensitive',
 'Shy',
 'Sincere',
 'Sociable',
 'Straightforward',
 'Sympathetic',
 'Thoughtful',
 'Tidy',
 'Tough',
 'Unassuming',
 'Understanding',
 'Versatile',
 'Warmhearted',
 'Willing',
 'Witty'
];

var catNames = {

};

var thisUser = getMetaContents('user-login');

function getMetaContents(mn){
    var m = document.getElementsByTagName('meta');
    for(var i in m){
      if (m[i].getAttribute) { // For some reason, sometimes odd stuff is in m
        if(m[i].getAttribute("name") == mn || m[i].getAttribute("property") == mn){ // because some metas have name; content, some property; content
          return m[i].content;
        }
      }
    }
}

function generateCatName(username) {
  if (catNames[username]) return;
  var breed = breeds[Math.floor(Math.random() * breeds.length)];
  var adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  catNames[username] = [adjective, breed];
}

chrome.runtime.sendMessage({action: "get-showingCatNames"}, function(response) {
  showingCatNames = response.showingCatNames;
  updateWrapper();
});

function updateList(list, filter, getUsername, getHref, shouldAt) {
  for (var i = 0; i < list.length; i++) {
    if (filter(list[i])) {
      var username = getUsername(list[i]);
      if (username == thisUser) { // don't make the logged in user a cat
        continue;
      }
      generateCatName(username);
      var node = list[i]

      if(node.tagName.toUpperCase() === "IMG") {
        if (showingCatNames) {
          if ( !node.hasAttribute('data-original-src')) {
            node.setAttribute('data-original-src', node.getAttribute('src')) // store url for profile picture
          }
          node.setAttribute('src', chrome.extension.getURL('img/' + catNames[username][1] + ".jpg")) // replace with picure of cat
        } else {
          if (node.hasAttribute('data-original-src')) { // this is false if the picture hasn't been replaced before
            node.setAttribute('src', node.getAttribute('data-original-src')) // restore original profile picture
          }
        }
      } else {
        if (showingCatNames) {
          node.textContent = (shouldAt && catNames[username][0] === username ? '@' : '') + catNames[username].join(' ');
        } else {
          node.textContent = (shouldAt ? '@' : '') + username;
        }
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

  updateList(document.querySelectorAll('.avatar, .gravatar, .alert img, .user-profile-mini-avatar img'), function (image) {
    if (image.hasAttribute('alt')) {
      return image.getAttribute('alt');
    } else {
      return false;
    };
  }, function (image) {
    return image.getAttribute('alt').slice(1); // remove '@'
  }, function (image) {
    return null;
  });

  updateList(document.querySelectorAll('.vcard-username, .vcard-fullname, .js-user-profile-following-mini-toggle strong'), function (user) {
    return true;
  }, function (user) {
    return getMetaContents('profile:username');
  }, function (user) {
    return null;
  });

  updateList(document.querySelectorAll('.vcard-avatar img'), function (a) {
    return true;
  }, function (a) {
    return getMetaContents('profile:username');
  }, function (a) {
    return null;
  })

  if (getMetaContents('og:type') == "profile") { // Special handeling for user profiles
    obscureUserPage();
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

function updateWrapper() {
  chrome.storage.local.get('catNames', function (item) {
    catNames = item.catNames || {};
    update();
    chrome.storage.local.set({'catNames': catNames})
    setTimeout(updateWrapper, 1000);
  })
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'toggle') {
    showingCatNames = message.showingCatNames;
    updateWrapper();
  }
});
