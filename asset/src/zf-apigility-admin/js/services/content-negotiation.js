(function() {
  'use strict';

angular.module('ag-admin').factory('ContentNegotiationResource', function ($http, $q, flash, apiBasePath) {

    var servicePath = apiBasePath + '/content-negotiation';
    var selectors;

    return {
      prepareSelector: function (selector) {
        var data = {
          content_name: selector.content_name
        };

        angular.forEach(selector.selectors, function (value, key) {
          data[key] = value;
        });

        return data;
      },

      getList: function (force) {
        force = !!force;

        if (! force &&
            ((Array.isArray(selectors) && selectors.length > 0)  ||
              typeof(selectors) === 'object')) {
            return $q.when(selectors);
        }

        return $http({method: 'GET', url: servicePath}).then(
          function success(response) {
            selectors = response.data._embedded.selectors;
            return selectors;
          },
          function error() {
            flash.error = 'Unable to fetch content negotiation selectors; you may need to reload the page';
          }
        );
      },

      createSelector: function (selector) {
        return $http({
          method: 'POST',
          url: servicePath,
          data: this.prepareSelector(selector)
        }).then(
          function success(response) {
            return response.data;
          },
          function error(response) {
            flash.error = 'Unable to create selector; please try again';
            return response;
          }
        );
      },

      updateSelector: function (selector) {
        var updatePath = servicePath + '/' + encodeURIComponent(selector.content_name);

        var data = this.prepareSelector(selector);
        delete data.content_name;

        return $http({
          method: 'PATCH',
          url: updatePath,
          data: data
        }).then(
          function success(response) {
            return response.data;
          },
          function error(response) {
            flash.error = 'Unable to create selector; please try again';
            return response;
          }
        );
      },

      removeSelector: function (selectorName) {
        var updatePath = servicePath + '/' + encodeURIComponent(selectorName);

        return $http({
          method: 'DELETE',
          url: updatePath
        }).then(
          function success(response) {
            return response.data;
          },
          function error(response) {
            flash.error = 'Unable to remove selector; please try again';
            return response;
          }
        );
      }
    };
  }
);

})();
