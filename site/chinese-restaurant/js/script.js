$( function () { // same as document.addEventListener("DOMContentLoaded", ...)
    //same as document.querySelector("navbarSupportedContent").addEventListener("blur", ...)
    $("#navbarToggle").blur(function (event) {
        var screenWidth = $(window).width();
        if (screenWidth < 992) {
            $("#navbarSupportedContent").collapse("hide");
        }
    });
});

(function (global) {
    var dc = {};

    var homeHtml = "snippets/home-snippet.html"

    var insertHtml = function (selector, html) {
        var targetElem = $(selector)[0];
        console.log(targetElem)
        targetElem.innerHTML = html;
    }

    dc.insertHtml = insertHtml

    var showLoading = function (selector) {
        var html = "<div class='text-center'>";
        html += "<img src='images/loading.gif'></div>";
        insertHtml(selector, html);
    };

    // load home content into #main-content by default
    $(function (event){
        showLoading("#main-content");
        $.get(homeHtml, "",
            function (data, status, jqXHR) {
                insertHtml("#main-content", data);
            });
    });

    // -- CATEGORIES Page
    var allCategoriesUrl = "http://davids-restaurant.herokuapp.com/categories.json"
    var categoriesTitleHtml = "snippets/categories-title-snippet.html"
    var categoryHtml = "snippets/categories-snippet.html"

    var insertProperty = function (string, propName, value){
        var propToReplace = "{{" + propName + "}}";
        string = string.replace(new RegExp(propToReplace, "g"), value);
        return string
    }

    function buildCategoriesViewHtml(categories, categoriesTitleHtmlData, categoryHtmlData){
        var viewHtml = categoriesTitleHtmlData +  "<section class='row'>";

        for (cat in categories){
            cat = categories[cat];
            categoryHtmlDataOut = categoryHtmlData
            for (c in cat){
                categoryHtmlDataOut = insertProperty(categoryHtmlDataOut, c, cat[c])
            }
            viewHtml += categoryHtmlDataOut
        };

        viewHtml += "</section>"

        return viewHtml
    }

    function buildAndShowCategoriesHTML (categories, status, jqXHR) {
        $.get(categoriesTitleHtml, "",
            function (categoriesTitleHtmlData, status, jqXHR) {
                $.get(categoryHtml, "", function (categoryHtmlData, status, jqXHR){
                    var categoriesViewHtml = buildCategoriesViewHtml(categories, categoriesTitleHtmlData, categoryHtmlData)
                    insertHtml("#main-content", categoriesViewHtml)
                });
            });
    };

    dc.loadMenuCategories = function() {
        showLoading("#main-content");
        $.get(allCategoriesUrl, "", buildAndShowCategoriesHTML, "json");
    };


    // -- single categories view
    var singleCategoryUrl = "http://davids-restaurant.herokuapp.com/menu_items.json";
    var menuitemsTitleHtml = "snippets/menu-items-title.html";
    var menuitemsContentHtml = "snippets/menu-items-content.html";

    function buildSingleCategoryPage(category_json, menuitemsTitleHtmlData, menuitemsContentHtmlData) {

        var headerHtml = insertProperty(menuitemsTitleHtmlData, "name", category_json.category.name)
        headerHtml = insertProperty(headerHtml, "special_instructions", category_json.category.special_instructions)

        menu_items = category_json.menu_items

        var contentHtml = "<section class='row'>";

        for (var i=0; i < menu_items.length; i++) {
            menu_item = menu_items[i];
            itemHtml = menuitemsContentHtmlData;
            itemHtml = insertProperty(itemHtml, "name", menu_item.name);
            itemHtml = insertProperty(itemHtml, "short_name", menu_item.short_name);
            itemHtml = insertProperty(itemHtml, "description", menu_item.description);
            itemHtml = insertProperty(itemHtml, "category", category_json.category.short_name);

            // ${{price_small}}<span> ({{small_portion_name}})</span> ${{price_large}}<span> ({{small_portion_name}})</span>
            itemHtml = insertProperty(itemHtml, "price_small", menu_item.price_small);
            itemHtml = insertProperty(itemHtml, "small_portion_name", menu_item.small_portion_name);
            itemHtml = insertProperty(itemHtml, "price_large", menu_item.price_large);
            itemHtml = insertProperty(itemHtml, "large_portion_name", menu_item.large_portion_name);
            
        }

        contentHtml += "</section>"

        return headerHtml+contentHtml
    }

    function buildAndShowSingleCategory (category_json, status, jqXHR) {
        $.get(menuitemsTitleHtml, "", function (menuitemsTitleHtmlData, status, jqXHR){
            $.get(menuitemsContentHtml, "", function (menuitemsContentHtmlData, status, jqXHR){
                var singleCategoryView = buildSingleCategoryPage(category_json, menuitemsTitleHtmlData, menuitemsContentHtmlData);
                insertHtml("#main-content", singleCategoryView);
            });
        });
    }

    dc.loadMenuItem = function (category) {
        $.get(singleCategoryUrl+"?category="+category, "", buildAndShowSingleCategory, "json");
    };
    

    
    global.$dc = dc
})(window);
