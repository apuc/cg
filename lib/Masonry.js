/**
 * Created by apuc0 on 17.03.2018.
 */

var masArr = [];

function MasonryFactory() {

    this.getTemplate = function (template) {
        var obj;
        for (var i=0;i<masArr.length;i++){
             obj = masArr[i].getMasTplObj(template);
             if(obj){
                 return obj;
             }
        }
    }
}

function Masonry() {

    this.init = function (options, _cg) {
        this._cg = _cg;
        this.smaller = null;

        this.defaultParams = {
            template: TEMPLATE_FIXED_WIDTH,
            size: null,
            cards: document.querySelectorAll('.card'),
            cols: 4,
            width: 300,
            height: 300,
            columnGapBottom: 0,
            columnGapRight: 0
        };

        this.event = new MasonryEvents(options.events);
        this.options = this._cg.setOptions(this.defaultParams, options);

        this.childInit();
        this.render();
    };

    this.reInit = function () {
        this.childInit();
        this.render();
    };

    this.render = function () {
    };

    this.childInit = function () {
    };

    this.getColumnHeight = function (el) {
        return el.offsetTop + el.offsetHeight;
    }
}



_CG.masonry = function (options) {
    if (this.hasExtension('mas')) {
        this.mas.options = this.setOptions(this.mas.options, options);
        return this.mas;
    }
    var mas = new MasonryFactory();
    var masObj = mas.getTemplate(options.template);
    this.addExtension('mas', masObj);
    return masObj.init(options, this);
};