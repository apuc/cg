/**
 * Created by apuc0 on 17.03.2018.
 */
function Masonry() {
    this.init = function (options, _cg) {
        this._cg = _cg;
        this.smaller = null;

        this.defaultParams = {
            cards: document.querySelectorAll('.card'),
            cols: 4,
            width: 300,
            columnGapBottom: 0,
            columnGapRight: 0,
            beforeRenderElement: function (el) {
            },
            afterRenderElement: function (el) {
            }
        };

        this.options = this._cg.setOptions(this.defaultParams, options);

        this.firstRow();
        this.rows();
    };

    this.reInit = function () {
        this.firstRow();
        this.rows();
    };

    this.firstRow = function () {
        for (var i = 0; i < this.options.cols; i++) { // Цикл по элементам, которые попадают в первую строку
            this.options.beforeRenderElement(this.options.cards[i]);
            this.options.cards[i].classList.add('topEl'); // Добавляем класс, указывая, что под этот элемент можно установить еще один
            if (this.options.cards[i] === this.options.cards[0]) { // Первому элементу в строке устанавливаем свойства top & left в ноль
                this.options.cards[i].style.left = 0;
                this.options.cards[i].style.top = 0;
            } else { // Всем остальным свойство left равное свойству left предыдущего плюс ширина предыдущего
                this.options.cards[i].style.left = this.options.cards[i - 1].offsetLeft + this.options.columnGapRight + this.options.width + 'px';
            }
            this.options.afterRenderElement(this.options.cards[i]);
        }
    };

    this.rows = function () {
        for (var i = 0; i < this.options.cards.length; i++) {
            this.options.cards[i].style.width = this.options.width + 'px'; // Устанавливаем ширину для каждого элемента заданную в инициализации
            if (i >= this.options.cols) { // Проходим по всем элементам, начиная с того, который не попал в первую строку (метод FirstRow())
                this.options.beforeRenderElement(this.options.cards[i]);
                if (this.options.cards[i].classList.contains('double')) {
                    this.printDouble(this.options.cards[i]);
                }
                else {
                    this.printSingle(this.options.cards[i]);
                }

                this.options.afterRenderElement(this.options.cards[i]);
            }
        }
    };

    this.getSmaller = function () {
        var topEl = document.querySelectorAll('.topEl'); // Получаем все элементы, под которые можно складывать следующие
        this.smaller = topEl[0]; // Начальное значение переменной будет первый элемент в полученном списке
        for (var i = 0; i < topEl.length; i++) {
            if (this.smaller.offsetTop + this.smaller.offsetHeight > topEl[i].offsetTop + topEl[i].offsetHeight) {
                this.smaller = topEl[i]; // Находим элемент с самым меньшим расстоянием от верха
            }
        }
    };

    this.getSmallestDifference = function () {
        var topEl = document.querySelectorAll('.topEl');
        this.smallestDif = Math.abs(this.getColumnHeight(topEl[0]) - this.getColumnHeight(topEl[1]));
        this.difColumns = {0:topEl[0],1:topEl[1]};
        for (var i = 0; i < topEl.length; i++) {
            if (typeof topEl[i + 1] !== 'undefined') {
                var currentDif = Math.abs(this.getColumnHeight(topEl[i]) - this.getColumnHeight(topEl[i+1]));
                if (this.smallestDif > currentDif) {
                    this.difColumns = {0:topEl[i],1:topEl[i+1]};
                    this.smallestDif = currentDif;
                }
            }
        }
    };

    this.printSingle = function (el) {
        this.getSmaller(); // Записываем в переменную элемент, под который упадет следующий
        el.classList.add('topEl'); // Задаем класс новому элементу
        el.style.top = this.smaller.offsetTop + this.options.columnGapBottom + this.smaller.offsetHeight + 'px'; // Устанавливаем свойство top элементу, равное отступу сверху + высоте того элемента, под которого падает блок
        if(this.smaller.classList.contains('doubleEl')){
            this.smaller.classList.remove('doubleEl');
            el.style.left = this.smaller.offsetLeft + this.options.columnGapRight + 'px';
        }
        else {
            if(this.smaller.classList.contains('double')){
                el.style.left = this.smaller.offsetLeft + this.options.width + 'px';
            }
            else {
                el.style.left = this.smaller.offsetLeft + 'px'; // Устанавливаем свойство left элементу, равное свойству left того элемента, под которого он падает
            }
            this.smaller.classList.remove('topEl'); // Удаляем у него класс
        }
    };

    this.printDouble = function (el) {
        this.getSmallestDifference();
        this.difColumns[0].classList.remove('topEl');
        this.difColumns[1].classList.remove('topEl');
        var biggest;
        if(this.getColumnHeight(this.difColumns[0]) > this.getColumnHeight(this.difColumns[1])){
            biggest = this.difColumns[0];
        }
        else {
            biggest = this.difColumns[1];
        }
        var biggestHeight = this.getColumnHeight(biggest);
        console.log(this.difColumns[0], this.difColumns[0].offsetLeft);
        console.log(this.difColumns[1], this.difColumns[1].offsetLeft);
        el.style.width = this.options.width * 2 + this.options.columnGapRight + 'px';
        el.style.left = this.difColumns[0].offsetLeft + 'px';
        el.style.top = biggestHeight + this.options.columnGapBottom + 'px';
        el.classList.add('topEl');
        el.classList.add('doubleEl');
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
    var mas = new Masonry();
    this.addExtension('mas', mas);
    return mas.init(options, this);
};