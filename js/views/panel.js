define([
    'jquery',
    'underscore',
    'backbone'
], function(
    $,
    _,
    Backbone
) {
    var PanelView = Backbone.View.extend({
        el: $('.js-panel'),

        template: _.template($('#panel-item').html()),

        events: {
            'change .js-input': 'setValue'
        },

        initialize: function() {
            this.render();
        },

        render: function() {
            this.$el.empty();

            var data = this.model.toJSON();
            Object.keys(data).forEach(function(item) {
                this.$el.append(this.template($.extend({}, data[item], {name: item})));
            }.bind(this));

            var btn = '<button class="btn btn-primary js-btn-calc">Рассчитать</button>';
            this.$el.append(btn);
        },

        setValue: function(e) {
            var name = e.target.name;
            this.model.set(name, {value: parseFloat(e.target.value)}, {validate:true});
        }
    });

    return PanelView;
});