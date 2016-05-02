class SupervisedClassifierResult extends LabelResult {
    getLabelColorMapper() {
        var colorMap = this.attributes.color_map;
        // Convert from hex strings to Color objects
        for (var label in colorMap) {
            colorMap[label] = Color.fromHex(colorMap[label]);
        }
        return (label) => {
            return colorMap[label];
        };
    }
}