import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartSimple } from "@fortawesome/free-solid-svg-icons";

export default function Sets() {
  const [starterSets, setStarterSets] = useState<
    {
      setName: string;
      utensilSet: { title: string }[];
    }[]
  >([]);

  useEffect(() => {
    setStarterSets(
      shuffle([
        {
          setName: "Ice cream flavors",
          utensilSet: shuffle([
            { title: "Vanilla" },
            { title: "Chocolate" },
            { title: "Strawberry" },
            { title: "Mint chocolate chip" },
            { title: "Cookies and cream" },
            { title: "Rocky road" },
            { title: "Butter pecan" },
            { title: "Pistachio" },
            { title: "Cookie dough" },
            { title: "Birthday cake" },
            { title: "Coffee" },
            { title: "Cotton candy" },
            { title: "Dulce de leche" },
            { title: "Bubblegum" },
            { title: "Neapolitan" },
          ]),
        },
        {
          setName: "Highest-grossing films",
          utensilSet: shuffle([
            { title: "Gone with the Wind" },
            { title: "Avatar" },
            { title: "Titanic" },
            { title: "Star Wars: A New Hope" },
            { title: "Avengers: Endgame" },
            { title: "The Sound of Music" },
            { title: "E.T." },
            { title: "The Ten Commandments" },
            { title: "Doctor Zhivago" },
            { title: "Star Wars: The Force Awakens" },
          ]),
        },
        {
          setName: "Popular versions of Monopoly",
          utensilSet: shuffle([
            { title: "Classic Monopoly" },
            { title: "Monopoly Junior" },
            { title: "Monopoly Mega Edition" },
            { title: "Monopoly Electronic Banking" },
            { title: "Monopoly Deal (Card Game)" },
            { title: "Monopoly Cheaters Edition" },
            { title: "Monopoly Here & Now" },
            { title: "Monopoly Speed" },
            { title: "Monopoly Empire" },
            { title: "Monopoly Millionaire" },
          ]),
        },
        {
          setName: "Common dog breeds",
          utensilSet: shuffle([
            { title: "Labrador Retriever" },
            { title: "German Shepherd" },
            { title: "Golden Retriever" },
            { title: "Bulldog" },
            { title: "Poodle" },
            { title: "Beagle" },
            { title: "Rottweiler" },
            { title: "Yorkshire Terrier" },
            { title: "Dachshund" },
            { title: "Boxer" },
            { title: "Siberian Husky" },
            { title: "Shih Tzu" },
            { title: "Doberman Pinscher" },
            { title: "Chihuahua" },
            { title: "Australian Shepherd" },
          ]),
        },
        {
          setName: "Aquatic animals",
          utensilSet: shuffle([
            { title: "Dolphin" },
            { title: "Shark" },
            { title: "Whale" },
            { title: "Octopus" },
            { title: "Jellyfish" },
            { title: "Sea turtle" },
            { title: "Clownfish" },
            { title: "Starfish" },
            { title: "Seal" },
            { title: "Manatee" },
            { title: "Squid" },
            { title: "Manta ray" },
          ]),
        },
        {
          setName: "Face emojis",
          utensilSet: shuffle([
            { title: "😊" },
            { title: "😂" },
            { title: "😍" },
            { title: "🥺" },
            { title: "🥳" },
            { title: "🤔" },
            { title: "😅" },
            { title: "😜" },
            { title: "😢" },
            { title: "😎" },
            { title: "😴" },
            { title: "🤩" },
            { title: "🥴" },
            { title: "😳" },
            { title: "😌" },
            { title: "😇" },
            { title: "😈" },
            { title: "😤" },
            { title: "😵" },
            { title: "🤯" },
          ]),
        },
        {
          setName: "Seven Wonders of the Ancient World",
          utensilSet: shuffle([
            { title: "Great Pyramid of Giza" },
            { title: "Hanging Gardens of Babylon" },
            { title: "Statue of Zeus at Olympia" },
            { title: "Temple of Artemis" },
            { title: "Mausoleum at Halicarnassus" },
            { title: "Colossus of Rhodes" },
            { title: "Lighthouse of Alexandria" },
          ]),
        },
        {
          setName: "Popular vacation spots",
          utensilSet: shuffle([
            { title: "Paris, France" },
            { title: "Bali, Indonesia" },
            { title: "Kyoto, Japan" },
            { title: "Rome, Italy" },
            { title: "Maui, Hawaii, US" },
            { title: "Santorini, Greece" },
            { title: "Dubai, UAE" },
            { title: "Sydney, Australia" },
          ]),
        },
        {
          setName: "Harry Potter books",
          utensilSet: shuffle([
            { title: "Sorcerer's Stone" },
            { title: "Chamber of Secrets" },
            { title: "Prisoner of Azkaban" },
            { title: "Goblet of Fire" },
            { title: "Order of the Phoenix" },
            { title: "Half-Blood Prince" },
            { title: "Deathly Hallows" },
          ]),
        },
        {
          setName: "Summer Olympic sports",
          utensilSet: shuffle([
            { title: "Archery" },
            { title: "Badminton" },
            { title: "Equestrian" },
            { title: "Fencing" },
            { title: "Golf" },
            { title: "Handball" },
            { title: "Rowing" },
            { title: "Skateboarding" },
            { title: "Swimming" },
            { title: "Table tennis" },
            { title: "Volleyball" },
            { title: "Wrestling" },
          ]),
        },
        {
          setName: "Best-selling video games",
          utensilSet: shuffle([
            { title: "Minecraft" },
            { title: "Grand Theft Auto V" },
            { title: "Wii Sports" },
            { title: "Mario Kart 8" },
            { title: "PUBG: Battlegrounds" },
            { title: "Red Dead Redemption 2" },
            { title: "Terraria" },
            { title: "Super Mario Bros." },
            { title: "Human: Fall Flat" },
            { title: "The Witcher 3: Wild Hunt" },
          ]),
        },
        {
          setName: "Popular Disney movies",
          utensilSet: shuffle([
            { title: "The Lion King" },
            { title: "Aladdin" },
            { title: "Beauty and the Beast" },
            { title: "Frozen" },
            { title: "Moana" },
            { title: "Cinderella" },
            { title: "The Little Mermaid" },
            { title: "Sleeping Beauty" },
            { title: "Snow White and the Seven Dwarfs" },
            { title: "Mulan" },
            { title: "Peter Pan" },
            { title: "Tangled" },
            { title: "Pocahontas" },
            { title: "The Jungle Book" },
            { title: "Zootopia" },
            { title: "Toy Story" },
            { title: "Up" },
          ]),
        },
        {
          setName: "Popular fast food chains",
          utensilSet: shuffle([
            { title: "McDonald's" },
            { title: "Burger King" },
            { title: "Taco Bell" },
            { title: "KFC" },
            { title: "Wendy's" },
            { title: "Subway" },
            { title: "Chick-fil-A" },
            { title: "Domino's" },
            { title: "Popeyes" },
          ]),
        },
        {
          setName: "Popular works of art by Leonardo da Vinci",
          utensilSet: shuffle([
            { title: "The Last Supper" },
            { title: "Mona Lisa" },
            { title: "Vitruvian Man" },
            { title: "The Virgin of the Rocks" },
            { title: "Lady with an Ermine" },
            { title: "Saint John the Baptist" },
          ]),
        },
        {
          setName: "Types of lighting fixtures",
          utensilSet: shuffle([
            { title: "Chandelier" },
            { title: "Pendant light" },
            { title: "Recessed light" },
            { title: "Track lighting" },
            { title: "Table lamp" },
            { title: "Floor lamp" },
            { title: "Wall sconce" },
            { title: "Ceiling fan light" },
            { title: "Flush mount light" },
            { title: "Spotlight" },
            { title: "String lights" },
            { title: "LED strip lights" },
          ]),
        },
        {
          setName: "String instruments",
          utensilSet: shuffle([
            { title: "Violin" },
            { title: "Guitar" },
            { title: "Cello" },
            { title: "Banjo" },
            { title: "Harp" },
            { title: "Mandolin" },
            { title: "Double bass" },
            { title: "Sitar" },
          ]),
        },
        {
          setName: "McDonald's menu items",
          utensilSet: shuffle([
            { title: "Big Mac" },
            { title: "Quarter Pounder with Cheese" },
            { title: "McChicken" },
            { title: "Filet-O-Fish" },
            { title: "Cheeseburger" },
            { title: "McFlurry" },
            { title: "Apple Pie" },
            { title: "Hot 'n Spicy McChicken" },
            { title: "McDouble" },
            { title: "Chicken McNuggets" },
            { title: "Egg McMuffin" },
            { title: "Sausage McMuffin" },
          ]),
        },
        {
          setName: "Popular cereals",
          utensilSet: shuffle([
            { title: "Frosted Flakes" },
            { title: "Cheerios" },
            { title: "Cinnamon Toast Crunch" },
            { title: "Lucky Charms" },
            { title: "Froot Loops" },
            { title: "Cocoa Puffs" },
            { title: "Honey Bunches of Oats" },
            { title: "Cap'n Crunch" },
            { title: "Raisin Bran" },
            { title: "Rice Krispies" },
            { title: "Trix" },
            { title: "Reese's Puffs" },
            { title: "Apple Jacks" },
            { title: "Corn Flakes" },
            { title: "Special K" },
            { title: "Mini Wheats" },
            { title: "Kix" },
            { title: "Life" },
          ]),
        },
        {
          setName: "Types of clouds",
          utensilSet: shuffle([
            { title: "Cumulus" },
            { title: "Stratus" },
            { title: "Cirrus" },
            { title: "Cumulonimbus" },
            { title: "Stratocumulus" },
            { title: "Altocumulus" },
            { title: "Altostratus" },
            { title: "Nimbostratus" },
            { title: "Cirrostratus" },
            { title: "Cirrocumulus" },
          ]),
        },
        {
          setName: "Famous optical illusions",
          utensilSet: shuffle([
            { title: "Checker shadow illusion" },
            { title: "Café wall illusion" },
            { title: "Ebbinghaus illusion" },
            { title: "Hermann grid" },
            { title: "Kanizsa triangle" },
            { title: "Müller-Lyer illusion" },
            { title: "Ponzo illusion" },
            { title: "Fraser spiral" },
            { title: "Necker cube" },
            { title: "Lilac chaser" },
            { title: "Spinning dancer" },
            { title: "Troxler's fading" },
            { title: "Impossible trident" },
          ]),
        },
        {
          setName: "Minecraft wood types",
          utensilSet: shuffle([
            { title: "Oak" },
            { title: "Spruce" },
            { title: "Birch" },
            { title: "Jungle" },
            { title: "Acacia" },
            { title: "Dark oak" },
            { title: "Mangrove" },
            { title: "Cherry" },
            { title: "Crimson" },
            { title: "Warped" },
          ]),
        },
        {
          setName: "Best-selling studio albums",
          utensilSet: shuffle([
            { title: "Thriller (Michael Jackson)" },
            { title: "Back in Black (AC/DC)" },
            { title: "The Dark Side of the Moon (Pink Floyd)" },
            { title: "Hotel California (Eagles)" },
            { title: "Come On Over (Shania Twain)" },
            { title: "Rumours (Fleetwood Mac)" },
            { title: "Bat Out of Hell (Meat Loaf)" },
            { title: "Led Zeppelin IV (Led Zeppelin)" },
            { title: "Bad (Michael Jackson)" },
            { title: "Jagged Little Pill (Alanis Morissette)" },
          ]),
        },
        {
          setName: "Ivy league universities",
          utensilSet: shuffle([
            { title: "Brown University" },
            { title: "Columbia University" },
            { title: "Cornell University" },
            { title: "Dartmouth University" },
            { title: "Harvard University" },
            { title: "University of Pennsylvania" },
            { title: "Princeton University" },
            { title: "Yale University" },
          ]),
        },
        {
          setName: "Popular sans-serif typefaces",
          utensilSet: shuffle([
            { title: "Arial" },
            { title: "Helvetica" },
            { title: "Poppins" },
            { title: "Futura" },
            { title: "Roboto" },
            { title: "Nunito" },
            { title: "Montserrat" },
            { title: "Open Sans" },
            { title: "Inter" },
          ]),
        },
        {
          setName: "Days of the week",
          utensilSet: shuffle([
            { title: "Sunday" },
            { title: "Monday" },
            { title: "Tuesday" },
            { title: "Wednesday" },
            { title: "Thursday" },
            { title: "Friday" },
            { title: "Saturday" },
          ]),
        },
        {
          setName: "Months of the year",
          utensilSet: shuffle([
            { title: "January" },
            { title: "February" },
            { title: "March" },
            { title: "April" },
            { title: "May" },
            { title: "June" },
            { title: "July" },
            { title: "August" },
            { title: "September" },
            { title: "October" },
            { title: "November" },
            { title: "December" },
          ]),
        },
        {
          setName: "Common types of knots",
          utensilSet: shuffle([
            { title: "Square knot" },
            { title: "Clove hitch" },
            { title: "Bowline" },
            { title: "Double figure eight" },
            { title: "Two half-hitches" },
            { title: "Taut-line hitch" },
            { title: "Fisherman's" },
            { title: "Water knot" },
            { title: "Rolling hitch" },
            { title: "Prusik" },
            { title: "Timber hitch" },
            { title: "Blood knot" },
            { title: "Artillery loop" },
            { title: "Carrick bend" },
            { title: "Sheepshank" },
          ]),
        },
        {
          setName: "Types of denim",
          utensilSet: shuffle([
            { title: "Raw" },
            { title: "Selvedge" },
            { title: "Acid-wash" },
            { title: "Stretch" },
            { title: "Crushed" },
            { title: "Bull" },
            { title: "Colored" },
          ]),
        },
        {
          setName: "Types of bread",
          utensilSet: shuffle([
            { title: "Sourdough" },
            { title: "Baguette" },
            { title: "Ciabatta" },
            { title: "Brioche" },
            { title: "Rye Bread" },
            { title: "Pumpernickel" },
            { title: "Multigrain" },
            { title: "Whole wheat" },
            { title: "White" },
            { title: "Focaccia" },
            { title: "Challah" },
            { title: "Naan" },
            { title: "Pita" },
            { title: "Flatbread" },
            { title: "Cornbread" },
          ]),
        },
        {
          setName: "Types of puppets",
          utensilSet: shuffle([
            { title: "Hand puppet" },
            { title: "Finger puppet" },
            { title: "Marionette" },
            { title: "Shadow puppet" },
            { title: "Ventriloquist puppet" },
            { title: "Sock puppet" },
            { title: "Rod puppet" },
          ]),
        },
        {
          setName: "Common figures of speech",
          utensilSet: shuffle([
            { title: "Alliteration" },
            { title: "Circumlocution" },
            { title: "Euphemism" },
            { title: "Hyperbole" },
            { title: "Irony" },
            { title: "Metaphor" },
            { title: "Metonymy" },
            { title: "Onomatopoeia" },
            { title: "Oxymoron" },
            { title: "Personification" },
            { title: "Simile" },
          ]),
        },
        {
          setName: "Popular card games",
          utensilSet: shuffle([
            { title: "Poker" },
            { title: "Blackjack" },
            { title: "Solitaire" },
            { title: "Bridge" },
            { title: "Crazy Eights" },
            { title: "Go Fish" },
            { title: "Spoons" },
            { title: "Spades" },
            { title: "Whist" },
          ]),
        },
        {
          setName: "Popular web development technologies",
          utensilSet: shuffle([
            { title: "React" },
            { title: "Angular" },
            { title: "Vue" },
            { title: "Svelte" },
            { title: "Solid" },
            { title: "Next.js" },
            { title: "Nuxt.js" },
            { title: "Remix" },
          ]),
        },
        {
          setName: "Yoga poses",
          utensilSet: shuffle([
            { title: "Downward dog" },
            { title: "Warrior I" },
            { title: "Warrior II" },
            { title: "Tree pose" },
            { title: "Child's pose" },
            { title: "Cobra pose" },
            { title: "Cat-cow" },
            { title: "Triangle pose" },
            { title: "Seated forward bend" },
            { title: "Bridge pose" },
            { title: "Lotus pose" },
            { title: "Plank pose" },
          ]),
        },
        {
          setName: "Wind instruments",
          utensilSet: shuffle([
            { title: "Flute" },
            { title: "Clarinet" },
            { title: "Saxophone" },
            { title: "Oboe" },
            { title: "Bassoon" },
            { title: "Trumpet" },
            { title: "Trombone" },
            { title: "French horn" },
            { title: "Piccolo" },
            { title: "Bass clarinet" },
            { title: "Didgeridoo" },
          ]),
        },
        {
          setName: "Common logical fallacies",
          utensilSet: shuffle([
            { title: "Ad hominem" },
            { title: "Strawman" },
            { title: "Appeal to authority" },
            { title: "No true scotsman" },
            { title: "False dilemma" },
            { title: "Slippery slope" },
            { title: "Circular reasoning" },
            { title: "Texas sharpshooter" },
            { title: "Fallacy fallacy" },
            { title: "Bandwagon" },
            { title: "Tu quoque" },
            { title: "Anecdotal" },
            { title: "Burden of proof" },
          ]),
        },
        {
          setName: "Popular types of hats",
          utensilSet: shuffle([
            { title: "Fedora" },
            { title: "Beanie" },
            { title: "Baseball cap" },
            { title: "Bowler hat" },
            { title: "Panama hat" },
            { title: "Trilby" },
            { title: "Top hat" },
            { title: "Beret" },
            { title: "Bucket hat" },
            { title: "Sun hat" },
            { title: "Cowboy hat" },
            { title: "Cloche hat" },
          ]),
        },
        {
          setName: "Popular skateboarding tricks",
          utensilSet: shuffle([
            { title: "Ollie" },
            { title: "Kickflip" },
            { title: "Heelflip" },
            { title: "Shuvit" },
            { title: "Impossible" },
            { title: "360 flip" },
            { title: "Nollie" },
            { title: "Laser flip" },
          ]),
        },
        {
          setName: "Pokémon types",
          utensilSet: shuffle([
            { title: "Normal" },
            { title: "Fire" },
            { title: "Water" },
            { title: "Electric" },
            { title: "Grass" },
            { title: "Ice" },
            { title: "Fighting" },
            { title: "Poison" },
            { title: "Ground" },
            { title: "Flying" },
            { title: "Psychic" },
            { title: "Bug" },
            { title: "Rock" },
            { title: "Ghost" },
            { title: "Dragon" },
            { title: "Dark" },
            { title: "Steel" },
            { title: "Fairy" },
            { title: "Stellar" },
          ]),
        },
        {
          setName: "Chess pieces",
          utensilSet: shuffle([
            { title: "King" },
            { title: "Queen" },
            { title: "Rook" },
            { title: "Bishop" },
            { title: "Knight" },
            { title: "Pawn" },
          ]),
        },
        {
          setName: "The Twelve Olympians",
          utensilSet: shuffle([
            { title: "Zeus" },
            { title: "Hera" },
            { title: "Poseidon" },
            { title: "Demeter" },
            { title: "Athena" },
            { title: "Apollo" },
            { title: "Artemis" },
            { title: "Ares" },
            { title: "Aphrodite" },
            { title: "Hephaestus" },
            { title: "Hermes" },
            { title: "Dionysus" },
          ]),
        },
        {
          setName: "Common types of birds",
          utensilSet: shuffle([
            { title: "Eagle" },
            { title: "Hawk" },
            { title: "Owl" },
            { title: "Falcon" },
            { title: "Parrot" },
            { title: "Crow" },
            { title: "Raven" },
            { title: "Sparrow" },
            { title: "Penguin" },
            { title: "Flamingo" },
            { title: "Peacock" },
            { title: "Hummingbird" },
          ]),
        },
        {
          setName: "Noble gases",
          utensilSet: shuffle([
            { title: "Helium" },
            { title: "Neon" },
            { title: "Argon" },
            { title: "Krypton" },
            { title: "Xenon" },
            { title: "Radon" },
            { title: "Oganesson" },
          ]),
        },
        {
          setName: "Main characters in SpongeBob SquarePants",
          utensilSet: shuffle([
            { title: "SpongeBob SquarePants" },
            { title: "Patrick Star" },
            { title: "Squidward Tentacles" },
            { title: "Mr. Krabs" },
            { title: "Sandy Cheeks" },
            { title: "Plankton" },
            { title: "Karen" },
            { title: "Mrs. Puff" },
            { title: "Pearl" },
            { title: "Larry the Lobster" },
            { title: "Mermaid Man" },
            { title: "Barnacle Boy" },
          ]),
        },
        {
          setName: "Games in Jackbox Party Pack 3",
          utensilSet: shuffle([
            { title: "Guesspionage" },
            { title: "Tee K.O." },
            { title: "Trivia Murder Party" },
            { title: "Quiplash 2" },
            { title: "Fakin' It" },
          ]),
        },
        {
          setName: "Playground equipment",
          utensilSet: shuffle([
            { title: "Swings" },
            { title: "Slide" },
            { title: "Monkey bars" },
            { title: "Seesaw" },
            { title: "Sandbox" },
            { title: "Zip line" },
            { title: "Rock wall" },
            { title: "Merry-go-round" },
            { title: "Spring riders" },
          ]),
        },
        {
          setName: "Shrek characters",
          utensilSet: shuffle([
            { title: "Shrek" },
            { title: "Donkey" },
            { title: "Princess Fiona" },
            { title: "Lord Farquaad" },
            { title: "Puss in Boots" },
            { title: "Dragon" },
            { title: "Gingerbread Man" },
            { title: "Pinocchio" },
          ]),
        },
        {
          setName: "Popular pop tart flavors",
          utensilSet: shuffle([
            { title: "Frosted s'mores" },
            { title: "Frosted cherry" },
            { title: "Frosted blueberry" },
            { title: "Frosted brown sugar cinnamon" },
            { title: "Frosted strawberry" },
            { title: "Frosted chocolate fudge" },
            { title: "Frosted cookies & crème" },
            { title: "Frosted raspberry" },
            { title: "Frosted chocolate chip" },
            { title: "Frosted confetti cupcake" },
          ]),
        },
        {
          setName: "Well-known football/soccer players",
          utensilSet: shuffle([
            { title: "Pelé" },
            { title: "Diego Maradona" },
            { title: "Lionel Messi" },
            { title: "Cristiano Ronaldo" },
            { title: "Zinedine Zidane" },
            { title: "Johan Cruyff" },
            { title: "Michel Platini" },
            { title: "Ronaldinho" },
            { title: "Franz Beckenbauer" },
            { title: "Ronaldo Nazário" },
            { title: "David Beckham" },
            { title: "Kylian Mbappé" },
          ]),
        },
        {
          setName: "Well-known NFL teams",
          utensilSet: shuffle([
            { title: "Dallas Cowboys" },
            { title: "New England Patriots" },
            { title: "Pittsburgh Steelers" },
            { title: "Green Bay Packers" },
            { title: "San Francisco 49ers" },
            { title: "Chicago Bears" },
            { title: "Miami Dolphins" },
            { title: "New York Giants" },
            { title: "Los Angeles Rams" },
            { title: "Kansas City Chiefs" },
            { title: "Philadelphia Eagles" },
            { title: "Minnesota Vikings" },
            { title: "Buffalo Bills" },
          ]),
        },
      ])
    );
  }, []);

  function shuffle<T>(array: T[]): T[] {
    let currentIndex = array.length;

    while (currentIndex != 0) {
      const randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Pairckle: Starter sets</title>
        <meta property="og:title" content="Pairckle: Starter sets" />
        <meta
          property="og:description"
          content="Easily rank your favorite things with pairwise comparisons."
        />
        <meta name="theme-color" content="#f97316" />
      </Head>

      <div className="min-h-screen lg:min-h-[94.6vh]">
        <div className="w-full h-full flex justify-center items-center mt-48 px-4 pb-16">
          <div>
            <div
              className={`grid grid-cols-1 ${
                starterSets.length != 1 ? "lg:grid-cols-2" : ""
              } gap-8 lg:gap-10 w-full`}
            >
              {[...starterSets].map((set, index1) => (
                <div className="w-80 lg:w-96" key={index1}>
                  <div className="flex gap-2 items-end px-2 mb-1">
                    <h2 className="font-medium w-full lg:line-clamp-1 overflow-ellipsis">
                      {set["setName"]}
                    </h2>
                  </div>
                  <ul className="h-[13.5rem] lg:h-[21.5rem] overflow-y-auto border-gray-400/40 border-2 rounded-lg">
                    {/* create shallow copy of set["utensilSet"] (so it wont actually change the set["utensilSet"] variable), sort utensils by their score */}
                    {[...set["utensilSet"]].map((utensil, index2) => (
                      <li
                        key={index2}
                        className="flex items-center justify-center odd:bg-gray-400/20 first:rounded-t-md last:rounded-b-md px-2 py-1"
                      >
                        <span className="w-full">{utensil["title"]}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    className="h-min w-full flex justify-center items-center bg-gray-400/20 hover:bg-gray-400/30 active:bg-gray-400/40 rounded-md text-sm lg:text-base transition px-2.5 py-1.5 lg:px-3 lg:py-2 mt-2"
                    href="/"
                    onClick={() => {
                      localStorage.setItem(
                        "utensilInput",
                        set["utensilSet"]
                          .map((utensil) => utensil.title)
                          .join("\n")
                      );
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faChartSimple}
                      className="text-gray-800 dark:text-gray-300 rotate-90 mr-2"
                      aria-labelledby="use-this-text"
                    />
                    <span id="use-this-text">Rank this set</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
