/**
 * Created by apuc0 on 25.03.2018.
 */

const TEMPLATE_FIXED_WIDTH = 'fixedWidth';

masArr.push({
    getMasTplObj: function (tpl) {
        if(tpl === TEMPLATE_FIXED_WIDTH){
            return new MasonryFixedWidth();
        }
        return false;
    }
});

function MasonryFixedWidth() {
    Masonry.call(this);

    this.render = function () {
        this.firstRow();
        this.rows();
    };

    this.firstRow = function () {
        for (var i = 0; i < this.options.cols; i++) { // Цикл по элементам, которые попадают в первую строку
            this.event.beforeRenderElement(this.options.cards[i]);
            this.options.cards[i].classList.add('topEl'); // Добавляем класс, указывая, что под этот элемент можно установить еще один
            if (this.options.cards[i] === this.options.cards[0]) { // Первому элементу в строке устанавливаем свойства top & left в ноль
                this.options.cards[i].style.left = 0;
                this.options.cards[i].style.top = 0;
            } else { // Всем остальным свойство left равное свойству left предыдущего плюс ширина предыдущего
                this.options.cards[i].style.left = this.options.cards[i - 1].offsetLeft + this.options.columnGapRight + this.options.width + 'px';
            }
            this.event.afterRenderElement(this.options.cards[i]);
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

    this.rows = function () {
        for (var i = 0; i < this.options.cards.length; i++) {
            this.options.cards[i].style.width = this.options.width + 'px'; // Устанавливаем ширину для каждого элемента заданную в инициализации
            if (i >= this.options.cols) { // Проходим по всем элементам, начиная с того, который не попал в первую строку (метод FirstRow())
                this.event.beforeRenderElement(this.options.cards[i]);
                this.printFixedWidth(this.options.cards[i]);
            }
            this.event.afterRenderElement(this.options.cards[i]);
        }
    };

    this.printFixedWidth = function (el) {
        this.getSmaller(); // Записываем в переменную элемент, под который упадет следующий
        el.classList.add('topEl'); // Задаем класс новому элементу
        el.style.top = this.smaller.offsetTop + this.options.columnGapBottom + this.smaller.offsetHeight + 'px'; // Устанавливаем свойство top элементу, равное отступу сверху + высоте того элемента, под которого падает блок
        this.smaller.classList.remove('topEl'); // Удаляем у него класс
        el.style.left = this.smaller.offsetLeft + 'px'; // Устанавливаем свойство left элементу, равное свойству left того элемента, под которого он падает
    };
}