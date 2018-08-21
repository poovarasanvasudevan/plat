let app = angular.module('corre', ['ngMaterial', 'ngMessages'], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{#');
    $interpolateProvider.endSymbol('#}');
});
app.config(function ($mdThemingProvider) {

    $mdThemingProvider.definePalette('mpl', {
        '50': 'e0eaf9',
        '100': 'b3cbf0',
        '200': '80a9e6',
        '300': '4d86db',
        '400': '266cd4',
        '500': '0052cc',
        '600': '004bc7',
        '700': '0041c0',
        '800': '0038b9',
        '900': '0028ad',
        'A100': 'd7ddff',
        'A200': 'a4b3ff',
        'A400': '7188ff',
        'A700': '5872ff',
        'contrastDefaultColor': 'light',
        'contrastDarkColors': [
            '50',
            '100',
            '200',
            'A100',
            'A200',
            'A400'
        ],
        'contrastLightColors': [
            '300',
            '400',
            '500',
            '600',
            '700',
            '800',
            '900',
            'A700'
        ]
    });
    $mdThemingProvider.definePalette('white', {
        '50': 'ffffff',
        '100': 'ffffff',
        '200': 'ffffff',
        '300': 'ffffff',
        '400': 'ffffff',
        '500': 'ffffff',
        '600': 'ffffff',
        '700': 'ffffff',
        '800': 'ffffff',
        '900': 'ffffff',
        'A100': 'ffffff',
        'A200': 'ffffff',
        'A400': 'ffffff',
        'A700': 'ffffff',
        'contrastDefaultColor': 'light',
        'contrastDarkColors': [
            '50',
            '100',
            '200',
            '300',
            '400',
            '500',
            '600',
            '700',
            '800',
            '900',
            'A100',
            'A200',
            'A400',
            'A700'
        ],
        'contrastLightColors': []
    });
    $mdThemingProvider.definePalette('sflow', {
        '50': 'fefeff',
        '100': 'fefefe',
        '200': 'fdfdfd',
        '300': 'fcfcfc',
        '400': 'fbfbfc',
        '500': 'fafafb',
        '600': 'f9f9fa',
        '700': 'f9f9fa',
        '800': 'f8f8f9',
        '900': 'f6f6f8',
        'A100': 'ffffff',
        'A200': 'ffffff',
        'A400': 'ffffff',
        'A700': 'ffffff',
        'contrastDefaultColor': 'light',
        'contrastDarkColors': [
            '50',
            '100',
            '200',
            '300',
            '400',
            '500',
            '600',
            '700',
            '800',
            '900',
            'A100',
            'A200',
            'A400',
            'A700'
        ],
        'contrastLightColors': []
    });
    $mdThemingProvider.definePalette('gpanel', {
        '50': 'e4f4ec',
        '100': 'bbe3d0',
        '200': '8dd1b0',
        '300': '5fbe90',
        '400': '3db079',
        '500': '1ba261',
        '600': '189a59',
        '700': '14904f',
        '800': '108645',
        '900': '087533',
        'A100': 'a5ffc4',
        'A200': '72ffa2',
        'A400': '3fff80',
        'A700': '25ff6f',
        'contrastDefaultColor': 'light',
        'contrastDarkColors': [
            '50',
            '100',
            '200',
            '300',
            '400',
            'A100',
            'A200',
            'A400',
            'A700'
        ],
        'contrastLightColors': [
            '500',
            '600',
            '700',
            '800',
            '900'
        ]
    });

    $mdThemingProvider
        .theme('default')
        .primaryPalette(COLOR_PALLETE)
});
app.controller('basecontroller', function ($scope,$mdSidenav) {
    $scope.colorPalette = COLOR_PALLETE

    $scope.sidebarToggle = function() {
        $mdSidenav('left').toggle()
    }

})
app.controller('sidebarcontroller', function ($scope) {
    $scope.sidebarItems = [
        "Home",
        "Forms",
        "Tickets",
        "Service Request",
        "Problem Tickets",
    ]

    $scope.funClick = function () {

    }
})

app.directive('logo', function () {
    return {
        restrict: 'E',
        transclude: 'false',
        templateUrl: '/asset/component/logo.html',
        link: function (scope, element, attr) {
        }
    }
})
app.directive('searchBar', function () {
    return {
        restrict: 'E',
        replace: true,
        template: '<form class="component-inline-search-form" action="/search/" method="get">\n' +
        '        <input type="text" name="query" placeholder="Search documentation">\n' +
        '    </form>',
        link: function (scope, element, attr) {

        }
    }
})
app.directive('coorehref', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {

            if (attr.href != null) {
                let href = ""

                let append = '_qa=' + new Date().valueOf() + "&clang=en"
                if (attr.href.indexOf('?') === -1) {
                    href = attr.href + '?' + append
                } else {
                    href = attr.href + '&' + append
                }
                $(element).attr('href', href)
            }
        }
    }
})
app.directive('headerBar', function () {
    return {
        restrict: 'E',
        replace: true,
        transclude: 'false',
        templateUrl: '/asset/component/toolbar.html',
        link: function (scope, element, attr) {
            scope.barEnable = 'true'
            if (attr.barenable) {
                scope.barEnable = attr.barenable
            }


            if (USER === undefined)
                scope.user = null
            else
                scope.user = USER
        }
    }
})