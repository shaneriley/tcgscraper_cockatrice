function Bookmarklet() {
  var $ = j$;

  var b = {
    p: "tcg_cockatrice_bookmarklet_",
    $el: $("td.default_8").find("table[bordercolor='#cccccc']"),
    $modal: $(),
    $modal_layer: $(),
    loaded: false,
    prepModal: function() {
      var $f = $("<form />");
      b.$modal = $("<div />", { id: b.p + "modal" }).appendTo(document.body);
      b.$modal_layer = $("<div />", {
        id: b.p + "modal_layer",
        click: b.closeModal
      }).appendTo(document.body);
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
        value: b.$el.find(".default_10").eq(0).find("b").text()
      }).appendTo($f);
      $("<input />", {
        type: "submit",
        value: "Save"
      }).appendTo($f);
      b.openModal();
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
          a.push("    <card number='" + /^\d+/.exec(s)[0] + "' price='0' name=\"" + s.replace(/^\d+ /, "")  + "\"/>\r\n");
        }
      });
      return a;
    },
    writeFile: function(e) {
      e.preventDefault();
      var cards = [],
          $td = b.$el.find("td.default_9").eq(0).find(".default_8w").eq(0).closest("td").clone(),
          sets, $main = [], $sideboard = [], file;
      $td.find("table, center, font").remove();
      sets = $td.html().split("\"default_8w\"></div>");
      $main = b.getCardsFor(sets[1].split("<br>"));
      if (sets.length > 2) { $sideboard = b.getCardsFor(sets[2].split("<br>")); }
      file = "data:application/octet-stream;charset=UTF-8,<?xml version='1.0' encoding='UTF-8'?>\r\n" +
        "<cockatrice_deck version='1'>\r\n" +
        "  <deckname>" + b.$modal.find(":text").val() + "</deckname>\r\n" +
        "  <comments></comments>\r\n" +
        "  <zone name='main'>\r\n" + $main.join("") +
        ($sideboard.length ? "  </zone>\r\n  <zone name='sideboard'>\r\n" + $sideboard.join("") : "") +
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
