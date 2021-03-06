
//Handle Scrape button
$("#scrape").on("click", function() {
    $.ajax({
        method: "GET",
        url: "/scrape",
    }).done(function(data) {
        console.log(data);
    });
    alert("Scraping current articles now!!");
    window.location = "/";   
});

//Handle Save Article button
$(".save").on("click", function () {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/articles/save/" + thisId
    }).done(function (data) {
        window.location = "/"
    })
});

//Handle Delete Saved Article button
$(".delete").on("click", function () {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/articles/delete/" + thisId
    }).done(function (data) {
        window.location = "/saved"
    })
});

//Handle Save Note button
$(".saveNote").on("click", function () {
    var thisId = $(this).attr("data-id");
    if (!$("#noteText" + thisId).val()) {
        alert("please enter a note to save")
    } else {
        $.ajax({
            method: "POST",
            url: "/notes/save/" + thisId,
            data: {
                text: $("#noteText" + thisId).val()
            }
        }).done(function (data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            $("#noteText" + thisId).val("");
            $("#noteModal" + thisId).modal("hide");
        });
    }
});

//Handle Delete Note button
$(".deleteNote").on("click", function () {
    var thisId = $(this).attr("data-id");
    var noteId = $(this).attr("data-note-id");
    var articleId = $(this).attr("data-article-id");
    $.ajax({
        method: "DELETE",
        url: "/notes/delete/" + noteId + "/" + articleId
    }).done(function (data) {
        console.log(data)
        // $(".modalNote").modal("hide");
        window.location = "/saved"
    })
});

// Handle Clear all Articles button
$("#clear").on("click", function () {
    $.ajax({
        method: "DELETE",
        url: "/articles/clear",
    }).done(function (data) {
        $(".article-container").empty();
        $(".no-articles").show();
        window.location = "/"
    })
});
