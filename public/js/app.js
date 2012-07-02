$(document).ready(function () {
  function charCount() {
    return parseInt($("#char-count").val(), 10);
  }

  function drawGrid() {
    var number = charCount(),
        grid   = $("<div />").addClass("ui-grid-a").attr({ "id": "bar" });

    for (var i=0; i < number; i++) {
      grid.append($("#char-inputs").render({ id: i }));
    }
    return grid;
  }

  function drawFirstPage() {
    var page    = $("<div />"),
        content = "";

    page.attr({ "data-role": "page", id: "char-1" });
    page.append("<div data-role='header'><h1>Vaulderie</h1></div>");

    content = $("<div />").attr({ "data-role":"content" }).append(drawGrid());
    content.append("<a href='#char-2'>Next</a>");
    page.append(content);
    $("#home-page").parent().append(page);
  };

  function drawRemainingPages() {
    var page,
        content,
        charNumber = charCount();
    
    for (var i=2; i <= charNumber; i++) {
      page = $("<div />");
      page.attr({ "data-role": "page", id: "char-" + i });
      page.append("<div data-role='header'><h1>Vaulderie</h1></div>");

      content = $("<div />").attr({ "data-role":"content" }).append(drawGrid());
      if(i === charNumber) {
        content.append("<a href='#calculate'>Calculate</a>");
      } else {
        content.append("<a href='#char-" + (i+1) + "'>Next</a>");
      }
      page.append(content);
      $("#home-page").parent().append(page);
    }
  };

  function calculate() {
    function getNames(charNum) {
      return $("#char-" + charNum + " input[type='text']").map(function(idx, el) {
        return $(el).val();
      }).toArray();
    }

    function getValues(charNum) {
      return $("#char-" + charNum + " select").map(function(idx, el) {
        return $(el).val();
      }).toArray();
    }

    var charNumber = charCount(),
        result = [],
        row,
        names,
        values;

    for (var i=1; i <= charNumber; i++) {
      row = {};
      names = getNames(i);
      values = getValues(i);
      row['name'] = names.shift();
      row['poolValue'] = parseInt(values.shift(), 10);
      row['ratings'] = {};
      names.forEach(function(el, idx) {
        row['ratings'][el] = parseInt(values[idx], 10);
      });

      result.push(row);
    }

    showResults(Calculate.ratings(result));
  };

  function showResults(data) {
    $('#calculate .body').html($("#char-results").render(data));
  };

  $(document).on("pagebeforechange", function (e, data) {
    if (typeof data.toPage === "string") {
      if (data["options"].fromPage[0]["id"] === "home-page") {
        drawFirstPage();
      } else if (data["options"].fromPage[0]["id"] === "char-1") {
        drawRemainingPages();
      } else if (data.toPage.match(/#calculate$/)) {
        calculate();
      }
    }
  });
});
