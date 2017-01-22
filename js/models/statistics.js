define([
    'jquery',
    'backbone'
], function(
    $,
    Backbone
) {
    var Statistics = Backbone.Model.extend({
        defaults: {
            monthsRent: 0,
            overRent: 0,
            monthsCredit: 0,
            overCredit: 0
        }
    });

    return new Statistics();
});