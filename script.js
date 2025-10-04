// Full 200-word list organized by category and difficulty
const words = {
  mammals: {
    kid: [
      "Dog","Cat","Cow","Horse","Pig","Sheep","Goat","Rabbit","Lion","Tiger",
      "Elephant","Bear","Monkey","Giraffe","Kangaroo","Panda","Zebra","Deer",
      "Fox","Wolf","Dolphin","Whale","Seal","Otter","Squirrel","Mouse","Rat",
      "Hedgehog","Bat","Raccoon"
    ],
    adult: [
      "Aardvark","Aardwolf","Alpaca","Antelope","Bison","Capybara","Chimpanzee",
      "Cheetah","Dugong","Echidna","Fennec fox","Gerenuk","Hartebeest","Hyena",
      "Impala","Jackal","Koala","Lemur","Manatee","Meerkat","Moose","Narwhal",
      "Okapi","Platypus","Porcupine","Red panda","Sloth","Tapir","Warthog",
      "Wolverine"
    ]
  },
  birds: {
    kid: [
      "Chicken","Duck","Goose","Swan","Owl","Eagle","Hawk","Parrot","Penguin",
      "Flamingo","Peacock","Crow","Sparrow","Robin","Hummingbird","Toucan",
      "Woodpecker","Seagull","Pelican","Ostrich"
    ],
    adult: [
      "Albatross","Cassowary","Cockatoo","Condor","Crane","Falcon","Heron",
      "Hornbill","Kingfisher","Kookaburra","Macaw","Nightingale","Quail",
      "Roadrunner","Shoebill"
    ]
  },
  reptiles: {
    kid: [
      "Snake","Lizard","Crocodile","Alligator","Turtle","Tortoise","Chameleon",
      "Gecko","Iguana","Komodo dragon"
    ],
    adult: [
      "Anaconda","Basilisk lizard","Boa constrictor","Gila monster",
      "Horned lizard","Monitor lizard","Rattlesnake","Sea snake","Tuatara",
      "Komodo dragon"
    ]
  },
  amphibians: {
    kid: [
      "Frog","Toad","Salamander","Newt","Axolotl"
    ],
    adult: [
      "Cane toad","Glass frog","Fire-bellied toad","Olm","Surinam toad"
    ]
  },
  fish: {
    kid: [
      "Goldfish","Salmon","Tuna","Shark","Clownfish","Trout","Seahorse",
      "Catfish","Angelfish","Swordfish"
    ],
    adult: [
      "Anglerfish","Barracuda","Betta fish","Carp","Catfish","Eel","Grouper",
      "Guppy","Lionfish","Mahi-mahi","Marlin","Moray eel","Piranha","Sturgeon",
      "Wobbegong"
    ]
  },
  insects: {
    kid: [
      "Butterfly","Bee","Ant","Ladybug","Grasshopper","Dragonfly","Mosquito",
      "Fly","Wasp","Beetle","Moth","Caterpillar","Cockroach","Cricket",
      "Firefly"
    ],
    adult: [
      "Atlas moth","Cicada","Damselfly","Goliath beetle","Hercules beetle",
      "Lanternfly","Leafcutter ant","Praying mantis","Scorpion","Tarantula",
      "Water strider","Weaver ant","Walking stick","Woodlouse","Whip scorpion"
    ]
  },
  invertebrates: {
    kid: [
      "Crab","Lobster","Shrimp","Jellyfish","Starfish","Octopus","Squid",
      "Clam","Snail","Spider"
    ],
    adult: [
      "Horseshoe crab","Lanternfish","Mantis shrimp","Nudibranch","Pangolin",
      "Sea cucumber","Sea lion","Sea otter","Walrus","Yabby"
    ]
  }
};

// Function to display words based on selected category and difficulty
function displayWords() {
  const category = document.getElementById("categoryDropdown").value;
  const difficulty = document.getElementById("difficultyDropdown").value;
  const wordList = words[category] && words[category][difficulty];

  const wordContainer = document.getElementById("wordContainer");
  wordContainer.innerHTML = ""; // Clear previous content

  if (wordList) {
    const list = document.createElement("ul");
    wordList.forEach(word => {
      const listItem = document.createElement("li");
      listItem.textContent = word;
      list.appendChild(listItem);
    });
    wordContainer.appendChild(list);
  } else {
    wordContainer.textContent = "No words available for the selected category and difficulty.";
  }
}

// Add event listener to the "Show Words" button
document.getElementById("showWordsButton").addEventListener("click", displayWords);
