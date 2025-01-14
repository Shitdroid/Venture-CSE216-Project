$(document).ready(function () {
    $(".fa-bars").click(function () {
        $(this).toggleClass("fa-times");
        $(".navbar").toggleClass("nav-toggle");
    });

    $(window).on("load scroll", function () {
        $(".fa-bars").removeClass("fa-times");
        $(".navbar").removeClass("nav-toggle");

        if ($(window).scrollTop() > 30) {
            $(".header").css({
                background: "#5b2aa3",
                "box-shadow": "0 .2rem .5rem rgba(0,0,0,.4)",
            });
        } else {
            $(".header").css({ background: "none", "box-shadow": "none" });
        }
    });

    $(".accordion-header").click(function () {
        $(".accordion .accordion-body").slideUp();
        $(this).next(".accordion-body").slideDown();
        $(".accordion .accordion-header span").text("+");
        $(this).children("span").text("-");
    });

    $("#mybtn").click(function () {
        var dots = document.getElementById("dots");
        var moreText = document.getElementById("more");
        var btnText = document.getElementById("mybtn");

        if (dots.style.display === "none") {
            dots.style.display = "inline";
            btnText.innerHTML = "Read more";
            moreText.style.display = "none";
        } else {
            dots.style.display = "none";
            btnText.innerHTML = "Read less";
            moreText.style.display = "inline";
        }
    });

    $("#loginbtn").click(function () {
        var x = document.getElementById("login");
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
    });
    $(".radio-example").click(function () {
        if ($("#exampleRadios2")[0].checked) {
            $("#Bio")[0].classList.remove("visually-hidden");
        } else $("#Bio")[0].classList.add("visually-hidden");
    });
});
