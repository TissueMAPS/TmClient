angular.module('tmaps.ui')
.directive("tmSelectionSettings", function() {
    return {
        restrict: 'E',
        scope: {
            viewport: '='
        },
        bindToController: true,
        controllerAs: 'selCtrl',
        controller: 'SelectionSettingsCtrl',
        templateUrl: '/templates/main/layerprops/selections/tm-selection-settings.html'
    };
});
