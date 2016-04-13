angular.module('tmaps.ui')
.directive('tmClassSelectionWidget', function() {
    return {
        restrict: 'E',
        templateUrl: '/src/viewer/toolui/toolwindow/widgets/tm-class-selection-widget.html',
        controller: 'ClassSelectionWidgetCtrl',
        controllerAs: 'classSelectionWidget',
        bindToController: true,
        scope: true
    };
});

interface Class {
    name: string;
    mapobjectIds: number[];
}

class ClassSelectionWidgetCtrl {
    static $inject = ['$scope'];

    private _controllers: {[objectType: string]: ClassSelectionCtrl[];} = {};

    constructor(public $scope: ToolWindowContentScope) {
        this.$scope.$parent['classSelectionWidget'] = this;
    }

    private get _viewer() {
        var parentScope = <ToolWindowContentScope> this.$scope.$parent;
        return parentScope.viewer;
    }

    private get _selectedMapobjectType() {
        var parentScope = this.$scope.$parent;
        var objectTypeWidget: ObjectNameWidgetCtrl =
            parentScope['objectNameWidget'];
        return objectTypeWidget.selectedName;
    }

    private _classes: Class[] = [];

    /**
     * To be called from the controller using this widget, e.g.:
     * var theClasses = $scope.classSelectionWidget.classes;
     */
    private _computeClasses() {
        var clsMap = {};
        for (var objType in this._controllers) {
            var ctrls = this._controllers[objType];
            ctrls.forEach((ctrl) => {
                if (ctrl.useAsClass) {
                    if (clsMap[ctrl.className] === undefined) {
                        clsMap[ctrl.className] = [];
                    }
                    var mapobjectIds = ctrl.selection.mapObjects.map((o) => {
                        return o.id;
                    });
                    Array.prototype.push.apply(clsMap[ctrl.className], mapobjectIds); 
                }
            });
        }

        var classes: Class[] = [];
        for (var clsName in clsMap) {
            classes.push({
                name: clsName,
                mapobjectIds: clsMap[clsName]
            });
        }

        return classes;
    }

    get classes(): Class[] {
        var classes = this._computeClasses();
        if (this._classes.length != classes.length) {
            this._classes = classes;
        }
        return this._classes;
    }

    get selections() {
        var selectedType = this._selectedMapobjectType;;
        var selHandler = this._viewer.mapObjectSelectionHandler;
        return selHandler.getSelectionsForType(selectedType);
    }

    deregisterSelectionCtrl(selCtrl: ClassSelectionCtrl) {
        var objType = selCtrl.selection.mapObjectType;
        if (this._controllers[objType] !== undefined) {
            var idx = this._controllers[objType].indexOf(selCtrl);
            if (idx > -1) {
                this._controllers[objType].splice(idx, 1);
            }
        }
    }

    registerSelectionCtrl(selCtrl: ClassSelectionCtrl) {
        var objType = selCtrl.selection.mapObjectType;
        if (this._controllers[objType] === undefined) {
            this._controllers[objType] = [];
        }
        this._controllers[objType].push(selCtrl);
    }

    recomputeClasses() {
        this._classes = this._computeClasses();
    }
}
angular.module('tmaps.ui').controller('ClassSelectionWidgetCtrl', ClassSelectionWidgetCtrl);

class ClassSelectionCtrl {
    static $inject = ['$scope'];

    useAsClass: boolean = true;
    className: string;
    get selection() {
        return this._$scope.objSelection;
    }

    constructor(private _$scope) {
        this.className = 'Class_' + _$scope.$index;
        _$scope.classSelectionWidget.registerSelectionCtrl(this);
        _$scope.$on('$destroy', () => {
            _$scope.classSelectionWidget.deregisterSelectionCtrl(this);
        });
        _$scope.$watch('sel.className', (newName, oldName) => {
            if (newName !== oldName) {
                this._$scope.classSelectionWidget.recomputeClasses();
            }
        })
    }
}
angular.module('tmaps.ui').controller('ClassSelectionCtrl', ClassSelectionCtrl);