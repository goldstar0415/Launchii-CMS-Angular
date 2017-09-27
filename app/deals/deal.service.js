(function() {
    'use strict';

    angular.module('app.deals', [
            'app.deals.image',
            'app.deals.video'
        ])
        .factory('DealService', DealService);

    DealService.$inject = [
        '$http',
        'CONST',
        '$q',
        'HelperService',
        'BrandService',
        'CategoryService',
        '$rootScope',
        '$filter',
        '$log'
    ];

    /* @ngInject */
    function DealService(
        $http,
        CONST,
        $q,
        HelperService,
        BrandService,
        CategoryService,
        $rootScope,
        $filter,
        $log) {

        var api = CONST.api_domain + '/admin/deals';

        var service = {
            add: add,
            edit: edit,
            delete: _delete,
            getById: getById,
            find: find,
            search: search,
            approve: approve,
            reject: reject,
            getVariants: getVariants,
            getTemplates: getTemplates,
            templateNames: [],
            templateTypes: [],
            getTemplateNames: getTemplateNames,
            getTemplateTypes: getTemplateTypes,
            getUpsellDeals: getUpsellDeals,
            getActiveStandardDiscounts: getActiveStandardDiscounts,
            getDealImages: getDealImages,
            getDealVideos: getDealVideos,
            vendorDeals: vendorDeals,
            insertBlockToDeal: insertBlockToDeal,
            getAllDealBlocks: getAllDealBlocks,
            deleteDealBlock: deleteDealBlock,
            sortDealBlockByUp: sortDealBlockByUp,
            sortDealBlockByDown: sortDealBlockByDown,
            resetDealBlock: resetDealBlock,
            updateDealBlock: updateDealBlock,
            publishBlocks: publishBlocks
        }

        return service;

        //////// SERIVCE METHODS ////////

        function updateDealBlock(dealId, blockId, content) {
            var d = $q.defer();
            var url = api + "/" + dealId + "/blocks/" + blockId;

            var data = {
                "block": {
                    "content": content
                }
            };

            $http.patch(url, data).then(function(resp) {
                d.resolve(resp.data);
            }).catch(function(err) {
                $log.log(err);
                d.reject(err);
            });

            return d.promise;
        }

        function resetDealBlock(dealId, blockId) {
            var d = $q.defer();
            var url = api + "/" + dealId + "/blocks/" + blockId + "/reset";

            $http.patch(url).then(function(resp) {
                d.resolve(resp.data);
            }).catch(function(err) {
                $log.log(err);
                d.reject(err);
            });

            return d.promise;
        }

        function sortDealBlockByDown(dealId, blockId) {
            var d = $q.defer();
            var url = api + "/" + dealId + "/blocks/" + blockId + "/sort_down";

            $http.patch(url).then(function(resp) {
                d.resolve(resp.data);
            }).catch(function(err) {
                $log.log(err);
                d.reject(err);
            });

            return d.promise;
        }

        function sortDealBlockByUp(dealId, blockId) {
            var d = $q.defer();
            var url = api + "/" + dealId + "/blocks/" + blockId + "/sort_up";

            $http.patch(url).then(function(resp) {
                d.resolve(resp.data);
            }).catch(function(err) {
                $log.log(err);
                d.reject(err);
            });

            return d.promise;
        }

        function deleteDealBlock(dealId, blockId) {
            var d = $q.defer();
            var url = api + "/" + dealId + "/blocks/" + blockId;

            $http.delete(url).then(function(resp) {
                d.resolve(resp.data);
            }).catch(function(err) {
                $log.log(err);
                d.reject(err);
            });

            return d.promise;
        }

        function getAllDealBlocks(dealId) {
            var d = $q.defer();
            var url = api + '/' + dealId + '/blocks';

            $http.get(url).then(function(resp) {
                d.resolve(resp.data);
            }).catch(function(err) {
                $log.log(err);
                d.reject(err);
            });

            return d.promise;
        }

        function insertBlockToDeal(dealId, superblockId, prevBlockId) {
            var d = $q.defer();
            var url = api + '/' + dealId + '/blocks';

            var data = {
                "block": {
                    "super_block_id": superblockId,
                    "prev_block_id": prevBlockId
                }
            };

            $http.post(url, data).then(function(resp) {
                d.resolve(resp.data);
            }).catch(function(err) {
                $log.log(err);
                d.reject(err);
            });
            return d.promise;
        }

        function getDealImages(dealId) {
            var d = $q.defer();

            var url = api + '/' + dealId + '/images';
            $http.get(url).then(function(resp) {
                d.resolve(resp.data.images);
            }).catch(function(err) {
                $log.log(err);
                d.reject(err);
            });

            return d.promise;
        }

        function getDealVideos(dealId) {
            var d = $q.defer();

            var url = api + '/' + dealId + '/videos';
            $http.get(url).then(function(resp) {
                d.resolve(resp.data.videos);
            }).catch(function(err) {
                $log.log(err);
                d.reject(err);
            });

            return d.promise;
        }

        function getActiveStandardDiscounts(dealId) {
            var d = $q.defer();
            var url = api + '/' + dealId + '/discounts/active';

            $http.get(url).then(function(resp) {
                var discounts = [];
                discounts.push(resp.data);
                angular.forEach(discounts, function(discount, index) {
                    discounts[index]['discount_type'] = 'standard';
                    discounts[index]['status'] = 'active';

                    if (discount.is_percentage) {
                        discounts[index]['value_type'] = 'percentage';
                    } else if (discount.is_unit) {
                        discounts[index]['value_type'] = 'unit';
                    }
                });
                d.resolve(discounts);
            }).catch(function(err) {
                $log.log(err);
                if (err.status == 404) {
                    d.resolve([]);
                } else {
                    d.reject(err);
                }
            });

            return d.promise;
        }

        function getTemplateTypes() {
            var d = $q.defer();

            if (service.templateTypes.length > 0) {
                d.resolve(service.templateTypes);
            } else {
                var url = CONST.api_domain + '/templates/types';
                $http.get(url).then(function(resp) {
                    service.templateTypes = resp.data.template_types;
                    d.resolve(resp.data.template_types);
                }).catch(function(err) {
                    $log.log(err);
                    d.reject(err);
                });
            }

            return d.promise;
        }

        function getTemplateNames() {
            var d = $q.defer();

            if (service.templateNames.length > 0) {
                d.resolve(service.templateNames);
            } else {
                var url = CONST.api_domain + '/templates/names';
                $http.get(url).then(function(resp) {
                    service.templateNames = resp.data.template_names;
                    d.resolve(resp.data.template_names);
                }).catch(function(err) {
                    $log.log(err);
                    d.reject(err);
                });
            }

            return d.promise;
        }

        function getTemplates(dealId) {
            var url = api + '/' + dealId + '/templates';
            var d = $q.defer();

            $http.get(url).then(function(resp) {
                var templates = resp.data.templates;

                angular.forEach(templates, function(template, index) {
                    if (template.is_archived) {
                        template['status'] = 'archived';
                    } else if (template.is_draft) {
                        template['status'] = 'draft';
                    } else if (template.is_published) {
                        template['status'] = 'published';
                    } else {
                        template['status'] = 'draft';
                    }
                });
                d.resolve(templates);
            }).catch(function(err) {
                $log.log(err);
                d.reject(err);
            });

            return d.promise;
        }

        function getVariants(dealId) {
            var url = api + '/' + dealId + '/variants';
            var d = $q.defer();

            $http.get(url).then(function(resp) {
                var variants = resp.data.variants;
                d.resolve(variants);
            }).catch(function(err) {
                $log.log(err);
                d.reject(err);
            });

            return d.promise;
        }

        function find(id) {
            var d = $q.defer();
            var url = api + '/' + id;
            $http({
                    method: 'GET',
                    url: url,
                    //params: {id: id}
                })
                .then(function(data) {
                    var deal = data.data;
                    d.resolve(deal);
                })
                .catch(function(error) {
                    service.errors = error;
                    d.reject(error);
                });

            return d.promise;
        }

        function search(query, deal_type, status, ignore_status, page, limit) {
            var d = $q.defer();
            var q = query.toLowerCase().trim();

            var url = api + '?query=' + encodeURI(q) + '&deal_type=' + deal_type + '&status=' + status + '&ignore_status=' + ignore_status + '&page=' + page + '&limit=' + limit;

            $http.get(url).then(function(resp) {

                var tasks = [];

                var result = resp.data;
                angular.forEach(result.deals, function(deal, index) {

                    result.deals[index]["price"] = parseFloat(deal.price);
                    result.deals[index]["amazon_rating"] = parseFloat(deal.amazon_rating);

                    var dateStart = HelperService.convertToDateTime(deal.starts_at);
                    var dateEnd = HelperService.convertToDateTime(deal.ends_at);
                    result.deals[index]['date_start'] = dateStart;
                    result.deals[index]['date_end'] = dateEnd;

                    result.deals[index]['date_starts'] = dateStart.date;
                    result.deals[index]['time_starts'] = dateStart.time;

                    result.deals[index]['date_ends'] = dateEnd.date;
                    result.deals[index]['time_ends'] = dateEnd.time;

                    if (deal.is_draft) {
                        result.deals[index]['status'] = 'draft';
                    } else if (deal.is_published) {
                        result.deals[index]['status'] = 'published';
                    } else if (deal.is_hidden) {
                        result.deals[index]['status'] = 'hidden';
                    } else if (deal.is_archived) {
                        result.deals[index]['status'] = 'archived';
                    } else if (deal.is_pending) {
                        result.deals[index]['status'] = 'pending';
                    } else if (deal.is_approved) {
                        result.deals[index]['status'] = 'approved';
                    } else if (deal.is_rejected) {
                        result.deals[index]['status'] = 'rejected';
                    } else {
                        result.deals[index]['status'] = 'draft';
                    }

                    if (deal.is_upsell) {
                        result.deals[index]['deal_type'] = 'upsell';
                    } else {
                        result.deals[index]['deal_type'] = 'standard';
                    }

                    tasks.push(function(cb) {

                        BrandService.getById(deal.brand_id).then(function(brand) {
                            result.deals[index]['brand'] = brand;
                            cb(null, brand);
                        }).catch(function(err) {
                            result.deals[index]['brand'] = null;
                            cb(null, null);
                        });

                    });

                });

                async.parallel(tasks, function(error, results) {
                    if (error) {
                        $log.log(error);
                        d.reject(error);
                    } else {
                        d.resolve(result);
                    }

                });

            }).catch(function(err) {
                $log.log(err);
                d.reject(err);
            });

            return d.promise;
        }

        function getById(id) {
            var d = $q.defer();
            var url = api + '/' + id;

            $http({
                    method: 'GET',
                    url: url,
                })
                .then(function(data) {
                    var deal = data.data;
                    deal["price"] = parseFloat(deal.price);
                    deal["amazon_rating"] = parseFloat(deal.amazon_rating);

                    var dateStart = HelperService.convertToDateTime(deal.starts_at);
                    var dateEnd = HelperService.convertToDateTime(deal.ends_at);
                    deal['date_start'] = dateStart;
                    deal['date_end'] = dateEnd;

                    deal['date_starts'] = dateStart.date;
                    deal['time_starts'] = dateStart.time;

                    deal['date_ends'] = dateEnd.date;
                    deal['time_ends'] = dateEnd.time;

                    if (deal.is_draft) {
                        deal['status'] = 'draft';
                    } else if (deal.is_published) {
                        deal['status'] = 'published';
                    } else if (deal.is_hidden) {
                        deal['status'] = 'hidden';
                    } else if (deal.is_archived) {
                        deal['status'] = 'archived';
                    } else if (deal.is_pending) {
                        deal['status'] = 'pending';
                    } else if (deal.is_approved) {
                        deal['status'] = 'approved';
                    } else if (deal.is_rejected) {
                        deal['status'] = 'rejected';
                    } else {
                        deal['status'] = 'draft';
                    }

                    if (deal.is_upsell) {
                        deal['deal_type'] = 'upsell';
                    } else {
                        deal['deal_type'] = 'standard';
                    }

                    BrandService.getById(deal.brand_id).then(function(brand) {
                        deal['brand'] = brand;
                    }).catch(function(err) {
                        $log.log(err);
                        deal['brand'] = null;
                    }).then(function() {
                        CategoryService.findInList(deal.category_id).then(function(category) {
                            deal['category'] = category;
                        }).catch(function(err) {
                            $log.log(err);
                            deal['category'] = null;
                        }).then(function() {
                            if (deal.is_standard) {
                                getUpsellAssociations(deal.uid).then(function(assocs) {
                                    deal.upsell_associations = assocs;
                                }).catch(function(err) {
                                    $log.log(err);
                                    deal.upsell_associations = [];
                                }).then(function() {
                                    d.resolve(deal);
                                });
                            } else {
                                deal.upsell_associations = [];
                                d.resolve(deal);
                            }
                        });
                    });
                })
                .catch(function(error) {
                    $log.log(error);
                    d.reject(error);
                });

            return d.promise;
        }

        function addTemplates(deal_id, templates) {
            var d = $q.defer();

            var url = api + '/' + deal_id + '/templates';

            var tasks = [];

            angular.forEach(templates, function(template, index) {
                if (angular.isDefined(template.name) && template.name.trim() != '') {
                    tasks.push(function(cb) {
                        template['templatable_id'] = deal_id;

                        var data = {
                            template: template
                        };

                        $http.post(url, data).then(function(resp) {
                            cb(null, resp);
                        }).catch(function(err) {
                            $log.log(err);
                            cb(err);
                        });

                    });
                }

            });

            async.parallel(tasks, function(error, results) {
                if (error) {
                    $log.log(error);
                    d.reject('template');
                } else {
                    d.resolve(results);
                }

            });

            return d.promise;
        }

        function getUpsellDeals(vendor_id) {
            var d = $q.defer();

            var url = api + '?query=&deal_type=upsell&status=&ignore_status=archived&vendor_id=' + vendor_id + '&page=1&limit=500';
            $http.get(url).then(function(resp) {
                d.resolve(resp.data.deals);
            }).catch(function(err) {
                $log.log(err);
                d.reject(err);
            });

            return d.promise;
        }

        function getUpsellAssociations(dealId) {
            var d = $q.defer();
            var url = api + '/' + dealId + '/upsells';
            $http.get(url).then(function(resp) {
                var associations = [];
                angular.forEach(resp.data.upsell_associations, function(assoc, index) {
                    associations.push(assoc.upsell_id);
                });
                d.resolve(associations);
            }).catch(function(err) {
                $log.log(err);
                d.reject(err);
            });
            return d.promise;
        }

        function addDiscounts(deal_id, discounts) {
            var d = $q.defer();

            var url = api + '/' + deal_id + '/discounts';
            var tasks = [];

            angular.forEach(discounts, function(discount, index) {
                if (angular.isDefined(discount.value) && discount.value.trim() != '') {
                    tasks.push(function(cb) {
                        $log.log(discount);
                        $http.post(url, {discount:discount})
                            .then(function(resp) {
                                cb(null, resp);
                            }).catch(function(err) {
                                $log.log(err);
                                cb(err);
                            });

                    });
                }

            });

            async.parallel(tasks, function(error, results) {
                if (error) {
                    $log.log(error);
                    d.reject(error);
                } else {
                    $log.log(results);
                    d.resolve(results);
                }

            });

            return d.promise;
        }

        function updateUpsellAssociations(dealId, associations) {
            var d = $q.defer();
            var url = api + '/' + dealId + '/upsells';

            var data = {
                deal: {
                    upsell_associations: []
                }
            };

            angular.forEach(associations, function(uid, index) {
                data.deal.upsell_associations.push({upsell_id: uid});
            });

            $http.patch(url, data).then(function(resp) {
                d.resolve(resp);
            }).catch(function(err) {
                $log.log(err);
                d.reject(err);
            });

            return d.promise;
        }

        function addFileImage(dealId, file) {
            var d = $q.defer();
            var url = api + '/' + dealId + '/images';

            var filebase64 = 'data:' + file.file.filetype + ';base64,' + file.file.base64;

            var data = {

                image: {
                    file: filebase64,
                    description: file.description
                }

            };

            $http.post(url, data).then(function(resp) {
                d.resolve(resp);
            }).catch(function(err) {
                d.reject(err);
            });

            return d.promise;
        }


        function doDealVideo(action, dealId, video, cb) {
            var d = $q.defer();
            var url = api + '/' + dealId + '/videos/';
            if(action == 'delete'){
                $http.delete(url + video.uid)
                    .then(function(resp) {
                        cb(null, resp);
                    }).catch(function(err) {
                        $log.log(err);
                        cb(err);
                    });
            }
            else {
                if(!/<iframe [\s\S]*youtube[\s\S]*><\/iframe>/i.test(video.embedded_content)){
                    // d.resolve(false);
                    // return d.$promise;
                    cb(null, true);
                    return;
                }

                var data = {

                    video: {
                        title: video.title,
                        description: video.description,
                        source_type: video.source_type,
                        embedded_content: video.embedded_content,
                        attachment: video.attachment
                    }

                };

                if(angular.isObject(video.image_attributes.file)){
                    var filebase64 = 'data:' + video.image_attributes.file.filetype + ';base64,' + video.image_attributes.file.base64;
                    data.video.image_attributes = {
                        description: video.image_attributes.description,
                        file: filebase64
                    };
                }
            }

            if(action == 'add'){
                $http.post(url, data)
                .then(function(resp) {
                    cb(null, resp);
                }).catch(function(err) {
                    $log.log(err);
                    cb(err);
                });
            } else if(action == 'edit') {
                if(video.modified == true){
                    $http.patch(url + video.uid, data)
                    .then(function(resp) {
                        cb(null, resp);
                    }).catch(function(err) {
                        $log.log(err);
                        cb(err);
                    });
                } else {
                    // d.resolve(false);
                    // return d.promise;
                    cb(null, true);
                    return;
                }
            }
        }

        function add(data) {
            var url = api;
            var d = $q.defer();

            $http.post(url, data)
                .then(function(resp) {
                    var dealId = resp.data.uid;

                    var tasks = [];

                    // upsell associations
                    if (data.deal_type == 'standard') {
                        tasks.push(function(cb) {
                            updateUpsellAssociations(dealId, data.upsell_associations).then(function(resp) {
                                cb(null, resp);
                            }).catch(function(err) {
                                $log.log(err);
                                cb(err);
                            });
                        });
                    }

                    if (data.file.length > 0) {
                        angular.forEach(data.file, function(img, index) {

                            if (angular.isObject(img.file)) {
                                tasks.push(function(cb) {
                                    addFileImage(dealId, img).then(function(resp) {
                                        cb(null, resp);
                                    }).catch(function(err) {
                                        $log.log(err);
                                        cb(err);
                                    });
                                });
                            }

                        });
                    }

                    if (data.videos.length > 0) {
                        angular.forEach(data.videos, function(video, index) {

                            if (/<iframe [\s\S]*youtube[\s\S]*><\/iframe>/i.test(video.embedded_content)) {
                                tasks.push(function(cb) {
                                    doDealVideo('add', dealId, video, cb);
                                });
                            }

                        });
                    }

                    if (data.variants.length > 0) {
                        tasks.push(function(cb) {
                            $http.post(api + '/' + dealId + '/variants/collection', {variant:{variants:data.variants}})
                                .then(function(resp) {
                                    cb(null, resp);
                                }).catch(function(err) {
                                    $log.log(err);
                                    cb(err);
                                });
                        });
                    }

                    // if (angular.isDefined(data.templates[0]) && angular.isDefined(data.templates[0].name) && data.templates[0].name.trim() != '' && data.templates[0].name.trim() != 'null') {
                    //     tasks.push(function(cb) {
                    //         addTemplates(dealId, data.templates).then(function(resp) {
                    //             cb(null, resp);
                    //         }).catch(function(err) {
                    //             $log.log(err);
                    //             cb(err);
                    //         });
                    //     });
                    // }

                    if (angular.isDefined(data.discount) && data.discount != null) {
                        tasks.push(function(cb) {
                            addDiscounts(dealId, [data.discount]).then(function(resp) {
                                cb(null, resp);
                            }).catch(function(err) {
                                $log.log(err);
                                cb(err);
                            });
                        });
                    }

                    if (tasks.length > 0) {
                        async.parallel(tasks, function(error, results) {
                            if (error) {
                                $log.log(error);
                                d.reject(error);
                            } else {
                                d.resolve(dealId);
                            }

                        });
                    } else {
                        d.resolve(dealId);
                    }

                }).catch(function(error) {
                    $log.log(error);
                    d.reject(error);
                });

            return d.promise;
        }

        function edit(id, data) {
            var url = api + "/" + id;
            var d = $q.defer();

            var tasks = [];
            var tasksSeries = [];

            // UPSELL ASSOCIATIONS
            if (data.form.deal_type == 'standard') {
                tasks.push(function(cb) {
                    updateUpsellAssociations(id, data.form.upsell_associations).then(function(resp) {
                        cb(null, resp);
                    }).catch(function(err) {
                        $log.log(err);
                        cb(err);
                    });
                });
            }

            //IMAGE ADD
            if (angular.isDefined(data.form.file)) {

                angular.forEach(data.form.file, function(img, index) {
                    if (angular.isObject(img.file) && angular.isDefined(img.file.filetype)) {

                        tasks.push(function(cb) {
                            addFileImage(id, img)
                                .then(function(resp) {
                                    cb(null, resp);
                                }).catch(function(err) {
                                    $log.log(err);
                                    cb(err);
                                });
                        });
                    }

                });
            }

            //IMAGE DELETE
            if (angular.isDefined(data.removedImages)) {
                angular.forEach(data.removedImages, function(image, index) {
                    tasks.push(function(cb) {
                        $http.delete(api + '/' + id + '/images/' + image.uid)
                            .then(function(resp) {
                                cb(null, resp);
                            }).catch(function(err) {
                                cb(err);
                            });
                    });
                });

            }

            //IMAGE EDIT
            if (angular.isDefined(data.images)) {

                angular.forEach(data.images, function(img, index) {
                    if (angular.isObject(img.file) && angular.isDefined(img.file.filetype)) {
                        var filebase64 = 'data:' + img.file.filetype + ';base64,' + img.file.base64;

                        var data = {
                            image: {
                                file: filebase64,
                                description: img.description
                            }
                        }

                        tasks.push(function(cb) {
                            $http.patch(api + '/' + id + '/images/' + img.uid, data)
                                .then(function(resp) {
                                    cb(null, resp);
                                }).catch(function(err) {
                                    $log.log(err);
                                    cb(err);
                                });
                        });
                    }

                });
            }

            //VIDEO EDIT
            if (angular.isDefined(data.videos)) {
                angular.forEach(data.videos, function(video, index) {
                    tasks.push(function(cb) {
                        doDealVideo('edit', id, video, cb);
                    });
                });
            }


            //VIDEO ADD
            if (angular.isDefined(data.form.videos)) {

                angular.forEach(data.form.videos, function(video, index) {

                    tasks.push(function(cb) {
                        doDealVideo('add', id, video, cb);
                    });

                });
            }

            //VIDEO DELETE
            if (angular.isDefined(data.removedVideos)) {
                angular.forEach(data.removedVideos, function(video, index) {
                    tasks.push(function(cb) {
                        doDealVideo('delete', id, video, cb);
                    });
                });

            }

            tasksSeries.push(function(cb) {
                $http.patch(url, data.form).then(function(resp) {
                    cb(null, resp);
                }).catch(function(err) {
                    $log.log(err);
                    cb(err);
                });
            });

            tasksSeries.push(function(cb) {
                async.parallel(tasks, function(err, results) {
                    if (err) {
                        cb(err);
                    } else {
                        cb(null, results);
                    }
                });
            });

            //DISCOUNT UPDATE
            if (angular.isDefined(data.discount) && data.discount != null) {
                tasksSeries.push(function(cb) {
                    $http.patch(url + '/discounts/' + data.discount.uid, {discount:data.discount}).then(function(resp) {
                        cb(null, resp);
                    }).catch(function(err) {
                        $log.log(err);
                        cb(err);
                    });
                });
            }
            //DISCOUNT ADD
            if (angular.isDefined(data.form.discount) && data.form.discount != null) {
                tasksSeries.push(function(cb) {

                    $http.post(url + '/discounts', {discount:data.form.discount})
                        .then(function(resp) {
                            cb(null, resp);
                        }).catch(function(err) {
                            $log.log(err);
                            cb(err);
                        });
                });
            }

            //TEMPLATE DELETE
            if (angular.isDefined(data.removedTemplates) && data.removedTemplates.length > 0) {
                angular.forEach(data.removedTemplates, function(val, index) {
                    tasksSeries.push(function(cb) {
                        $http.delete(url + '/templates/' + val.uid).then(function(resp) {
                            cb(null, resp);
                        }).catch(function(err) {
                            $log.log(err);
                            cb(err);
                        });
                    });
                });
            }
            //TEMPLATE UPDATE
            var publishedTemplate = null;
            if (angular.isDefined(data.templates) && data.templates.length > 0) {
                angular.forEach(data.templates, function(template, index) {
                    if (template.status == 'published') {
                        publishedTemplate = template;
                    } else {
                      tasksSeries.push(function(cb) {
                          template['templatable_id'] = id;

                          var data = {
                              template: template
                          };

                          $http.patch(url + '/templates/' + template.uid, data).then(function(resp) {
                              cb(null, resp);
                          }).catch(function(err) {
                              $log.log(err);
                              cb(err);
                          });
                      });
                    }
                });
            }
            // push published template at last
            if (publishedTemplate != null) {
              tasksSeries.push(function(cb) {
                  publishedTemplate['templatable_id'] = id;

                  var data = {
                      template: publishedTemplate
                  };

                  $http.patch(url + '/templates/' + publishedTemplate.uid, data).then(function(resp) {
                      cb(null, resp);
                  }).catch(function(err) {
                      $log.log(err);
                      cb(err);
                  });
              });
            }
            //TEMPLATE ADD
            if (angular.isDefined(data.form.templates) && data.form.templates.length > 0) {
                angular.forEach(data.form.templates, function(template, index) {
                    if (angular.isDefined(template.name) && template.name.trim() != '') {
                        tasksSeries.push(function(cb) {
                            template['templatable_id'] = id;

                            var data = {
                                template: template
                            };

                            $http.post(api + '/' + id + '/templates', data)
                                .then(function(resp) {
                                    cb(null, resp);
                                }).catch(function(err) {
                                    $log.log(err);
                                    cb(err);
                                });
                        });
                    }

                });
            }

            //VARIANT DELETE
            if (angular.isDefined(data.removedVariants) && data.removedVariants.length > 0) {
                angular.forEach(data.removedVariants, function(val, index) {
                    tasksSeries.push(function(cb) {
                        $http.delete(url + '/variants/' + val.uid).then(function(resp) {
                            cb(null, resp);
                        }).catch(function(err) {
                            $log.log(err);
                            cb(err);
                        });
                    });
                });
            }
            //VARIANT UPDATE
            if (angular.isDefined(data.variants) && data.variants.length > 0) {
                angular.forEach(data.variants, function(variant, index) {
                    tasksSeries.push(function(cb) {
                        $http.patch(url + '/variants/' + variant.uid, variant).then(function(resp) {
                            cb(null, resp);
                        }).catch(function(err) {
                            $log.log(err);
                            cb(err);
                        });
                    });
                });
            }
            //VARIANT ADD
            if (angular.isDefined(data.form.variants) && data.form.variants.length > 0) {
                tasksSeries.push(function(cb) {
                    $http.post(url + '/variants/collection', {variant:{variants:data.form.variants}})
                        .then(function(resp) {
                            cb(null, resp);
                        }).catch(function(err) {
                            $log.log(err);
                            cb(err);
                        });
                });
            }

            //DISCOUNT only
            async.series(tasksSeries, function(err, results) {
                if (err) {
                    $log.log(err);
                    d.reject(err);
                } else {
                    d.resolve(results);
                }
            });


            return d.promise;
        }

        function _delete(id) {
            var url = api + "/" + id;
            var d = $q.defer();

            $http.delete(url, {})
                .then(function(resp) {
                    d.resolve(resp);
                }).catch(function(error) {
                    $log.log(error);
                    d.reject(error);
                });

            return d.promise;
        }

        function approve(dealId){
            var url = api + '/' + dealId + '/approve';
            var d = $q.defer();

            $http.patch(url, {}).then(function(resp) {
                d.resolve(resp);
            }).catch(function(err) {
                $log.log(err);
                d.reject(err);
            });

            return d.promise;
        }

        function reject(dealId, body){
            var url = api + '/' + dealId + '/reject';
            var d = $q.defer();

            $http.patch(url, body).then(function(resp) {
                d.resolve(resp);
            }).catch(function(err) {
                $log.log(err);
                d.reject(err);
            });

            return d.promise;
        }

        function vendorDeals(id){
            var d = $q.defer();
            var url = api + "/?vendor_id=" + id;
            $http({
                    method: 'GET',
                    url: url
                })
                .then(function(data) {
                    var deal = data.data;
                    d.resolve(deal);
                })
                .catch(function(error) {
                    service.errors = error;
                    d.reject(error);
                });

            return d.promise;
        }

        function publishBlocks(dealId){
            var url = api + '/' + dealId + '/publish_blocks';
            var d = $q.defer();

            $http.post(url, {}).then(function(resp) {
                d.resolve(resp);
            }).catch(function(err) {
                $log.log(err);
                d.reject(err);
            });

            return d.promise;
        }
    }

})();
