(function() {
    'use strict';

    angular.module('app')
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    /* @ngInject */
    function config($stateProvider, $urlRouterProvider) {

        // For any unmatched url, redirect to /login
        $urlRouterProvider.otherwise("/");

        //////STATES//////

        var auth = {
            name: "auth",
            url: "/",
            views: {
                "login": {
                    templateUrl: "./app/login/login.html",
                    controller: "LoginController",
                    controllerAs: "vm",
                    resolve: {
                        styleSheets: loginStyleSheets
                    }
                }
            }
        };

        var logout = {
            name: "logout",
            url: "/logout",
            views: {
                "login": {
                    templateUrl: "app/login/login.html",
                    controller: "LoginController",
                    controllerAs: "vm",
                    resolve: {
                        styleSheets: loginStyleSheets,
                        doLogout: doLogout
                    }
                }
            }
        };


        var forgot = {
            name: "forgot",
            url: "/forgot",
            views: {
                "login": {
                    templateUrl: "./app/login/forgot.html",
                    controller: "ForgotController",
                    controllerAs: "vm",
                    resolve: {
                        styleSheets: loginStyleSheets
                    }
                }
            }
        };

        var account_confirmation = {
            name: "account-confirmation",
            url: "/account-confirmation",
            views: {
                "login": {
                    templateUrl: "app/login/confirmation.html",
                    controller: "ConfirmationController",
                    controllerAs: "vm",
                    resolve: {
                        styleSheets: loginStyleSheets,
                    }
                }
            }
        };

        var account_password_reset = {
            name: "account-password-reset",
            url: "/account-password-reset",
            views: {
                "login": {
                    templateUrl: "app/login/passwordreset.html",
                    controller: "PasswordResetController",
                    controllerAs: "vm",
                    resolve: {
                        styleSheets: loginStyleSheets,
                    }
                }
            }
        };
        //Dashboard routes
        var dashboard = {
            name: "dashboard",
            url: "/dashboard",
            views: {
                "main": {
                    templateUrl: "app/dashboard/dashboard.html",
                    controller: "DashboardController",
                    controllerAs: "vm",
                    resolve: {
                        styleSheets: dashboardStyleSheets
                    }
                },
            }
        };
        //END Dashboard Route

        //Brand routes
        var brand = {
            name: "dashboard.brand",
            url: "/brand",
            parent: dashboard,
            views: {
                "main_body": {
                    templateUrl: "app/brand/brand.html",
                    controller: "BrandController",
                    controllerAs: "vm",
                    resolve: {
                    }
                },
                //"nav": nav
            }
        };

        var brandArchived = {
            name: "dashboard.brand.archived",
            url: "/brand-archived",
            parent: dashboard,
            views: {
                "main_body": {
                    templateUrl: "app/brand/brand.archived.html",
                    controller: "BrandArchivedController",
                    controllerAs: "vm",
                    resolve: {
                    }
                },
                //"nav": nav
            }
        };

        var brandAdd = {
            name: "dashboard.brand.add",
            url: "/add",
            parent: brand,
            views: {
                "page_body": {
                    templateUrl: "app/brand/brand.add.html",
                    controller: "BrandAddController",
                    controllerAs: "vm"
                }
            }
        };

        var brandEdit = {
            name: "dashboard.brand.edit",
            url: "/edit/:id",
            parent: brand,
            views: {
                "page_body": {
                    templateUrl: "app/brand/brand.add.html",
                    controller: "BrandEditController",
                    controllerAs: "vm",
                    resolve: {
                        prepSelBrand: prepSelBrand
                    }
                }
            }
        };

        var brandView = {
            name: "dashboard.brand.view",
            url: "/:id",
            parent: brand,
            views: {
                "page_body": {
                    templateUrl: "app/brand/brand.view.html",
                    controller: "BrandViewController",
                    controllerAs: "vm",
                    resolve: {
                        prepSelBrand: prepSelBrand
                    }
                }
            }
        };
        //END Brand routes

        //Category routes
        var category = {
            name: "dashboard.category",
            url: "/category",
            parent: dashboard,
            views: {
                "main_body": {
                    templateUrl: "app/category/category.html",
                    controller: "CategoryController",
                    controllerAs: "vm",
                    resolve: {
                    }
                },
                //"nav": nav
            }
        };

        var categoryArchived = {
            name: "dashboard.category.archived",
            url: "/category-archived",
            parent: dashboard,
            views: {
                "main_body": {
                    templateUrl: "app/category/category.archived.html",
                    controller: "CategoryArchivedController",
                    controllerAs: "vm",
                    resolve: {
                    }
                },
                //"nav": nav
            }
        };

        var categoryAdd = {
            name: "dashboard.category.add",
            url: "/add",
            parent: category,
            views: {
                "page_body": {
                    templateUrl: "app/category/category.add.html",
                    controller: "CategoryAddController",
                    controllerAs: "vm"
                }
            }
        };

        var categoryEdit = {
            name: "dashboard.category.edit",
            url: "/edit/:id",
            parent: category,
            views: {
                "page_body": {
                    templateUrl: "app/category/category.add.html",
                    controller: "CategoryEditController",
                    controllerAs: "vm",
                    resolve: {
                        prepSelCategory: prepSelCategory
                    }
                }
            }
        };

        //END Category routes

        //Deal routes
        var deal = {
            name: "dashboard.deal",
            url: "/deal",
            parent: dashboard,
            views: {
                "main_body": {
                    templateUrl: "app/deals/deal.html",
                    controller: "DealController",
                    controllerAs: "vm",
                    resolve: {
                        prepDealType: prepDealTypeStandard,
                    }
                },
                //"nav": nav
            }
        };

        var dealPending = {
            name: "dashboard.deal.pending",
            url: "/deal-pending",
            parent: dashboard,
            views: {
                "main_body": {
                    templateUrl: "app/deals/deal.pending.html",
                    controller: "DealPendingController",
                    controllerAs: "vm",
                    resolve: {
                        prepDealType: prepDealTypeStandard,
                    }
                },
                //"nav": nav
            }
        };

        var dealArchived = {
            name: "dashboard.deal.archived",
            url: "/deal-archived",
            parent: dashboard,
            views: {
                "main_body": {
                    templateUrl: "app/deals/deal.archived.html",
                    controller: "DealArchivedController",
                    controllerAs: "vm",
                    resolve: {
                        prepDealType: prepDealTypeStandard,
                    }
                },
                //"nav": nav
            }
        };

        var dealAdd = {
            name: "dashboard.deal.add",
            url: "/add",
            parent: deal,
            views: {
                "page_body": {
                    templateUrl: "app/deals/deal.add.html",
                    controller: "DealAddController",
                    controllerAs: "vm",
                    resolve: {
                        styleSheets: dateTimeStyleSheets,
                        prepDealType: prepDealTypeStandard,
                        brandPrepService: brandPrepService,
                        categoryPrepService: categoryPrepService
                    }
                }
            }
        };

        var dealDesign = {
            name: "dashboard.deal.design",
            url: "/design/:id",
            parent: deal,
            views: {
                "page_body": {
                    templateUrl: "app/deals/deal.design.html",
                    controller: "DealDesignController",
                    controllerAs: "vm",
                    resolve: {
                        prepSelDeal: prepSelDeal,
                        prepDealType: prepDealTypeStandard,
                        prepAllSuperBlocks: prepAllSuperBlocks,
                        prepDealBlocks: prepDealBlocks,
                        froalaS3Info: froalaS3Info
                    }
                }
            }
        };

        var dealEdit = {
            name: "dashboard.deal.edit",
            url: "/edit/:id",
            parent: deal,
            views: {
                "page_body": {
                    templateUrl: "app/deals/deal.add.html",
                    controller: "DealEditController",
                    controllerAs: "vm",
                    resolve: {
                        styleSheets: dateTimeStyleSheets,
                        prepDealType: prepDealTypeStandard,
                        prepSelDeal: prepSelDeal,
                        brandPrepService: brandPrepService,
                        categoryPrepService: categoryPrepService,
                        prepSelVariants: prepSelVariants,
                        prepActiveStandardD: prepActiveStandardD,
                        prepDealImages: prepDealImages,
                        prepDealVideos: prepDealVideos
                    }
                }
            }
        };

        var dealView = {
            name: "dashboard.deal.view",
            url: "/:id",
            parent: deal,
            views: {
                "page_body": {
                    templateUrl: "app/deals/deal.view.html",
                    controller: "DealViewController",
                    controllerAs: "vm",
                    resolve: {
                        prepSelDeal: prepSelDeal,
                        prepActiveStandardD: prepActiveStandardD,
                        prepDealImages: prepDealImages,
                        prepDealVideos: prepDealVideos,
                        prepSelVariants: prepSelVariants
                    }
                }
            }
        };
        //END Deal routes

        //Upsell routes
        var upsell = {
            name: "dashboard.upsell",
            url: "/upsell",
            parent: dashboard,
            views: {
                "main_body": {
                    templateUrl: "app/deals/deal.html",
                    controller: "DealController",
                    controllerAs: "vm",
                    resolve: {
                        prepDealType: prepDealTypeUpsell,
                    }
                },
            }
        };

        var upsellDesign = {
            name: "dashboard.upsell.design",
            url: "/design/:id",
            parent: upsell,
            views: {
                "page_body": {
                    templateUrl: "app/deals/deal.design.html",
                    controller: "DealDesignController",
                    controllerAs: "vm",
                    resolve: {
                        prepSelDeal: prepSelDeal,
                        prepDealType: prepDealTypeUpsell,
                        prepAllSuperBlocks: prepAllSuperBlocks,
                        prepDealBlocks: prepDealBlocks,
                        froalaS3Info: froalaS3Info
                    }
                }
            }
        };

        var upsellPending = {
            name: "dashboard.upsell.pending",
            url: "/upsell-pending",
            parent: dashboard,
            views: {
                "main_body": {
                    templateUrl: "app/deals/deal.pending.html",
                    controller: "DealPendingController",
                    controllerAs: "vm",
                    resolve: {
                        prepDealType: prepDealTypeUpsell,
                    }
                },
                //"nav": nav
            }
        };

        var upsellAdd = {
            name: "dashboard.upsell.add",
            url: "/add",
            parent: upsell,
            views: {
                "page_body": {
                    templateUrl: "app/deals/deal.add.html",
                    controller: "DealAddController",
                    controllerAs: "vm",
                    resolve: {
                        styleSheets: dateTimeStyleSheets,
                        prepDealType: prepDealTypeUpsell,
                        brandPrepService: brandPrepService,
                        categoryPrepService: categoryPrepService,
                    }
                }
            }
        };

        var upsellEdit = {
            name: "dashboard.upsell.edit",
            url: "/edit/:id",
            parent: upsell,
            views: {
                "page_body": {
                    templateUrl: "app/deals/deal.add.html",
                    controller: "DealEditController",
                    controllerAs: "vm",
                    resolve: {
                        styleSheets: dateTimeStyleSheets,
                        prepDealType: prepDealTypeUpsell,
                        prepSelDeal: prepSelDeal,
                        brandPrepService: brandPrepService,
                        categoryPrepService: categoryPrepService,
                        prepSelVariants: prepSelVariants,
                        prepActiveStandardD: prepActiveStandardD,
                        prepDealImages: prepDealImages,
                        prepDealVideos: prepDealVideos
                    }
                }
            }
        };

        var upsellView = {
            name: "dashboard.upsell.view",
            url: "/:id",
            parent: upsell,
            views: {
                "page_body": {
                    templateUrl: "app/deals/deal.view.html",
                    controller: "DealViewController",
                    controllerAs: "vm",
                    resolve: {
                        prepSelDeal: prepSelDeal,
                        prepActiveStandardD: prepActiveStandardD,
                        prepDealImages: prepDealImages,
                        prepDealVideos: prepDealVideos,
                        prepSelVariants: prepSelVariants
                    }
                }
            }
        };
        //END Upsell routes

        //SuperBlock routes
        var superblock = {
            name: "dashboard.superblock",
            url: "/super-block",
            parent: dashboard,
            views: {
                "main_body": {
                    templateUrl: "app/super_blocks/super_block.html",
                    controller: "SuperBlockController",
                    controllerAs: "vm",
                    resolve: {
                    }
                },
            }
        };

        var superblockArchived = {
            name: "dashboard.superblock.archived",
            url: "/super-block-archived",
            parent: dashboard,
            views: {
                "main_body": {
                    templateUrl: "app/super_blocks/super_block.archived.html",
                    controller: "SuperBlockArchivedController",
                    controllerAs: "vm",
                    resolve: {
                    }
                },
            }
        };

        var superblockAdd = {
            name: "dashboard.superblock.add",
            url: "/add",
            parent: superblock,
            views: {
                "page_body": {
                    templateUrl: "app/super_blocks/super_block.add.html",
                    controller: "SuperBlockAddController",
                    controllerAs: "vm",
                    resolve: {
                        styleSheets: dateTimeStyleSheets,
                        froalaS3Info: froalaS3Info
                    }
                }
            }
        };

        var superblockEdit = {
            name: "dashboard.superblock.edit",
            url: "/edit/:id",
            parent: superblock,
            views: {
                "page_body": {
                    templateUrl: "app/super_blocks/super_block.add.html",
                    controller: "SuperBlockEditController",
                    controllerAs: "vm",
                    resolve: {
                        styleSheets: dateTimeStyleSheets,
                        prepSelSuperBlock: prepSelSuperBlock,
                        froalaS3Info: froalaS3Info
                    }
                }
            }
        };

        var superblockView = {
            name: "dashboard.superblock.view",
            url: "/:id",
            parent: superblock,
            views: {
                "page_body": {
                    templateUrl: "app/super_blocks/super_block.view.html",
                    controller: "SuperBlockViewController",
                    controllerAs: "vm",
                    resolve: {
                        prepSelSuperBlock: prepSelSuperBlock
                    }
                }
            }
        };
        //END SuperBlock routes

        //User routes
        var user = {
            name: "dashboard.user",
            url: "/user",
            parent: dashboard,
            views: {
                "main_body": {
                    templateUrl: "app/user/user.html",
                    controller: "UserController",
                    controllerAs: "vm",
                    resolve: {
                    }
                },
                //"nav": nav
            }
        };

        var userAdd = {
            name: "dashboard.user.add",
            url: "/add",
            parent: user,
            views: {
                "page_body": {
                    templateUrl: "app/user/user.add.html",
                    controller: "UserAddController",
                    controllerAs: "vm",
                    resolve: {
                    }
                }
            }
        };

        var userEdit = {
            name: "dashboard.user.edit",
            url: "/edit/:id",
            parent: user,
            views: {
                "page_body": {
                    templateUrl: "app/user/user.add.html",
                    controller: "UserEditController",
                    controllerAs: "vm",
                    resolve: {
                        prepSelUser: prepSelUser
                    }
                }
            }
        };

        var userView = {
            name: "dashboard.user.view",
            url: "/view/:id",
            parent: user,
            views: {
                "page_body": {
                    templateUrl: "app/user/user.view.html",
                    controller: "UserViewController",
                    controllerAs: "vm",
                    resolve: {
                        prepSelUser: prepSelUser
                    }
                }
            }
        };

        var userInfo = {
            name: "dashboard.account",
            url: "/account",
            parent: dashboard,
            views: {
                "main_body": {
                    templateUrl: "app/user/user.info.html",
                    controller: "UserInfoController",
                    controllerAs: "vm",
                    resolve: {
                        prepCurUser: prepCurUser
                    }
                },
                //"nav": nav
            }
        };


        //RocketDeal routes
        var rocketDeal = {
            name: "dashboard.rocketDeal",
            url: "/rocket-deal",
            parent: dashboard,
            views: {
                "main_body": {
                    templateUrl: "app/rocket_deals/rocket_deal.html",
                    controller: "RocketDealController",
                    controllerAs: "vm",
                    resolve: {
                    }
                },
            }
        };

        var rocketDealPending = {
            name: "dashboard.rocketDeal.pending",
            url: "/rocket-deal-pending",
            parent: dashboard,
            views: {
                "main_body": {
                    templateUrl: "app/rocket_deals/rocket_deal.pending.html",
                    controller: "RocketDealPendingController",
                    controllerAs: "vm",
                    resolve: {
                    }
                },
            }
        };

        var rocketDealFinished = {
            name: "dashboard.rocketDeal.finished",
            url: "/rocket-deal-finished",
            parent: dashboard,
            views: {
                "main_body": {
                    templateUrl: "app/rocket_deals/rocket_deal.finished.html",
                    controller: "RocketDealFinishedController",
                    controllerAs: "vm",
                    resolve: {
                    }
                },
            }
        };

        var rocketDealAdd = {
            name: "dashboard.rocketDeal.add",
            url: "/add",
            parent: rocketDeal,
            views: {
                "page_body": {
                    templateUrl: "app/rocket_deals/rocket_deal.add.html",
                    controller: "RocketDealAddController",
                    controllerAs: "vm",
                    resolve: {
                        styleSheets: dateTimeStyleSheets
                    }
                }
            }
        };

        var rocketDealEdit = {
            name: "dashboard.rocketDeal.edit",
            url: "/edit/:id",
            parent: rocketDeal,
            views: {
                "page_body": {
                    templateUrl: "app/rocket_deals/rocket_deal.edit.html",
                    controller: "RocketDealEditController",
                    controllerAs: "vm",
                    resolve: {
                        prepSelRocketDeal: prepSelRocketDeal
                    }
                }
            }
        };
        //END RocketDeal routes

        ////////////

        $stateProvider
            .state(auth)
            .state(logout)
            .state(dashboard)
            .state(forgot)
            .state(account_confirmation)
            .state(account_password_reset)
            .state(deal)
            .state(dealPending)
            .state(dealArchived)
            .state(dealAdd)
            .state(dealEdit)
            .state(dealDesign)
            .state(dealView)
            .state(upsell)
            .state(upsellPending)
            .state(upsellAdd)
            .state(upsellDesign)
            .state(upsellEdit)
            .state(upsellView)
            .state(superblock)
            .state(superblockArchived)
            .state(superblockAdd)
            .state(superblockEdit)
            .state(superblockView)
            .state(brand)
            .state(brandArchived)
            .state(brandAdd)
            .state(brandEdit)
            .state(brandView)
            .state(user)
            .state(userAdd)
            .state(userEdit)
            .state(userView)
            .state(userInfo)
            .state(category)
            .state(categoryArchived)
            .state(categoryAdd)
            .state(categoryEdit)
            .state(rocketDeal)
            .state(rocketDealPending)
            .state(rocketDealFinished)
            .state(rocketDealAdd)
            .state(rocketDealEdit);

        ////////////

        prepDealImages.$inject = ['DealService', '$stateParams'];
        /* @ngInject */
        function prepDealImages(DealService, $stateParams) {
            return DealService.getDealImages($stateParams.id);
        }

        prepActiveStandardD.$inject = ['DealService', '$stateParams'];
        /* @ngInject */
        function prepActiveStandardD(DealService, $stateParams) {
            return DealService.getActiveStandardDiscounts($stateParams.id);
        }

        prepSelVariants.$inject = ['DealService', '$stateParams'];
        /* @ngInject */
        function prepSelVariants(DealService, $stateParams) {
            return DealService.getVariants($stateParams.id);
        }

        prepSelTemplates.$inject = ['DealService', '$stateParams'];
        /* @ngInject */
        function prepSelTemplates(DealService, $stateParams) {
            return DealService.getTemplates($stateParams.id);
        }

        prepTemplateTypes.$inject = ['DealService'];
        /* @ngInject */
        function prepTemplateTypes(DealService) {
            return DealService.getTemplateTypes();
        }

        prepTemplateNames.$inject = ['DealService'];
        /* @ngInject */
        function prepTemplateNames(DealService) {
            return DealService.getTemplateNames();
        }

        prepSelUser.$inject = ['$stateParams', 'UserService'];
        /* @ngInject */
        function prepSelUser($stateParams, UserService) {
            return UserService.getById($stateParams.id);
        }

        prepCurUser.$inject = ['AuthService'];
        /* @ngInject */
        function prepCurUser(AuthService) {
            return AuthService.currentUser();
        }

        dateTimeStyleSheets.$inject = ['HelperService'];
        /* @ngInject */
        function dateTimeStyleSheets(HelperService) {
            var css = ['/templates/assets/layouts/layout/css/layout.min.css',
                '/templates/assets/layouts/layout/css/themes/darkblue.min.css',
                '/templates/assets/layouts/layout/css/chosen-bootstrap.css'
            ];
            HelperService.setCss(css);
        }

        loginStyleSheets.$inject = ['HelperService'];
        /* @ngInject */
        function loginStyleSheets(HelperService) {
            var css = ['/templates/assets/pages/css/login.min.css'];
            HelperService.setCss(css);
        }

        dashboardStyleSheets.$inject = ['HelperService'];
        /* @ngInject */
        function dashboardStyleSheets(HelperService) {
            var css = ['/templates/assets/layouts/layout/css/layout.min.css',
                '/templates/assets/layouts/layout/css/themes/darkblue.min.css'
            ];
            HelperService.setCss(css);
        }

        doLogout.$inject = ['AuthService'];
        /* @ngInject */
        function doLogout(AuthService) {
            AuthService.logout();
        }

        brandPrepService.$inject = ['BrandService'];
        /* @ngInject */
        function brandPrepService(BrandService) {
            return BrandService.getAll();
        }

        prepSelBrand.$inject = ['$stateParams', 'BrandService'];
        /* @ngInject */
        function prepSelBrand($stateParams, BrandService) {
            return BrandService.getById($stateParams.id);
        }

        prepSelDeal.$inject = ['$stateParams', 'DealService'];
        /* @ngInject */
        function prepSelDeal($stateParams, DealService) {
            return DealService.getById($stateParams.id);
        }

        categoryPrepService.$inject = ['CategoryService'];
        /* @ngInject */
        function categoryPrepService(CategoryService) {
            return CategoryService.getAll();
        }

        prepSelCategory.$inject = ['$stateParams', 'CategoryService'];
        /* @ngInject */
        function prepSelCategory($stateParams, CategoryService) {
            return CategoryService.find($stateParams.id);
        }

        prepDealVideos.$inject = ['DealService', '$stateParams'];
        /* @ngInject */
        function prepDealVideos(DealService, $stateParams) {
            return DealService.getDealVideos($stateParams.id);
        }

        /* @ngInject */
        function prepDealTypeStandard() {
            return 'standard';
        }

        /* @ngInject */
        function prepDealTypeUpsell() {
            return 'upsell';
        }

        prepSelRocketDeal.$inject = ['$stateParams', 'RocketDealService'];
        /* @ngInject */
        function prepSelRocketDeal($stateParams, RocketDealService) {
            return RocketDealService.getById($stateParams.id);
        }

        prepSelSuperBlock.$inject = ['$stateParams', 'SuperBlockService'];
        /* @ngInject */
        function prepSelSuperBlock($stateParams, SuperBlockService) {
            return SuperBlockService.getById($stateParams.id);
        }

        prepAllSuperBlocks.$inject = ['$stateParams', 'SuperBlockService'];
        /* @ngInject */
        function prepAllSuperBlocks($stateParams, SuperBlockService) {
            return SuperBlockService.search('', 'active', 1, 100);
        }

        prepDealBlocks.$inject = ['$stateParams', 'DealService'];
        /* @ngInject */
        function prepDealBlocks($stateParams, DealService) {
            return DealService.getAllDealBlocks($stateParams.id);
        }

        froalaS3Info.$inject = ['DashboardService'];
        /* @ngInject */
        function froalaS3Info(DashboardService) {
            return DashboardService.getFroalaS3Info();
        }
    }

})();
