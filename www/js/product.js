angular.module('explorer.product', [])

    .config(function ($stateProvider) {

        $stateProvider

            .state('products', {
                url: "/products",
                templateUrl: "templates/product-list.html",
                controller: "ProductListCtrl"
            })

            .state('product-detail', {
                url: "/product/:name/:brewery/:alcohol/:tags",
                templateUrl: "templates/product-detail.html",
                controller: "ProductDetailCtrl"
            })

    })

    // REST resource for access to Products data
    .factory('Product', function ($http, $rootScope) {
        return {
            all: function(queryString) {
                return $http.get($rootScope.server + '/products', {params: queryString});
            }
        };
    })

    .controller('ProductListCtrl', function ($scope, $rootScope, $ionicScrollDelegate, Product) {

        $scope.products = [];

        var pageSize = 30,
            productCount = 1,
            page = 0;

        $scope.clearSearch = function() {
            $scope.searchKey = "";
            $scope.loadData();
        };

        $rootScope.$on('searchKeyChange', function(event, searchKey) {
            $scope.searchKey = searchKey;
            $scope.loadData();
        });

        $scope.formatAlcoholLevel = function(val) {
            return parseFloat(val);
        };

        $scope.loadData = function() {
            page = 1;
            var range = $slider.val();
            Product.all({search: $scope.searchKey, min: range[0], max: range[1], page: page, pageSize: pageSize}).success(function(result) {
                $scope.products = result.products;
                productCount = result.total;
                $ionicScrollDelegate.$getByHandle('myScroll').getScrollView().scrollTo(0, 0, true);
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        };

        $scope.loadMoreData = function() {
            page ++;
            var range = $slider.val();
            Product.all({search: $scope.searchKey, min: range[0], max: range[1], page: page, pageSize: pageSize}).success(function(result) {
                productCount = result.total;
                Array.prototype.push.apply($scope.products, result.products);
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        };

        $scope.isMoreData = function() {
            return page < (productCount / pageSize);
        };

        var $slider = $("#slider");
        $slider.noUiSlider({
            start: [ 0, 26 ],
            connect: true,
            step: 0.5,
            range: {
                'min': 0,
                'max': 26
            }
        });
        $slider.Link('lower').to('-inline-<div class="tooltip"></div>', function ( value ) {
            $(this).html(
                '<span>' + value.substr(0, value.length - 1) + '</span>'
            );
        });
        $slider.Link('upper').to('-inline-<div class="tooltip"></div>', function ( value ) {
            $(this).html(
                '<span>' + value.substr(0, value.length - 1) + '</span>'
            );
        });
        $slider.on({change: $scope.loadData});

    })

    .controller('ProductDetailCtrl', function ($scope, $rootScope, $state, $stateParams, Product) {

        $scope.product = {
            name: $stateParams.name,
            brewery: $stateParams.brewery,
            alcohol: $stateParams.alcohol,
            tags: $stateParams.tags
        };

        $scope.tags = $scope.product.tags.split(', ');


        $scope.setSearchKey = function(searchKey) {
            $rootScope.$emit('searchKeyChange', searchKey);
            $state.go('products');
        };

        $scope.formatAlcoholLevel = function(val) {
            return "" + parseFloat(val) + "%";
        };

    });
