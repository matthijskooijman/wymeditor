/* global
    prepareUnitTestModule,
    test,
    manipulationTestHelper,
    IMG_SRC
*/
"use strict";

/*
 * This file has tests for class toggling. `editor.toggleClass`.
 */

var toggleClassModuleClassesItems = [
    {
        name: "foo",
        title: "Foo",
        expr: "*"
    },
    {
        name: "bar",
        title: "Bar",
        expr: "ul"
    },
    {
        name: "fancy",
        title: "Fancy image",
        expr: "img"
    }
];

function toggleClassModuleSetup() {
    prepareUnitTestModule({
        options: {
            classesItems: toggleClassModuleClassesItems
        }
    });
}

module("toggleClass", {setup: toggleClassModuleSetup});

test("No change when no selection", function () {
    var noChangeHtml = "<p>Foo</p>";
    manipulationTestHelper({
        startHtml: noChangeHtml,
        prepareFunc: function (wymeditor) {
            wymeditor.deselect();
        },
        manipulationFunc: function (wymeditor) {
            wymeditor.toggleClass("foo", "p");
        },
        manipulationClickSelector: ".wym_classes_foo a",
        expectedResultHtml: noChangeHtml
    });
});

test("Adds className", function () {
    manipulationTestHelper({
        startHtml: "<p>Foo</p>",
        setCaretInSelector: "p",
        manipulationFunc: function (wymeditor) {
            wymeditor.toggleClass("foo", "p");
        },
        manipulationClickSelector: ".wym_classes_foo a",
        expectedResultHtml: "<p class=\"foo\">Foo</p>"
    });
});

test("Removes className", function () {
    manipulationTestHelper({
        startHtml: "<p class=\"foo\">Foo</p>",
        setCaretInSelector: "p",
        manipulationFunc: function (wymeditor) {
            wymeditor.toggleClass("foo", "p");
        },
        manipulationClickSelector: ".wym_classes_foo a",
        expectedResultHtml: "<p>Foo</p>"
    });
});

test("Adds className, keeping existing ones", function () {
    manipulationTestHelper({
        startHtml: "<p class=\"bar\">Foo</p>",
        setCaretInSelector: "p",
        manipulationFunc: function (wymeditor) {
            wymeditor.toggleClass("foo", "p");
        },
        manipulationClickSelector: ".wym_classes_foo a",
        expectedResultHtml: "<p class=\"bar foo\">Foo</p>"
    });
});

test("Removes className, keeping all others", function () {
    manipulationTestHelper({
        startHtml: "<p class=\"bar foo baz\">Foo</p>",
        setCaretInSelector: "p",
        manipulationFunc: function (wymeditor) {
            wymeditor.toggleClass("foo", "p");
        },
        manipulationClickSelector: ".wym_classes_foo a",
        expectedResultHtml: "<p class=\"bar baz\">Foo</p>"
    });
});

test("Adds className, selector determines element", function () {
    manipulationTestHelper({
        startHtml: [""
            , "<ul>"
                , "<li>"
                    , "A"
                    , "<ul>"
                        , "<li id=\"bar\">"
                            , "Bar"
                            , "<ul>"
                                , "<li>"
                                    , "Foo"
                                , "</li>"
                            , "</ul>"
                        , "</li>"
                    , "</ul>"
                , "</li>"
            , "</ul>"
        ].join(""),
        setCaretInSelector: "#bar",
        manipulationFunc: function (wymeditor) {
            wymeditor.toggleClass("bar", "ul");
        },
        manipulationClickSelector: ".wym_classes_bar a",
        expectedResultHtml: [""
            , "<ul>"
                , "<li>"
                    , "A"
                    , "<ul class=\"bar\">"
                        , "<li id=\"bar\">"
                            , "Bar"
                            , "<ul>"
                                , "<li>"
                                    , "Foo"
                                , "</li>"
                            , "</ul>"
                        , "</li>"
                    , "</ul>"
                , "</li>"
            , "</ul>"
        ].join("")
    });
});

test("Adds className to image", function () {
    manipulationTestHelper({
        startHtml: [""
            , "<p>"
                , "Foo"
                , "<img alt=\"foo\" src=\"" + IMG_SRC + "\" />"
            , "</p>"
        ].join(""),
        prepareFunc: function (wymeditor) {
            wymeditor.$body().find("img").mousedown();
        },
        manipulationFunc: function (wymeditor) {
            wymeditor.toggleClass("fancy", "img");
        },
        manipulationClickSelector: ".wym_classes_fancy a",
        expectedResultHtml: [""
            , "<p>"
                , "Foo"
                , "<img alt=\"foo\" class=\"fancy\" src=\"" + IMG_SRC + "\" />"
            , "</p>"
        ].join("")
    });
});
