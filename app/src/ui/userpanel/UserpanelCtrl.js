angular.module('tmaps.ui')
.controller('UserpanelCtrl',
            ['appstateService', 'session', '$scope', '$state', 'application', '$location',
             function(appstateService, session, $scope, $state, app, $location) {

    var self = this;

    this.appstateQuery = {
        name: ''
    };

    this.experimentQuery = {
        name: ''
    };

    this.user = session.getUser();

    this.appstates = {
        owned: [],
        shared: []
    };

    this.experiments = [];

    Experiment.getAll().then(function(exps) {
        self.experiments = exps;
    });

    appstateService.getStates().then(function(states) {
        self.ownedStates = _(states.owned).filter(function(st) {
            return !st.isSnapshot;
        });
        self.ownedSnapshots =
            _.chain(states.owned).filter(function(st) { return st.isSnapshot; })
             .map(function(snap) {
                snap.link = appstateService.getLinkForSnapshot(snap);
                return snap;
              })
             .value();
    });

    this.loadAppstate = function(st) {
        appstateService.loadState(st);
        $scope.close();
    };

    this.addExperiment = function(e) {
        app.addExperiment(e);
    };

    $scope.close = function() {
        // TODO: If we don't explicitly pass the current location parameters
        // when transitioning to the parent state, the current url bar, which
        // was set by `setCurrentState` of appstateService, will be reset.
        // According to the docs the current location params should be passed
        // by default when transitioning states via `go`. Why do we need to pass
        // them explicitly then?
        var params = $location.search();
        $state.go('^', params);
        $scope.$dismiss(false);
    };

}]);
