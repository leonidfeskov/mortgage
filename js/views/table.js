define([
    'jquery',
    'backbone',
    'utils/formater'
], function(
    $,
    Backbone,
    formater
) {
    var TableView = Backbone.View.extend({
        el: $('.js-table-data'),

        template: _.template($('#table-row').html()),

        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
            this.render();
        },

        render: function() {
            this.$el.empty();
            var tableData = this.model.toJSON().table;

            tableData.forEach(function(row) {
                var formatedRow = {
                    number: row.number,
                    date: row.date,
                    deposit: formater.price(row.deposit),
                    income: formater.price(row.income),
                    credit: formater.price(row.credit),
                    percentage: formater.price(row.percentage),
                    overRent: formater.price(row.overRent),
                    overCredit: formater.price(row.overCredit)
                }
                this.$el.append(this.template(formatedRow));
            }.bind(this));
        }
    });

    return TableView;
});