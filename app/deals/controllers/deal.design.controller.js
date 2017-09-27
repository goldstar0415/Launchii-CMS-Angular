(function() {
	'use strict';

	angular.module('app.deals')
		.controller('DealDesignController', DealDesignController);

	DealDesignController.$inject = ['DealService',
									'$timeout',
									'$window',
									'$stateParams',
									'$rootScope',
									'$scope',
									'$log',
									'prepSelDeal',
									'prepDealType',
									'$q',
									'prepAllSuperBlocks',
									'prepDealBlocks',
									'froalaS3Info'];

	/* @ngInject */
	function DealDesignController(DealService,
								  $timeout,
								  $window,
								  $stateParams,
								  $rootScope,
								  $scope,
								  $log,
								  prepSelDeal,
								  prepDealType,
								  $q,
								  prepAllSuperBlocks,
								  prepDealBlocks,
							  	  froalaS3Info) {

		var vm = this;

		vm.dealType = prepDealType;
		vm.dealId = $stateParams.id;
		vm.isOperating = false;
		vm.currentOperation = 0;	// 0 - no operation, 1 - resetting, 2 - deleting, 3 - sort up, 4 -  sort down
		vm.operatingBlockId = null;	// deal block id which the operation is in progress for.
		vm.superBlocks = prepAllSuperBlocks.super_blocks;
		vm.dealBlocks = prepDealBlocks.blocks;
		vm.isSuperBlockPopoverOpen = false;
		vm.response = {};

		vm.deleteDealBlock = deleteDealBlock;
		vm.sortDealBlockByUp = sortDealBlockByUp;
		vm.sortDealBlockByDown = sortDealBlockByDown;
		vm.resetDealBlock = resetDealBlock;
		vm.updateDealBlock = updateDealBlock;
		vm.superBlockDragStart = superBlockDragStart;
		vm.dropSuperBlockCallback = dropSuperBlockCallback;

		vm.froalaS3Info = froalaS3Info.result;
		vm.froalaOptions = {
            toolbarInline: true,
			imageUploadToS3: {
				bucket: vm.froalaS3Info.bucket,
				region: 's3-' + vm.froalaS3Info.region,
				keyStart: 'uploads/',
				params: {
					acl: 'public-read',
					AWSAccessKeyId: vm.froalaS3Info.aws_access_key_id,
					policy: vm.froalaS3Info.policy,
					signature: vm.froalaS3Info.signature
				}
			},
			videoUploadToS3: {
				bucket: vm.froalaS3Info.bucket,
				region: 's3-' + vm.froalaS3Info.region,
				keyStart: 'uploads/',
				params: {
					acl: 'public-read',
					AWSAccessKeyId: vm.froalaS3Info.aws_access_key_id,
					policy: vm.froalaS3Info.policy,
					signature: vm.froalaS3Info.signature
				}
			},
			requestWithCORS: true,
			toolbarVisibleWithoutSelection: true,
			disableRightClick: true,
			pluginsEnabled: [
				'align', 'codeBeautifier', 'colors', 'entities', 'fontFamily', 'fontSize', 'image', 'link',
				'inlineStyle', 'lineBreaker', 'lists', 'paragraphFormat', 'paragraphStyle', 'quote', 'table', 'video'],
			toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript',
							 '|', 'fontFamily', 'fontSize', 'color', 'inlineStyle', 'paragraphStyle', 'paragraphFormat',
							 '-', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote',
							 'insertHR', 'selectAll', 'clearFormatting', '|', 'undo', 'redo'],
			toolbarButtonsSM: ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript',
							   '-', 'fontFamily', 'fontSize', 'color', 'inlineStyle', 'paragraphStyle', 'paragraphFormat',
							   '-', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote',
 							   '-', 'insertHR', 'selectAll', 'clearFormatting', '|', 'undo', 'redo'],
			toolbarButtonsXS: ['bold', 'italic', 'underline', 'strikeThrough',
							   '-', 'subscript', 'superscript', 'fontFamily', 'fontSize',
							   '-', 'color', 'inlineStyle', 'paragraphStyle', 'paragraphFormat',
							   '-', 'align', 'formatOL', 'formatUL', 'outdent',
							   '-', 'indent', 'quote', 'insertHR', 'selectAll',
							   '-', 'clearFormatting', '|', 'undo', 'redo'],
			imageMove: false,
			imagePaste: false,
			imageResize: false,
            imageMaxSize: 1024 * 1024 * 5,
			imageAllowedTypes: ['jpeg', 'jpg', 'png'],
			imageEditButtons: ['imageReplace', 'imageAlt'],
			imageInsertButtons: ['imageBack', '|', 'imageUpload'],
			videoMove: false,
			videoResize: false,
			videoEditButtons: ['videoReplace'],
			videoInsertButtons: ['videoBack', '|', 'videoUpload'],
			tableInsertHelper: false,
			tableEditButtons: ['tableHeader', '|', 'tableRows', 'tableColumns', 'tableStyle', 'tableCells', '-',
							   'tableCellBackground', 'tableCellVerticalAlign', 'tableCellHorizontalAlign', 'tableCellStyle'],
			linkEditButtons: ['linkOpen', 'linkStyle', 'linkEdit'],
			linkText: true,
			events:{
                'froalaEditor.image.error' : function (e, editor, error, response) {
				    var $popup = editor.popups.get('image.insert');
                    var $layer = $popup.find('.fr-image-progress-bar-layer');
                    var message = (error.message) ? error.message : 'Something went wrong!';
                    $layer.find('h3').text(message);
                },
				'froalaEditor.image.beforePasteUpload' : function(e, editor, img) {
					return false;
				},
				'froalaEditor.image.beforeRemove' : function(e, editor, $img) {
					return false;
				},
				'froalaEditor.video.beforeRemove' : function(e, editor, $video) {
					return false;
				},
				'froalaEditor.link.beforeInsert' : function(e, editor, link, text, attrs) {
					return false;
				}
            }
        };


        if ($window.__env.apiUrl.toLowerCase().indexOf('stageapi') > -1) {
          vm.customerHost = 'http://staging.launchii.com';
        } else {
          vm.customerHost = 'http://www.launchii.com';
        }

        vm.deal = prepSelDeal;
        vm.publishToLive = publishToLive;

		activate();

		////////////////

		function activate() {
		    updateBreadCrumb();
		    sortDealBlocks();
		}

		function resetDealBlock(dealBlock) {
			if (vm.isOperating) {
				return;
			}
			vm.isOperating = true;
			vm.currentOperation = 1;
			vm.operatingBlockId = dealBlock.uid;
			DealService.resetDealBlock(vm.dealId, dealBlock.uid).then(function(block){
				dealBlock.content = block.content;
				vm.isOperating = false;
				vm.currentOperation = 0;
				vm.operatingBlockId = null;
			}).catch(function(err) {
				vm.response['success'] = "alert-danger";
                vm.response['alert'] = "Error!";
				if (vm.dealType == 'upsell') {
                	vm.response['msg'] = "Failed to reset upsell block.";
				} else {
					vm.response['msg'] = "Failed to reset deal block.";
				}
				vm.response['error_arr'] = err.data == null ? ['Unknown error.'] : err.data.errors;
				$timeout(function() {
                    vm.response.msg = null;
                }, 3000);
				vm.isOperating = false;
				vm.currentOperation = 0;
				vm.operatingBlockId = null;
			});
		}

		function sortDealBlockByDown(dealBlock) {
			if (vm.isOperating) {
				return;
			}
			vm.isOperating = true;
			vm.currentOperation = 4;
			vm.operatingBlockId = dealBlock.uid;
			DealService.sortDealBlockByDown(vm.dealId, dealBlock.uid).then(function(resp){
				var updatedBlocks = resp.blocks;
				angular.forEach(updatedBlocks, function(updatedBlock, updatedIndex) {
					angular.forEach(vm.dealBlocks, function(dealBlock, dealBlockIndex) {
						if (updatedBlock.uid == dealBlock.uid) {
							vm.dealBlocks[dealBlockIndex] = updatedBlock;
						}
					})
				});
				sortDealBlocks();
				scrollToDealBlock(dealBlock.uid);
				vm.isOperating = false;
				vm.currentOperation = 0;
				vm.operatingBlockId = null;
			}).catch(function(err) {
				vm.response['success'] = "alert-danger";
                vm.response['alert'] = "Error!";
				if (vm.dealType == 'upsell') {
                	vm.response['msg'] = "Failed to sort down upsell block.";
				} else {
					vm.response['msg'] = "Failed to sort down deal block.";
				}
				vm.response['error_arr'] = err.data == null ? ['Unknown error.'] : err.data.errors;
                $timeout(function() {
                    vm.response.msg = null;
                }, 3000);
				vm.isOperating = false;
				vm.currentOperation = 0;
				vm.operatingBlockId = null;
			});
		}

		function sortDealBlockByUp(dealBlock) {
			if (vm.isOperating) {
				return;
			}
			vm.isOperating = true;
			vm.currentOperation = 3;
			vm.operatingBlockId = dealBlock.uid;
			DealService.sortDealBlockByUp(vm.dealId, dealBlock.uid).then(function(resp){
				var updatedBlocks = resp.blocks;
				angular.forEach(updatedBlocks, function(updatedBlock, updatedIndex) {
					angular.forEach(vm.dealBlocks, function(dealBlock, dealBlockIndex) {
						if (updatedBlock.uid == dealBlock.uid) {
							vm.dealBlocks[dealBlockIndex] = updatedBlock;
						}
					})
				});
				sortDealBlocks();
				scrollToDealBlock(dealBlock.uid);
				vm.isOperating = false;
				vm.currentOperation = 0;
				vm.operatingBlockId = null;
			}).catch(function(err) {
				vm.response['success'] = "alert-danger";
                vm.response['alert'] = "Error!";
				if (vm.dealType == 'upsell') {
                	vm.response['msg'] = "Failed to sort up upsell block.";
				} else {
					vm.response['msg'] = "Failed to sort up deal block.";
				}
				vm.response['error_arr'] = err.data == null ? ['Unknown error.'] : err.data.errors;
                $timeout(function() {
                    vm.response.msg = null;
                }, 3000);
				vm.isOperating = false;
				vm.currentOperation = 0;
				vm.operatingBlockId = null;
			});
		}

		function deleteDealBlock(dealBlock, blockIndex) {
			if (vm.isOperating) {
				return;
			}
			// Store the next block id so that screen goes to next block after delete
			var nextBlockId = null;
			if (blockIndex < (vm.dealBlocks.length - 1)) {
				nextBlockId = vm.dealBlocks[blockIndex+1].uid;
			}

			vm.isOperating = true;
			vm.currentOperation = 2;
			vm.operatingBlockId = dealBlock.uid;
			DealService.deleteDealBlock(vm.dealId, dealBlock.uid).then(function(resp){
				// reload all deal blocks for sorting.
				DealService.getAllDealBlocks(vm.dealId).then(function(resp) {
					vm.dealBlocks = resp.blocks;
					sortDealBlocks();
					if (nextBlockId) {
						scrollToDealBlock(nextBlockId);
					}
					vm.isOperating = false;
					vm.currentOperation = 0;
					vm.operatingBlockId = null;
				}).catch(function(err) {
					vm.dealBlocks = [];
					vm.response['success'] = "alert-danger";
	                vm.response['alert'] = "Error!";
					if (vm.dealType == 'upsell') {
	                	vm.response['msg'] = "Failed to reload upsell blocks. Please refresh.";
					} else {
						vm.response['msg'] = "Failed to reload deal blocks. Please refresh.";
					}
					vm.response['error_arr'] = err.data == null ? ['Unknown error.'] : err.data.errors;
	                $timeout(function() {
	                    vm.response.msg = null;
	                }, 3000);
					vm.isOperating = false;
					vm.currentOperation = 0;
					vm.operatingBlockId = null;
				});
			}).catch(function(err) {
				vm.response['success'] = "alert-danger";
                vm.response['alert'] = "Error!";
				if (vm.dealType == 'upsell') {
                	vm.response['msg'] = "Failed to delete upsell block.";
				} else {
					vm.response['msg'] = "Failed to delete deal block.";
				}
				vm.response['error_arr'] = err.data == null ? ['Unknown error.'] : err.data.errors;
                $timeout(function() {
                    vm.response.msg = null;
                }, 3000);
				vm.isOperating = false;
				vm.currentOperation = 0;
				vm.operatingBlockId = null;
			});
		}

		function insertDealBlock(superBlockId, prevBlockId) {
			if (vm.isOperating) {
				return;
			}
			vm.isOperating = true;
			DealService.insertBlockToDeal(vm.dealId, superBlockId, prevBlockId).then(function(block){
				// reload all deal blocks for sorting.
				DealService.getAllDealBlocks(vm.dealId).then(function(resp) {
					vm.dealBlocks = resp.blocks;
					sortDealBlocks();
					scrollToDealBlock(block.uid);
					vm.isOperating = false;
				}).catch(function(err) {
					vm.dealBlocks = [];
					vm.response['success'] = "alert-danger";
	                vm.response['alert'] = "Error!";
					if (vm.dealType == 'upsell') {
	                	vm.response['msg'] = "Failed to reload upsell blocks. Please refresh.";
					} else {
						vm.response['msg'] = "Failed to reload deal blocks. Please refresh.";
					}
					vm.response['error_arr'] = err.data == null ? ['Unknown error.'] : err.data.errors;
	                $timeout(function() {
	                    vm.response.msg = null;
	                }, 3000);
					vm.isOperating = false;
				});
			}).catch(function(err) {
				vm.response['success'] = "alert-danger";
                vm.response['alert'] = "Error!";
				if (vm.dealType == 'upsell') {
					vm.response['msg'] = "Failed to insert upsell block.";
				} else {
					vm.response['msg'] = "Failed to insert deal block.";
				}
				vm.response['error_arr'] = err.data == null ? ['Unknown error.'] : err.data.errors;
                $timeout(function() {
                    vm.response.msg = null;
                }, 3000);
				vm.isOperating = false;
			});
		}

		function updateDealBlock(dealBlockId) {
			// get deal block object from id
			var dealBlock = null;
			angular.forEach(vm.dealBlocks, function(block, index) {
				if (block.uid == dealBlockId) {
					dealBlock = block;
				}
			});
			if (dealBlock == null) {
				return;
			}
			// update deal block
			DealService.updateDealBlock(vm.dealId, dealBlockId, dealBlock.content).then(function(resp){
			}).catch(function(err) {
				vm.response['success'] = "alert-danger";
                vm.response['alert'] = "Error!";
				if (vm.dealType == 'upsell') {
					vm.response['msg'] = "Failed to update upsell block.";
				} else {
					vm.response['msg'] = "Failed to update deal block.";
				}
				vm.response['error_arr'] = err.data == null ? ['Unknown error.'] : err.data.errors;
                $timeout(function() {
                    vm.response.msg = null;
                }, 3000);
			});
		}

		function sortDealBlocks() {
			if (vm.dealBlocks.length == 0) {
				return;
			}
			vm.dealBlocks.sort(function(a, b) {
				return (a.sorting < b.sorting ? -1 : (a.sorting > b.sorting ? 1 : 0));
			});

			$timeout(function() {
				unbindEditorEvents();
				bindEditorEvents();
			}, 0);
		}

		function superBlockDragStart(block) {
			vm.isSuperBlockPopoverOpen = false;
		}

		function dropSuperBlockCallback(index, item, external, type) {
			// Get previous block id for the new block to be inserted after
			var prevBlockId = null;
			if (index >= 1) {
				prevBlockId = vm.dealBlocks[index-1].uid;
			}
			// Get super block id to be inserted
			var superBlockId = item.uid;

			vm.dealBlocks.splice(index, 0, {is_in_insert: true, content: item.content});
			$timeout(function() {
				$scope.$apply();
			}, 0);

			insertDealBlock(item.uid, prevBlockId);
		}

		function bindEditorEvents() {
			$('.deal-block-editor').on('froalaEditor.blur', function (e, editor) {
				var blockId = e.currentTarget.dataset.blockId;
				updateDealBlock(blockId);
			});
		}

		function unbindEditorEvents() {
			$('.deal-block-editor').off('froalaEditor.blur');
		}

		function scrollToDealBlock(dealBlockId) {
			$timeout(function() {
				Element.prototype.documentOffsetTop = function() {
					return this.offsetTop + (this.offsetParent ? this.offsetParent.documentOffsetTop() : 0);
				};
				var elem = document.getElementById('dealBlock-' + dealBlockId);
				if (!elem) {
					return;
				}
				var top = elem.documentOffsetTop() - ($window.innerHeight / 2);
				$window.scrollTo(0, top);
			}, 100);
		}

		function updateBreadCrumb(){
			var bread_crumb_elem = {name: prepSelDeal.name, state: ''};
			$rootScope.crumbs.push(bread_crumb_elem);
		}

		function publishToLive(){
			// update deal block
			DealService.publishBlocks(vm.dealId).then(function(resp){
				$window.location.reload();
			}).catch(function(err) {
				vm.response['success'] = "alert-danger";
                vm.response['alert'] = "Error!";
				vm.response['msg'] = "Failed to update upsell block.";
				vm.response['msg'] = "Failed to update deal block.";
				vm.response['error_arr'] = err.data == null ? ['Unknown error.'] : err.data.errors;
                $timeout(function() {
                    vm.response.msg = null;
                }, 3000);
			});
		}
	}
})();
