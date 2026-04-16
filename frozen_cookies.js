// Global Variables
var lastCompatibleVersion = 2.052;
if (Game.version > lastCompatibleVersion) {
    console.log("WARNING: The Cookie Clicker version is newer than this version of Frozen Cookies.");
    console.log(
        "This version of Frozen Cookies has only been tested through Cookie Clicker version " + lastCompatibleVersion,
    );
    console.log(
        "There may be incompatibilities, undesirable effects, bugs, shifts in reality, immoral behavior, and who knows what else.",
    );
}

var scriptElement =
    document.getElementById("frozenCookieScript") !== null
        ? document.getElementById("frozenCookieScript")
        : document.getElementById("modscript_frozen_cookies");
var baseUrl =
    scriptElement !== null
        ? scriptElement.getAttribute("src").replace(/\/frozen_cookies\.js$/, "")
        : "https://github.erbkaiser.com/FrozenCookies/";
var FrozenCookies = {
    baseUrl: baseUrl,
    branch: "erb-",
    version: "2.052.8", // This should match the version in README.md and Steam info.txt
};
var externalLibraryVersions = {
    jquery: "3.7.1",
    jqueryUi: "1.14.2",
    underscore: "1.13.8",
    jcanvas: "23.0.0",
    jqPlot: "1.0.9",
};
var externalLibraryUrls = {
    jquery: "https://code.jquery.com/jquery-" + externalLibraryVersions.jquery + ".min.js",
    jqueryUi: "https://code.jquery.com/ui/" + externalLibraryVersions.jqueryUi + "/jquery-ui.min.js",
    jqueryUiTheme:
        "https://code.jquery.com/ui/" + externalLibraryVersions.jqueryUi + "/themes/smoothness/jquery-ui.css",
    underscore:
        "https://cdn.jsdelivr.net/npm/underscore@" + externalLibraryVersions.underscore + "/underscore-umd-min.js",
    jcanvas:
        "https://cdnjs.cloudflare.com/ajax/libs/jcanvas/" + externalLibraryVersions.jcanvas + "/umd/jcanvas.min.js",
    jqPlot: "https://cdnjs.cloudflare.com/ajax/libs/jqPlot/" + externalLibraryVersions.jqPlot + "/",
};

// Load external libraries and FC scripts in order
var script_list = [
    externalLibraryUrls.jqueryUi,
    externalLibraryUrls.jqueryUiTheme,
    externalLibraryUrls.underscore,
    externalLibraryUrls.jcanvas,
    externalLibraryUrls.jqPlot + "jquery.jqplot.min.js",
    externalLibraryUrls.jqPlot + "jquery.jqplot.min.css",
    externalLibraryUrls.jqPlot + "plugins/jqplot.canvasTextRenderer.min.js",
    externalLibraryUrls.jqPlot + "plugins/jqplot.canvasAxisLabelRenderer.min.js",
    externalLibraryUrls.jqPlot + "plugins/jqplot.canvasAxisTickRenderer.min.js",
    externalLibraryUrls.jqPlot + "plugins/jqplot.trendline.min.js",
    externalLibraryUrls.jqPlot + "plugins/jqplot.highlighter.min.js",
    externalLibraryUrls.jqPlot + "plugins/jqplot.logAxisRenderer.min.js",
    externalLibraryUrls.jqPlot + "plugins/jqplot.cursor.min.js",
    FrozenCookies.baseUrl + "/fc_preferences.js", // preferences must be loaded before the rest of the scripts
    FrozenCookies.baseUrl + "/cc_upgrade_prerequisites.js", // upgrade prerequisites, used in fc_main.js
    FrozenCookies.baseUrl + "/fc_main.js", // main logic
    FrozenCookies.baseUrl + "/fc_gods.js", // gods minigame and dragon options
    FrozenCookies.baseUrl + "/fc_spells.js", // spells minigame and autocasting
    FrozenCookies.baseUrl + "/fc_bank.js", // bank minigame
    FrozenCookies.baseUrl + "/fc_button.js", // button to open the Frozen Cookies menu
    FrozenCookies.baseUrl + "/fc_infobox.js", // infobox
];

FrozenCookies.loadInterval = setInterval(function () {
    if (Game && Game.ready) {
        clearInterval(FrozenCookies.loadInterval);
        FrozenCookies.loadInterval = 0;
        fcInit();
    }
}, 1000);

function loadScript(id) {
    if (id >= script_list.length) {
        registerMod("frozen_cookies"); // when the mod is registered, the save data is passed in the load function
    } else {
        var url = script_list[id];
        if (/\.js$/.exec(url)) {
            $.getScript(url, function () {
                loadScript(id + 1);
            });
        } else if (/\.css$/.exec(url)) {
            $("<link>")
                .attr({
                    rel: "stylesheet",
                    type: "text/css",
                    href: url,
                })
                .appendTo($("head"));
            loadScript(id + 1);
        } else {
            console.log("Error loading script: " + url);
            loadScript(id + 1);
        }
    }
}

function fcInit() {
    var jquery = document.createElement("script");
    jquery.setAttribute("type", "text/javascript");
    // jqPlot is still unmaintained, so we stay on the latest jQuery 3.x line for compatibility.
    jquery.setAttribute("src", externalLibraryUrls.jquery);
    jquery.onload = function () {
        loadScript(0);
    };
    document.head.appendChild(jquery);
}
