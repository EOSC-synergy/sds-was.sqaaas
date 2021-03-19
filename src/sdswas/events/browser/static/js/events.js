(function() {
    'use strict';

    var requirejsOptions = {
        baseUrl: '++theme++sdswas/',
        optimize: 'none',
        paths: {
            'main': 'js/main',
        }
    };

    if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
        module.exports = requirejsOptions;
    }
    if (typeof requirejs !== 'undefined' && requirejs.config) {
        requirejs.config(requirejsOptions);
    }

    requirejs([
        'main'
    ], function($, _bootstrap) {
        (function($) {
            Header.highlightMenuButton("#news-and-events-btn")

            $(document).ready(function() {
                Events.init();
            });
        })(jQuery);
    });
}());