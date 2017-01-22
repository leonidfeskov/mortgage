define([
    'jquery',
    'backbone'
], function(
    $,
    Backbone
) {
    var Table = Backbone.Model.extend({
        defaults: {
            table: []
        }
    });

    return new Table();
});