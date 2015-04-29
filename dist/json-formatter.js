/*!
 * jsonformatter
 *
 * Version: 0.2.7 - 2014-12-21T20:19:06.891Z
 * License: MIT
 */


'use strict';

angular.module('jsonFormatter', ['RecursionHelper'])
    .directive('jsonFormatter', ['RecursionHelper',
        function(RecursionHelper) {
            function escapeString(str) {
                return str.replace('"', '\"');
            }

            // From http://stackoverflow.com/a/332429
            function getObjectName(object) {
                if (object === undefined) {
                    return '';
                }
                if (object === null) {
                    return 'Object';
                }
                if (typeof object === 'object' && !object.constructor) {
                    return 'Object';
                }
                var funcNameRegex = /function (.{1,})\(/;
                var results = (funcNameRegex).exec((object).constructor.toString());
                if (results && results.length > 1) {
                    return results[1];
                } else {
                    return '';
                }
            }

            function getFromElementAddressingList(object) {
                //some kind of enum
/*                1	a	+	
2	b	+	
7	g   +
16	p +
36	dd	+	
52	td --
76	li	+	
100	dl ++
111	ol	+	
115	small +
117	ul	  +
136	h1,h2,h3 ++	
138	h4,h5 (,h6 - 168?) ++
147	span +	
148	tr -		
268	label +
276	table -	
582	fieldset +
610	body ? -
641	area +		
873	img	++	
947	svg +
1134	noindex +
1587	select	+	
1795	canvas +
1812	tbody	-	
1827	center	+	
2061	map		+
2153	input	+	
2323	script -
2345	iframe +
2371	circle +
2406	form +
2414	noscript -
2605	meta	-
2703	option (?) -
2722	button	+	
2884	div +
3124	textarea +*/	
    var elements = {
'2' : 'b',
    '7' : 'g',
        '16' : 'p',
            '36' : 'dd',
              '52'	: 'td',
        '76' : 'li',
        '100' : 'dl',
        '111' : 'ol',
        '115' : 'small',
        '117' : 'ul',

            };
                console.log(object);
                return 'my title';
            }

            function getType(object) {
                if (object === null) {
                    return 'null';
                }
                return typeof object;
            }

            function link(scope, element, attributes) {
                scope.isArray = function() {
                    return Array.isArray(scope.json);
                };

                scope.isObject = function() {
                    return scope.json && typeof scope.json === 'object';
                };

                scope.getKeys = function() {
                    if (scope.isObject()) {
                        return Object.keys(scope.json).map(function(key) {
                            if (key === '') {
                                return '""';
                            }
                            return key;
                        });
                    }
                };
                scope.type = getType(scope.json);
                scope.title = getFromElementAddressingList(scope.json);
                scope.hasKey = typeof scope.key !== 'undefined';
                scope.getConstructorName = function() {
                    return getObjectName(scope.json);
                };

                if (scope.type === 'string') {

                    // Add custom type for date
                    if ((new Date(scope.json)).toString() !== 'Invalid Date') {
                        scope.isDate = true;
                    }

                    // Add custom type for URLs
                    if (scope.json.indexOf('http') === 0) {
                        scope.isUrl = true;
                    }
                }

                scope.isEmptyObject = function() {
                    return scope.getKeys() && !scope.getKeys().length &&
                        scope.isOpen && !scope.isArray();
                };


                // If 'open' attribute is present
                scope.isOpen = !! scope.open;
                scope.toggleOpen = function() {
                    scope.isOpen = !scope.isOpen;
                };
                scope.childrenOpen = function() {
                    if (scope.open > 1) {
                        return scope.open - 1;
                    }
                    return 0;
                };

                scope.openLink = function(isUrl) {
                    if (isUrl) {
                        window.location.href = scope.json;
                    }
                };

                scope.parseValue = function(value) {
                    scope.type = getType(scope.json);
                    if (scope.type === 'null') {
                        return 'null';
                    }
                    if (scope.type === 'undefined') {
                        return 'undefined';
                    }
                    if (scope.type === 'string') {
                        value = '"' + escapeString(value) + '"';
                    }
                    if (scope.type === 'function') {

                        // Remove content of the function
                        return scope.json.toString()
                            .replace(/\n/g, '')
                            .replace(/\{.+?\}/, '') + '{ ... }';

                    }
                    return value;
                };
            }

            return {
                templateUrl: 'json-formatter.html',
                restrict: 'E',
                replace: true,
                scope: {
                    json: '=',
                    key: '=',
                    open: '='
                },
                compile: function(element) {

                    // Use the compile function from the RecursionHelper,
                    // And return the linking function(s) which it returns
                    return RecursionHelper.compile(element, link);
                }
            };
        }
    ]);

'use strict';

// from http://stackoverflow.com/a/18609594
angular.module('RecursionHelper', []).factory('RecursionHelper', ['$compile',
    function($compile) {
        return {
            /**
             * Manually compiles the element, fixing the recursion loop.
             * @param element
             * @param [link] A post-link function, or an object with function(s)
             * registered via pre and post properties.
             * @returns An object containing the linking functions.
             */
            compile: function(element, link) {
                // Normalize the link parameter
                if (angular.isFunction(link)) {
                    link = {
                        post: link
                    };
                }

                // Break the recursion loop by removing the contents
                var contents = element.contents().remove();
                var compiledContents;
                return {
                    pre: (link && link.pre) ? link.pre : null,
                    /**
                     * Compiles and re-adds the contents
                     */
                    post: function(scope, element) {
                        // Compile the contents
                        if (!compiledContents) {
                            compiledContents = $compile(contents);
                        }
                        // Re-add the compiled contents to the element
                        compiledContents(scope, function(clone) {
                            element.append(clone);
                        });

                        // Call the post-linking function, if any
                        if (link && link.post) {
                            link.post.apply(null, arguments);
                        }
                    }
                };
            }
        };
    }
]);

angular.module("jsonFormatter").run(["$templateCache",
    function($templateCache) {
        $templateCache.put("json-formatter.html", "<div ng-init=\"isOpen = open && open > 0\" class=\"json-formatter-row\"><a ng-click=\"toggleOpen()\"><span class=\"toggler {{isOpen ? \'open\' : \'\'}}\" ng-if=\"isObject()\"></span> <span class=\"key\" ng-if=\"hasKey\">{{key}}:</span> <span class=\"value\"><span ng-if=\"isObject()\"><span class=\"constructor-name\">{{getConstructorName(json)}}</span> <span ng-if=\"isArray()\"><span class=\"bracket\">[</span><span class=\"number\">{{json.length}}</span><span class=\"bracket\">]</span></span></span> <span ng-if=\"!isObject()\" ng-click=\"openLink(isUrl)\" class=\"{{type}}\" title=\"{{title}}\" ng-class=\"{date: isDate, url: isUrl}\">{{parseValue(json)}}</span></span></a><div class=\"children\" ng-if=\"getKeys().length && isOpen\"><json-formatter ng-repeat=\"key in getKeys()\" json=\"json[key]\" key=\"key\" open=\"childrenOpen()\"></json-formatter></div><div class=\"children empty object\" ng-if=\"isEmptyObject()\"></div><div class=\"children empty array\" ng-if=\"getKeys() && !getKeys().length && isOpen && isArray()\"></div></div>");
    }
]);