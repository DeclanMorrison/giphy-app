let lastClicked = "";

let saved = [];

$(document).ready(function () {
  const animals = ["dog", "cat", "bird", "rabbit", "hamster", "skunk", "yes"];
  $.each(animals, function (index, value) {
    $("<button>").text(value)
      .attr("data-animal", value)
      .appendTo($(".buttons"))
      .addClass("button btn btn-secondary");
  });

  $(document.body).on("click", ".button", function () {
    let limit = 10;
    const $animal = $(this).text();
    let queryURL = ``;

    if (lastClicked !== $animal){
      queryURL = `https://api.giphy.com/v1/gifs/search?q=${$animal}&api_key=dc6zaTOxFJmzC&limit=${limit}&rating=pg`;
    }else if (lastClicked === $animal){
      limit = 20;
      queryURL = `https://api.giphy.com/v1/gifs/search?q=${$animal}&api_key=dc6zaTOxFJmzC&limit=${limit}&rating=pg`;
    }
    $.get(queryURL).then(function (response) {

      const $gifs = $(".gifs").empty();
      console.log(response);

      $.each(response.data, function (index, value) {

        const imageStill = value.images.fixed_height_still.url;
        const imageMove = value.images.fixed_height.url;
        const newGif = $(`<div class="wrapper image-${index}" data-num="image-${index}">
                            <div class="banner-top animated d-none" data-num="image-${index}">TITLE</div>
                            <div class="banner-bottom animated d-none" data-num="image-${index}"><i class="fas fa-download" data-num="image-${index}"></i></div>
                            <img class="image" src="${imageStill}" data-still="${imageStill}" data-move="${imageMove}" data-state="still" data-num="image-${index}" data-width="${value.images.fixed_height.width}" data-title="${value.title}" data-rating="${value.rating}">
                          </div>`);

        $(".gifs").append(newGif);

        $(`.image-${index} .banner-top`)
          .css("width", value.images.fixed_height.width)
          .text(` ${value.title} Rating: ${value.rating}`);

        $(`.image-${index} .banner-bottom`)
          .css("width", value.images.fixed_height.width);

        $(`.image-${index}`).css("width", value.images.fixed_height.width);
        
      });
    });
    lastClicked = $animal;
    console.log(lastClicked);
  });

  $(document.body).on("click", ".image", function () {
    const $still = $(this).attr("data-still");
    const $move = $(this).attr("data-move");
    const $state = $(this).attr("data-state");

    if ($state === "still") {
      $(this).attr("src", $move)
        .attr("data-state", "move");

    } else if ($state === "move") {
      $(this).attr("src", $still)
        .attr("data-state", "still");

    } else {
      console.error("ERROR, INCORRECT ATTRIBUTE: DATA-STATE");
    };

  });

  $(document.body).on({
    mouseenter: function () {
      const $imageNum = $(this).attr("data-num");
      $(`.${$imageNum} .banner-top`).removeClass("d-none fadeOut").addClass("fadeIn");
      $(`.${$imageNum} .banner-bottom`).removeClass("d-none fadeOut").addClass("fadeIn");
    },
    mouseleave: function () {
      const $imageNum = $(this).attr("data-num");
      $(`.${$imageNum} .banner-top`).removeClass("fadeIn").addClass("fadeOut");
      $(`.${$imageNum} .banner-bottom`).removeClass("fadeIn").addClass("fadeOut");
    }
  }, ".image, .banner-top, .banner-bottom, fa-trash-alt, fa-download");

  $(".add-new-button").on("click", function (event) {
    event.preventDefault();

    const newButton = $(".new-button").val();
    $("<button>").text(newButton).attr("data-animal", newButton).appendTo($(".buttons")).addClass("button btn btn-large btn-secondary");
  });

  $(document.body).on("click", "i.fas.fa-download", function () {
    const $imageIndex = $(`.${$(this).attr("data-num")} .image`);
    const newSaved = {
      srcMove: $imageIndex.attr("data-move"),
      srcStill: $imageIndex.attr("data-still"),
      srcTitle: $imageIndex.attr("data-title"),
      srcRating: $imageIndex.attr("data-rating"),
      srcWidth: $imageIndex.attr("data-width")
    };
    saved.push(newSaved);
    bootoast.toast({
    "message": "<p><strong>Success!</strong> The gif was saved!</p>",
    "type": "success",
    "position": "top-right",
    "animationDuration": "300",
    "dismissable": false
    });
  });

  $(document.body).on("click", "i.fas.fa-trash-alt", function () {
    const $imageIndex = $(`.${$(this).attr("data-num")} .image`)
    const $index = $imageIndex.attr("data-index");
    saved.splice($index, 1);
    $(".saved").trigger("click");
  });

  $(".saved").on("click", function () {
    const $gifs = $(".gifs").empty();

    $.each(saved, function (index, value) {

      const imageStill = value.srcStill;
      const imageMove = value.srcMove;
      const newGif = $(`<div class="wrapper image-${index}">
                          <div class="banner-top animated d-none">TITLE</div>
                          <div class="banner-bottom animated d-none"><i class="fas fa-trash-alt" data-num="image-${index}"></i></div>
                          <img class="image" src="${imageStill}" data-still="${imageStill}" data-move="${imageMove}" data-state="still" data-num="image-${index}" data-index="${index}">
                        </div>`);

      $gifs.append(newGif);

      $(`.image-${index} .banner-top`)
        .css("width", value.srcWidth)
        .text(` ${value.srcTitle} Rating: ${value.srcRating}`);

      $(`.image-${index} .banner-bottom`)
        .css("width", value.srcWidth);

      $(`.image-${index}`).css("width", value.srcWidth);

    });
  lastClicked = "";
  });

});