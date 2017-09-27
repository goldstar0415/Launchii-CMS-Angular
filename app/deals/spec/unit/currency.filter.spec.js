(function() {
    'use strict';

    describe('Currency format filter', function() {
        var $filter;

        beforeEach(angular.mock.module('app.deals'));

        beforeEach(inject(function(_$filter_) {
            // The injector unwraps the underscores (_) from around the parameter names when matching
            $filter = _$filter_;
        }));

        it('should convert to currency format', function() {
            var input = 12.039592930;
            var res = 0.0;

            res = $filter('toCurrencyFormat')(input);

            expect(res).toEqual('$ 12.04');
        });

    });
})();