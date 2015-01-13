angular.module('explorer', ['ionic', 'explorer.product'])

    .run(function ($ionicPlatform, $rootScope) {

        $rootScope.server = "http://belgianbeerexplorer.coenraets.org";

        $ionicPlatform.ready(function () {
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/products');
    });
