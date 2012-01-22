# Magic: The Gathering Deck Scraper
## For decks on [tcgplayer.com](http://magic.tcgplayer.com) and use in [Cockatrice](http://cockatrice.de)
To use:
- Visit [the bookmarklet page](http://shaneriley.com/tcgscraper_cockatrice/)
- Drag link to your bookmarks bar
- Visit a deck listing on tcgplayer.com and run bookmarklet
- Deck name will auto-populate, or you can give your own
- Press save and the XML file will download

Depending on your browser, you'll get a file that follows a specific naming convention that you'll need to rename before opening in Cockatrice. In Safari, you'll get a file named `unknown` in your downloads directory, Chrome will give you a `download` file, and Firefox will give you some sort of keyed `.part` file. You'll rename that file to `name_of_deck.cod`. Be sure to use the .cod extension. From there, move the file to wherever your Cockatrice decks are and load it up! Works with both standard and commander decks, and properly separates main and sideboard.
