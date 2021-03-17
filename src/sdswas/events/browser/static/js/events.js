(function() {
    'use strict';

    var requirejsOptions = {
        optimize: 'none',
        urlArgs:  "bust=v1",
        paths: {
            'main': '++theme++sdswas/js/main',
            'event_presentations': '++resource++sdswas.events/js/event_presentations',
        }
    };

    if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
        module.exports = requirejsOptions;
    }
    if (typeof requirejs !== 'undefined' && requirejs.config) {
        requirejs.config(requirejsOptions);
    }

    requirejs([
        'main', 'event_presentations'
    ], function($, _bootstrap) {
        (function($) {
            var Events = {
                init: function() {
                    App.con("----> Events init");
                    this.upcoCards.init();
                    this.pastevCardsContainer.init();
                },

                populateModal: function(trigger) {

                    ModalWindow.init();

                    /*Set available information (title and go back link)*/
                    ModalWindow.gobackLink.text($(trigger).attr("data-gobacklink"));
                    ModalWindow.title.text($(trigger).attr("data-title"));


                    var url = $(trigger).attr("data-url");
                    /**Fetch the rest of the information: contents of the body */
                    $(".modwin-main-content").load(url, function(responseTxt, statusTxt, xhr) {
                        if (statusTxt = "success") {
                            Events.openModal();
                            if ($(trigger).attr("data-has-calendar")=="True")
                                Events.setAddCalendarLink(trigger);

                            EventPresentations.init();
                            ImagesSlider.init();
                        }
                    });
                },

                setAddCalendarLink: function(trigger) {

                    try {
                        var is_upcoming = $(trigger).attr("data-is-upcoming");
                        var event_page_url = $(trigger).attr("data-page-url");
                        var event_title = $(trigger).attr("data-title");
                        var event_start_date = $(trigger).attr("data-start-date")+"TZ";
                        var event_end_date = $(trigger).attr("data-end-date")+"TZ";

                        if (!event_page_url) event_page_url = "";
                        else {
                            event_page_url = "For+details,+visit:"+event_page_url;
                        }

                        if (!event_title) event_title = "";
                        if (!event_start_date) event_start_date = "";
                        if (!event_end_date) event_start_date = "";

                        var url = "https://calendar.google.com/calendar/r/eventedit?text="+event_title
                                    +"&dates="+event_start_date +"/"+event_end_date
                                    +"&details="+event_page_url
                                    +"&location=Barcelona+Supercomputing+Center+-+Centre+Nacional+de+Supercomputació";

                        $("#add-calendar").attr("href", url);
                     }
                     catch (Exception) {
                        $("#add-calendar").hide();
                     }

                },

                openModal: function() {

                    App.mainContent.addClass("freeze-main-content");
                    Sidenav.repos();

                    ModalWindow.el.addClass("show");
                    ModalWindow.el.removeClass("hide");
                    ModalWindow.isOpen = true;
                },

                upcoCards: {
                    selectors: $(".events-upco-card"),
                    triggers: $(".js-card-trigger"),
                    titles: $(".events-upco-card-title :first-child"),
                    titleLenght: 75,

                    init: function() {
                        this.trimTextsLength();
                        this.addListeners();
                    },

                    trimTextsLength: function() {
                        // Trim titles
                        this.titles.each(function() {
                            var text = $(this).text();
                            var maxlength = Events.upcoCards.titleLenght;
                            $(this).text(Utils.textTrimmer(text, maxlength));
                            if(text.length > maxlength) $(this).attr("title", text);
                        });
                    },
                    addListeners: function() {
                        App.con("----)))) Upcoming events >> Cards are listening");
                        this.selectors.each(function() {

                            $(this).on("click", ".js-card-trigger", function(event) {
                                event.preventDefault();
                                //this is the current trigger but we use the parent who set the event because it has the data to be used by its children
                                Events.populateModal(event.delegateTarget);
                            });
                        });
                    },
                },

                pastevCards: {
                    selectors: $(".pastev-card"),
                    triggers: $(".js-card-trigger"),
                    titles: $(".pastev-card-title :first-child"),
                    titleLenght: 70,

                    init: function() {
                        this.trimTextsLength();
                        this.addListeners();
                    },

                    trimTextsLength: function() {
                        // Trim titles
                        $(".pastev-card-title :first-child").each(function() {
                            var text = $(this).text();
                            var maxlength = Events.pastevCards.titleLenght;
                            $(this).text(Utils.textTrimmer(text, maxlength));
                            if(text.length > maxlength) $(this).attr("title", text);
                        });
                    },
                    addListeners: function() {
                        App.con("----)))) Past events >> Cards are listening");
                        $(".pastev-card").each(function() {

                            $(this).on("click", ".js-card-trigger", function(event) {
                                event.preventDefault();
                                //this is the current trigger but we use the parent who set the event because it has the data to be used by its children
                                Events.populateModal(event.delegateTarget);
                            });
                        });
                    },
                },

                pastevCardsContainer: {
                    updateUrl: $(".pastev-cards-container").attr("data-url"),

                    init: function() {
                        App.con("----> Past events cards container init");
                        this.addListeners();
                        this.update();
                    },

                    addListeners: function() {
                        App.con("----)))) Past events >> Search input is listening");

                        $("form#searchPastev").submit(function(e) {
                            e.preventDefault();
                            Events.pastevCardsContainer.update();
                        });
                    },

                    update: function() {

                        App.loader.init();

                        var searchinput = $("#searchPastev .search-tool-input").val()
                        var url = this.updateUrl+"?searchinput="+encodeURIComponent(searchinput)

                        $(".pastev-cards-container").load(url, function(responseTxt, statusTxt, xhr) {
                            if (statusTxt == "success") {
                                Events.pastevCards.init();
                            } else {
                                $(this).append("<p>Past events can not be displayed now. Please <a href='contact-info'> contact us</a>.</p>");
                            }
                            gsap.to(".page-overlay", {
                                    duration: 5,
                                    onComplete: function() {
                                        App.loader.end();
                                    }
                            });
                        })
                    },

                }
            }

            $(document).ready(function() {
                Events.init();
            });
        })(jQuery);
    });
}());