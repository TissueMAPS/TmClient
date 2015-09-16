type PolygonCoordinates = Array<Array<ol.Coordinate>>;
type CellId = string;

class Cell implements MapObject {

    constructor(public id: CellId,
                public centroid: MapPosition,
                public outline?: PolygonCoordinates) {
    }

    getOLFeature() {
        var coord = [this.centroid.x, this.centroid.y];
        if (this.outline === undefined) {
            return new ol.Feature({
                geometry: new ol.geom.Point(coord),
                labelPoint: new ol.geom.Point(coord),
                name: this.id
            });
        } else {
            var polyOutline: PolygonCoordinates = <PolygonCoordinates> this.outline;
            return new ol.Feature({
                geometry: new ol.geom.Polygon(polyOutline),
                labelPoint: new ol.geom.Point(coord),
                name: this.id
            });
        }
    }
}

angular.module('tmaps.core')
.factory('Cell', () => {
    return Cell;
});