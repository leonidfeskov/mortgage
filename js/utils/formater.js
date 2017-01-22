define([], function() {
    var Formater = function() {
        this.price = function(n) {
            return n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1 ');
        }
    }

    return new Formater();
});