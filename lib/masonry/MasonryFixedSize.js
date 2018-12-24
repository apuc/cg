/**
 * Created by apuc0 on 25.03.2018.
 */

const TEMPLATE_FIXED_SIZE = 'fixedSize';

masArr.push({
    getMasTplObj: function (tpl) {
        if (tpl === TEMPLATE_FIXED_SIZE) {
            return new MasonryFixedSize();
        }
        return false;
    }
});

function MasonryFixedSize() {
    Masonry.call(this);

    this._emptyCells = [];

    this.render = function () {
        this.gridCalculate();
        this.renderItems();
    };

    this.childInit = function () {
        this.items = [];
        this.columns = [];
        for (var i = 0; i < this._cg.elem.length; i++) {
            this.items.push({
                elem: this._cg.elem[i],
                size: this.getSize(this._cg.elem[i])
            })
        }
        for (var j = 0; j < this.options.cols; j++) {
            this.columns[j] = 0;
        }
    };

    this.gridCalculate = function () {
        for (var i = 0; i < this.items.length; i++) {
            if(this.items[i].size.verticalUnit === 1 && this.items[i].size.horizontalUnit === 1 && this._emptyCells.length > 0){
                this.items[i].coor = {x:this._emptyCells[0].x, y:this._emptyCells[0].y};
                this._emptyCells.splice(0,1);
                continue;
            }
            var minIndexCol = this.getSmallerColumn();

            if(this.options.cols - minIndexCol < this.items[i].size.horizontalUnit){
                this.items[i].coor = {x:0, y:this.columns[0]};
                this.columns[0] += this.items[i].size.verticalUnit;
                for (var k = 1; k < this.items[i].size.horizontalUnit; k++) {
                    //console.log(this.columns[0] - this.columns[k]);
                    var dopSize;
                    if(this.columns[0] - (this.columns[k] + this.items[i].size.verticalUnit) > 0) {
                        this._emptyCells.push({x:k, y:this.columns[k]});
                        dopSize = this.columns[0] - this.columns[k] - 1;
                    }
                    else {
                        dopSize = 0;
                    }
                    this.columns[k] += this.items[i].size.verticalUnit + dopSize;
                }
            }
            else {
                this.items[i].coor = {x:minIndexCol, y:this.columns[minIndexCol]};
                this.columns[minIndexCol] += this.items[i].size.verticalUnit;
                for (var j = 1; j < this.items[i].size.horizontalUnit; j++) {
                    this.columns[minIndexCol + j] += this.items[i].size.verticalUnit;
                }
            }
        }
    };

    this.getSmallerColumn = function () {
        var minCol = this.columns[0];
        var index = 0;
        for (var i = 0; i < this.options.cols; i++) {
            if(this.columns[i] < minCol){
                minCol = this.columns[i];
                index = i;
            }
        }
        return index;
    };

    this.renderItems = function () {
        for (var i = 0; i < this.items.length; i++) {
            this.items[i].elem.style.position = 'absolute';
            this.items[i].elem.style.width = this.items[i].size.horizontal + 'px';
            this.items[i].elem.style.height = this.items[i].size.vertical + 'px';
            this.items[i].elem.style.top = this.items[i].coor.y * this.getElementSize('vertical') + this.items[i].coor.y * this.options.columnGapBottom + 'px';
            this.items[i].elem.style.left = this.items[i].coor.x * this.getElementSize('horizontal') + this.items[i].coor.x * this.options.columnGapRight + 'px';
        }
    };

    this.getSize = function (el) {
        return {
            vertical: this.getSizeByAttr(el, 'vertical', this.options.columnGapBottom),
            horizontal: this.getSizeByAttr(el, 'horizontal', this.options.columnGapRight),
            verticalUnit: this.getSizeInUnit(el, 'vertical'),
            horizontalUnit: this.getSizeInUnit(el, 'horizontal')
        }
    };

    this.getSizeByAttr = function (el, attr, gap) {
        gap = gap || 0;
        var attrVal = el.getAttribute('data-' + attr);
        if (null === attrVal || 1 === attrVal) {
            return this.getElementSize(attr);
        }
        attrVal = attrVal > this.options.cols ? this.options.cols : attrVal;
        return this.getElementSize(attr) * attrVal + gap * (attrVal -1);
    };

    this.getSizeInUnit = function (el, attr) {
        var attrVal = el.getAttribute('data-' + attr);
        if (null === attrVal) {
            return 1;
        }
        return parseInt(attrVal);
    };

    this.getElementSize = function (type) {
        if(null !== this.options.size){
            return this.options.size;
        }
        if(type === 'horizontal'){
            return this.options.width;
        }
        if(type === 'vertical'){
            return this.options.height;
        }
    }
}