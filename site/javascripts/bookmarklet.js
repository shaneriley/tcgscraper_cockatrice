function Bookmarklet() {
  var $ = j$;

  var b = {
    p: "tcg_cockatrice_bookmarklet_",
    $el: $(),
    $modal: $(),
    $modal_layer: $(),
    $main: [],
    $sideboard: [],
    deck_name: "",
    loaded: false,
    unsupported: false,
    prepScraper: function() {
      var l = window.location.host;
      if (l in b) { b[l](); }
      else { b.unsupported = true; }
    },
    prepModal: function() {
      var $f = $("<form />"),
          $ul, lis = [];
      b.$modal = $("<div />", { id: b.p + "modal" }).appendTo(document.body);
      b.$modal_layer = $("<div />", {
        id: b.p + "modal_layer",
        click: b.closeModal
      }).appendTo(document.body);
      if (b.unsupported) {
        $("<h1 />", { text: "Site currently unsupported" }).appendTo(b.$modal);
        $("<p />", { text: "Currently supported sites:" }).appendTo(b.$modal);
        $ul = $("<ul />").appendTo(b.$modal);
        for (var v in b) {
          if (typeof b[v] === "function" && /\./.test(v)) {
            lis.push("<li><a href='http://" + v + "'>" + v + "</a></li>");
          }
        }
        $ul.html(lis.join(""));
        return;
      }
      $("<h1 />", { text: "Deck Name" }).appendTo(b.$modal);
      $("<a />", {
        "class": "close",
        href: "#",
        text: "Close",
        click: b.closeModal
      }).appendTo(b.$modal);
      $f.appendTo(b.$modal).submit(b.writeFile);
      $("<input />", {
        type: "text",
        value: b.deck_name
      }).appendTo($f);
      $("<input />", {
        type: "submit",
        value: "Save"
      }).appendTo($f);
      b.openModal();
    },
    "magic.tcgplayer.com": function() {
      b.$el = $("td.default_8").find("table[bordercolor='#cccccc']");
      var cards = [],
          $td = b.$el.find("td.default_9").eq(0).find(".default_8w").eq(0).closest("td").clone(),
          sets;
      b.deck_name = b.$el.find(".default_10").eq(0).find("b").text();
      $td.find("table, center, font").remove();
      sets = $td.html().split("\"default_8w\"></div>");
      b.$main = b.getCardsFor(sets[1].split("<br>"));
      if (sets.length > 2) { b.$sideboard = b.getCardsFor(sets[2].split("<br>")); }
    },
    "forums.mtgsalvation.com": function() {
      b.$el = $("table.deck").eq(0);
      var cards = [],
          $tds = b.$el.find("tr").eq(1).find("td");
      b.deck_name = $("title").text().replace(/ - MTG Sal.*$/, "");
      $tds.each(function() {
        var $td = $(this).clone(),
            block;
        $td.find("b").remove();
        block = $td.html().split("<br>");
        if ($td.hasClass("sideboard")) { b.$sideboard = b.getCardsFor(block); }
        else { $.merge(b.$main, b.getCardsFor(block)); }
      });
    },
    openModal: function() {
      b.$modal.add(b.$modal_layer).fadeIn(500);
      return false;
    },
    closeModal: function() {
      b.$modal.add(b.$modal_layer).fadeOut(500);
      return false;
    },
    getCardsFor: function(cards) {
      var a = [];
      $.each(cards, function(i, v) {
        var s = $("<div />", { html: $.trim(v) }).text().replace(/[^A-Za-z0-9 ,\.':\-]/g, "");
        if (s && /^\d/.test(s) && /[A-Za-z]/.test(s)) {
          a.push("    <card number='" + /^\d+/.exec(s)[0] + "' price='0' name=\"" + s.replace(/^\d+x? /, "")  + "\"/>\r\n");
        }
      });
      return a;
    },
    writeFile: function(e) {
      e.preventDefault();
      var file;
      file = "data:application/octet-stream;charset=UTF-8,<?xml version='1.0' encoding='UTF-8'?>\r\n" +
        "<cockatrice_deck version='1'>\r\n" +
        "  <deckname>" + b.$modal.find(":text").val() + "</deckname>\r\n" +
        "  <comments></comments>\r\n" +
        "  <zone name='main'>\r\n" + b.$main.join("") +
        (b.$sideboard.length ? "  </zone>\r\n  <zone name='sideboard'>\r\n" + b.$sideboard.join("") : "") +
        "  </zone>\r\n" +
        "</cockatrice_deck>";
      window.location = window.encodeURI(file);
    },
    init: function() {
      if (b.loaded) { b.openModal(); return; }
      for (var v in b) {
        if (/^prep/.test(v) && typeof b[v] === "function") {
          b[v]();
        }
      }
      b.loaded = true;
      window.__tcg_cockatrice = b;
    }
  };
  if (window.__tcg_cockatrice) { b = window.__tcg_cockatrice; }

  var initAll = function() {
    if (!$) {
      setTimeout(initAll, 20);
      return false;
    }
    $(b.init);
  };
  initAll();
}
