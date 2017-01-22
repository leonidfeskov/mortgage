define([
    'jquery',
    'underscore',
    'backbone',
    'utils/formater'
], function(
    $,
    _,
    Backbone,
    formater
) {

    function formatedPrice(n) {
        return n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1 ');
    }

    var StatisticsView = Backbone.View.extend({
        el: $('.js-statistics'),

        template: _.template($('#statistics').html()),

        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
        },

        render: function() {
            var data = this.model.toJSON();
            var formatedData = $.extend(data, {
                overRent: formater.price(this.model.get('overRent')),
                overCredit: formater.price(this.model.get('overCredit'))
            });

            this.$el.html(this.template(formatedData));
        }
    });

    return StatisticsView;
});