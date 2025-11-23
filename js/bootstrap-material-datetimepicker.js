(function (global, moment) {
    var pluginName = "BootstrapMaterialDatePicker";

    moment.locale('en');

    function BootstrapMaterialDatePicker(element, options) {
        this.currentView = 0;
        this.minDate;
        this.maxDate;
        this._attachedEvents = [];
        this.element = element;
        this.$element = element; // keep legacy naming for easier refactor but it is native element

        this.params = {
            date: true,
            time: true,
            format: 'YYYY-MM-DD',
            minDate: null,
            maxDate: null,
            currentDate: null,
            lang: 'en',
            weekStart: 0,
            disabledDays: [],
            shortTime: false,
            clearButton: false,
            nowButton: false,
            cancelText: 'Cancel',
            okText: 'OK',
            clearText: 'Clear',
            nowText: 'Now',
            switchOnClick: false,
            triggerEvent: 'focus',
            monthPicker: false,
            year: true
        };

        Object.assign(this.params, options);

        this.name = "dtp_" + this.setName();
        this.element.setAttribute("data-dtp", this.name);

        moment.locale(this.params.lang);

        this.init();
    }

    BootstrapMaterialDatePicker.prototype = {
        init: function () {
            this.initDays();
            this.initDates();
            this.initTemplate();
            this.initButtons();

            this._attachEvent(window, 'resize', this._centerBox.bind(this));
            this._attachEvent(this.dtpElement.querySelector('.dtp-content'), 'click', this._onElementClick.bind(this));
            this._attachEvent(this.dtpElement, 'click', this._onBackgroundClick.bind(this));
            this._attachEvent(this.dtpElement.querySelector('.dtp-close > a'), 'click', this._onCloseClick.bind(this));
            this._attachEvent(this.element, this.params.triggerEvent, this._fireCalendar.bind(this));
        },
        initDays: function () {
            this.days = [];
            for (var i = this.params.weekStart; this.days.length < 7; i++) {
                if (i > 6) {
                    i = 0;
                }
                this.days.push(i.toString());
            }
        },
        initDates: function () {
            if (this.element.value.length > 0) {
                if (typeof (this.params.format) !== 'undefined' && this.params.format !== null) {
                    this.currentDate = moment(this.element.value, this.params.format).locale(this.params.lang);
                } else {
                    this.currentDate = moment(this.element.value).locale(this.params.lang);
                }
            } else {
                if (typeof (this.element.getAttribute('value')) !== 'undefined' && this.element.getAttribute('value') !== null && this.element.getAttribute('value') !== "") {
                    if (typeof (this.element.getAttribute('value')) === 'string') {
                        if (typeof (this.params.format) !== 'undefined' && this.params.format !== null) {
                            this.currentDate = moment(this.element.getAttribute('value'), this.params.format).locale(this.params.lang);
                        } else {
                            this.currentDate = moment(this.element.getAttribute('value')).locale(this.params.lang);
                        }
                    }
                } else {
                    if (typeof (this.params.currentDate) !== 'undefined' && this.params.currentDate !== null) {
                        if (typeof (this.params.currentDate) === 'string') {
                            if (typeof (this.params.format) !== 'undefined' && this.params.format !== null) {
                                this.currentDate = moment(this.params.currentDate, this.params.format).locale(this.params.lang);
                            } else {
                                this.currentDate = moment(this.params.currentDate).locale(this.params.lang);
                            }
                        } else {
                            if (typeof (this.params.currentDate.isValid) === 'undefined' || typeof (this.params.currentDate.isValid) !== 'function') {
                                var x = this.params.currentDate.getTime();
                                this.currentDate = moment(x, "x").locale(this.params.lang);
                            } else {
                                this.currentDate = this.params.currentDate;
                            }
                        }
                        this.element.value = this.currentDate.format(this.params.format);
                    } else
                        this.currentDate = moment();
                }
            }

            if (typeof (this.params.minDate) !== 'undefined' && this.params.minDate !== null) {
                if (typeof (this.params.minDate) === 'string') {
                    if (typeof (this.params.format) !== 'undefined' && this.params.format !== null) {
                        this.minDate = moment(this.params.minDate, this.params.format).locale(this.params.lang);
                    } else {
                        this.minDate = moment(this.params.minDate).locale(this.params.lang);
                    }
                } else {
                    if (typeof (this.params.minDate.isValid) === 'undefined' || typeof (this.params.minDate.isValid) !== 'function') {
                        var x = this.params.minDate.getTime();
                        this.minDate = moment(x, "x").locale(this.params.lang);
                    } else {
                        this.minDate = this.params.minDate;
                    }
                }
            } else if (this.params.minDate === null) {
                this.minDate = null;
            }

            if (typeof (this.params.maxDate) !== 'undefined' && this.params.maxDate !== null) {
                if (typeof (this.params.maxDate) === 'string') {
                    if (typeof (this.params.format) !== 'undefined' && this.params.format !== null) {
                        this.maxDate = moment(this.params.maxDate, this.params.format).locale(this.params.lang);
                    } else {
                        this.maxDate = moment(this.params.maxDate).locale(this.params.lang);
                    }
                } else {
                    if (typeof (this.params.maxDate.isValid) === 'undefined' || typeof (this.params.maxDate.isValid) !== 'function') {
                        var x = this.params.maxDate.getTime();
                        this.maxDate = moment(x, "x").locale(this.params.lang);
                    } else {
                        this.maxDate = this.params.maxDate;
                    }
                }
            } else if (this.params.maxDate === null) {
                this.maxDate = null;
            }

            if (!this.isAfterMinDate(this.currentDate)) {
                this.currentDate = moment(this.minDate);
            }
            if (!this.isBeforeMaxDate(this.currentDate)) {
                this.currentDate = moment(this.maxDate);
            }
        },
        initTemplate: function () {
            var yearPicker = "";
            var y = this.currentDate.year();
            for (var i = y - 3; i < y + 4; i++) {
                yearPicker += '<div class="year-picker-item" data-year="' + i + '">' + i + '</div>';
            }
            this.midYear = y;
            var yearHtml =
                '<div class="dtp-picker-year hidden" >' +
                '<div><a href="javascript:void(0);" class="btn btn-link dtp-select-year-range before" style="margin: 0;"><i class="material-icons">keyboard_arrow_up</i></a></div>' +
                yearPicker +
                '<div><a href="javascript:void(0);" class="btn btn-link dtp-select-year-range after" style="margin: 0;"><i class="material-icons">keyboard_arrow_down</i></a></div>' +
                '</div>';

            this.template = '<div class="dtp hidden" id="' + this.name + '">' +
                '<div class="dtp-content">' +
                '<div class="dtp-date-view">' +
                '<header class="dtp-header">' +
                '<div class="dtp-actual-day">Lundi</div>' +
                '<div class="dtp-close"><a href="javascript:void(0);"><i class="material-icons">clear</i></a></div>' +
                '</header>' +
                '<div class="dtp-date hidden">' +
                '<div>' +
                '<div class="left center p10">' +
                '<a href="javascript:void(0);" class="dtp-select-month-before"><i class="material-icons">chevron_left</i></a>' +
                '</div>' +
                '<div class="dtp-actual-month p80">MAR</div>' +
                '<div class="right center p10">' +
                '<a href="javascript:void(0);" class="dtp-select-month-after"><i class="material-icons">chevron_right</i></a>' +
                '</div>' +
                '<div class="clearfix"></div>' +
                '</div>' +
                '<div class="dtp-actual-num">13</div>' +
                '<div>' +
                '<div class="left center p10">' +
                '<a href="javascript:void(0);" class="dtp-select-year-before"><i class="material-icons">chevron_left</i></a>' +
                '</div>' +
                '<div class="dtp-actual-year p80' + (this.params.year ? "" : " disabled") + '">2014</div>' +
                '<div class="right center p10">' +
                '<a href="javascript:void(0);" class="dtp-select-year-after"><i class="material-icons">chevron_right</i></a>' +
                '</div>' +
                '<div class="clearfix"></div>' +
                '</div>' +
                '</div>' +
                '<div class="dtp-time hidden">' +
                '<div class="dtp-actual-maxtime">23:55</div>' +
                '</div>' +
                '<div class="dtp-picker">' +
                '<div class="dtp-picker-calendar"></div>' +
                '<div class="dtp-picker-datetime hidden">' +
                '<div class="dtp-actual-meridien">' +
                '<div class="left p20">' +
                '<a class="dtp-meridien-am" href="javascript:void(0);">AM</a>' +
                '</div>' +
                '<div class="dtp-actual-time p60"></div>' +
                '<div class="right p20">' +
                '<a class="dtp-meridien-pm" href="javascript:void(0);">PM</a>' +
                '</div>' +
                '<div class="clearfix"></div>' +
                '</div>' +
                '<div id="dtp-svg-clock">' +
                '</div>' +
                '</div>' +
                yearHtml +
                '</div>' +
                '</div>' +
                '<div class="dtp-buttons">' +
                '<button class="dtp-btn-now btn btn-link hidden">' + this.params.nowText + '</button>' +
                '<button class="dtp-btn-clear btn btn-link hidden">' + this.params.clearText + '</button>' +
                '<button class="dtp-btn-cancel btn btn-link">' + this.params.cancelText + '</button>' +
                '<button class="dtp-btn-ok btn btn-link">' + this.params.okText + '</button>' +
                '<div class="clearfix"></div>' +
                '</div>' +
                '</div>' +
                '</div>';

            if (document.body.querySelector("#" + this.name) === null) {
                document.body.insertAdjacentHTML('beforeend', this.template);
                this.dtpElement = document.body.querySelector("#" + this.name);
            }
        },
        initButtons: function () {
            this._attachEvent(this.dtpElement.querySelector('.dtp-btn-cancel'), 'click', this._onCancelClick.bind(this));
            this._attachEvent(this.dtpElement.querySelector('.dtp-btn-ok'), 'click', this._onOKClick.bind(this));
            this._attachEvent(this.dtpElement.querySelector('a.dtp-select-month-before'), 'click', this._onMonthBeforeClick.bind(this));
            this._attachEvent(this.dtpElement.querySelector('a.dtp-select-month-after'), 'click', this._onMonthAfterClick.bind(this));
            this._attachEvent(this.dtpElement.querySelector('a.dtp-select-year-before'), 'click', this._onYearBeforeClick.bind(this));
            this._attachEvent(this.dtpElement.querySelector('a.dtp-select-year-after'), 'click', this._onYearAfterClick.bind(this));
            this._attachEvent(this.dtpElement.querySelector('.dtp-actual-year'), 'click', this._onActualYearClick.bind(this));
            this._attachEvent(this.dtpElement.querySelector('a.dtp-select-year-range.before'), 'click', this._onYearRangeBeforeClick.bind(this));
            this._attachEvent(this.dtpElement.querySelector('a.dtp-select-year-range.after'), 'click', this._onYearRangeAfterClick.bind(this));

            var yearItems = this.dtpElement.querySelectorAll('div.year-picker-item');
            for(var i=0; i<yearItems.length; i++) {
                this._attachEvent(yearItems[i], 'click', this._onYearItemClick.bind(this));
            }

            if (this.params.clearButton === true) {
                this._attachEvent(this.dtpElement.querySelector('.dtp-btn-clear'), 'click', this._onClearClick.bind(this));
                this.dtpElement.querySelector('.dtp-btn-clear').classList.remove('hidden');
            }

            if (this.params.nowButton === true) {
                this._attachEvent(this.dtpElement.querySelector('.dtp-btn-now'), 'click', this._onNowClick.bind(this));
                this.dtpElement.querySelector('.dtp-btn-now').classList.remove('hidden');
            }

            if ((this.params.nowButton === true) && (this.params.clearButton === true)) {
                 var btns = this.dtpElement.querySelectorAll('.dtp-btn-clear, .dtp-btn-now, .dtp-btn-cancel, .dtp-btn-ok');
                 for(var i=0; i<btns.length; i++) btns[i].classList.add('btn-xs');
            } else if ((this.params.nowButton === true) || (this.params.clearButton === true)) {
                 var btns = this.dtpElement.querySelectorAll('.dtp-btn-clear, .dtp-btn-now, .dtp-btn-cancel, .dtp-btn-ok');
                 for(var i=0; i<btns.length; i++) btns[i].classList.add('btn-sm');
            }
        },
        initMeridienButtons: function () {
            var amBtn = this.dtpElement.querySelector('a.dtp-meridien-am');
            var pmBtn = this.dtpElement.querySelector('a.dtp-meridien-pm');

            // Removing old listeners is not straightforward without storing them specifically,
            // but we can clone the node to clear listeners or just rely on the fact that initHours/initMinutes might be called multiple times.
            // A better way is to store the listener and remove it.
            // But _attachEvent stores them.
            // Actually, initMeridienButtons is called inside initHours/initMinutes which are called repeatedly.
            // We should check if listener is already attached or remove previous one.
            // The original code used .off('click').on('click'), so it removed previous listeners.
            // We can do this by using a new clone or just handling it carefully.
            // For now, let's clone node to strip events, which is quick hack but works for vanilla.
            // Or better, store the bound function.

            // To properly remove event listeners in vanilla JS, we need reference to the function.
            // But we are binding `this` which creates a new function every time.
            // So we can't easily remove specific one unless we stored it.
            // Let's implement a simple cleanup for these buttons specifically or just use a flag.

            // Simplified: we will not re-attach if already attached?
            // But initHours can be called multiple times.

            // Let's use the cloneNode trick for these buttons to clear events.
            var newAmBtn = amBtn.cloneNode(true);
            amBtn.parentNode.replaceChild(newAmBtn, amBtn);
            var newPmBtn = pmBtn.cloneNode(true);
            pmBtn.parentNode.replaceChild(newPmBtn, pmBtn);

            this._attachEvent(newAmBtn, 'click', this._onSelectAM.bind(this));
            this._attachEvent(newPmBtn, 'click', this._onSelectPM.bind(this));
        },
        initDate: function (d) {
            this.currentView = 0;

            if (this.params.monthPicker === false) {
                this.dtpElement.querySelector('.dtp-picker-calendar').classList.remove('hidden');
            }
            this.dtpElement.querySelector('.dtp-picker-datetime').classList.add('hidden');
            this.dtpElement.querySelector('.dtp-picker-year').classList.add('hidden');

            var _date = ((typeof (this.currentDate) !== 'undefined' && this.currentDate !== null) ? this.currentDate : null);
            var _calendar = this.generateCalendar(this.currentDate);

            if (typeof (_calendar.week) !== 'undefined' && typeof (_calendar.days) !== 'undefined') {
                var _template = this.constructHTMLCalendar(_date, _calendar);

                this.dtpElement.querySelector('.dtp-picker-calendar').innerHTML = _template;

                var days = this.dtpElement.querySelectorAll('a.dtp-select-day');
                for(var i=0; i<days.length; i++){
                    this._attachEvent(days[i], 'click', this._onSelectDate.bind(this));
                }

                this.toggleButtons(_date);
            }

            this._centerBox();
            this.showDate(_date);
        },
        initHours: function () {
            this.currentView = 1;

            this.showTime(this.currentDate);
            this.initMeridienButtons();

            if (this.currentDate.hour() < 12) {
                this.dtpElement.querySelector('a.dtp-meridien-am').click();
            } else {
                this.dtpElement.querySelector('a.dtp-meridien-pm').click();
            }

            var hFormat = ((this.params.shortTime) ? 'h' : 'H');

            this.dtpElement.querySelector('.dtp-picker-datetime').classList.remove('hidden');
            this.dtpElement.querySelector('.dtp-picker-calendar').classList.add('hidden');
            this.dtpElement.querySelector('.dtp-picker-year').classList.add('hidden');

            var svgClockElement = this.createSVGClock(true);

            for (var i = 0; i < 12; i++) {
                var x = -(162 * (Math.sin(-Math.PI * 2 * (i / 12))));
                var y = -(162 * (Math.cos(-Math.PI * 2 * (i / 12))));

                var fill = ((this.currentDate.format(hFormat) == i) ? "#8BC34A" : 'transparent');
                var color = ((this.currentDate.format(hFormat) == i) ? "#fff" : '#000');

                var svgHourCircle = this.createSVGElement("circle", { 'id': 'h-' + i, 'class': 'dtp-select-hour', 'style': 'cursor:pointer', r: '30', cx: x, cy: y, fill: fill, 'data-hour': i });

                var svgHourText = this.createSVGElement("text", { 'id': 'th-' + i, 'class': 'dtp-select-hour-text', 'text-anchor': 'middle', 'style': 'cursor:pointer', 'font-weight': 'bold', 'font-size': '20', x: x, y: y + 7, fill: color, 'data-hour': i });
                svgHourText.textContent = ((i === 0) ? ((this.params.shortTime) ? 12 : i) : i);

                if (!this.toggleTime(i, true)) {
                    svgHourCircle.className.baseVal += " disabled";
                    svgHourText.className.baseVal += " disabled";
                    svgHourText.setAttribute('fill', '#bdbdbd');
                } else {
                    svgHourCircle.addEventListener('click', this._onSelectHour.bind(this));
                    svgHourText.addEventListener('click', this._onSelectHour.bind(this));
                }

                svgClockElement.appendChild(svgHourCircle)
                svgClockElement.appendChild(svgHourText)
            }

            if (!this.params.shortTime) {
                for (var i = 0; i < 12; i++) {
                    var x = -(110 * (Math.sin(-Math.PI * 2 * (i / 12))));
                    var y = -(110 * (Math.cos(-Math.PI * 2 * (i / 12))));

                    var fill = ((this.currentDate.format(hFormat) == (i + 12)) ? "#8BC34A" : 'transparent');
                    var color = ((this.currentDate.format(hFormat) == (i + 12)) ? "#fff" : '#000');

                    var svgHourCircle = this.createSVGElement("circle", { 'id': 'h-' + (i + 12), 'class': 'dtp-select-hour', 'style': 'cursor:pointer', r: '30', cx: x, cy: y, fill: fill, 'data-hour': (i + 12) });

                    var svgHourText = this.createSVGElement("text", { 'id': 'th-' + (i + 12), 'class': 'dtp-select-hour-text', 'text-anchor': 'middle', 'style': 'cursor:pointer', 'font-weight': 'bold', 'font-size': '22', x: x, y: y + 7, fill: color, 'data-hour': (i + 12) });
                    svgHourText.textContent = i + 12;

                    if (!this.toggleTime(i + 12, true)) {
                        svgHourCircle.className.baseVal += " disabled";
                        svgHourText.className.baseVal += " disabled";
                        svgHourText.setAttribute('fill', '#bdbdbd');
                    } else {
                        svgHourCircle.addEventListener('click', this._onSelectHour.bind(this));
                        svgHourText.addEventListener('click', this._onSelectHour.bind(this));
                    }

                    svgClockElement.appendChild(svgHourCircle)
                    svgClockElement.appendChild(svgHourText)
                }

                this.dtpElement.querySelector('a.dtp-meridien-am').classList.add('hidden');
                this.dtpElement.querySelector('a.dtp-meridien-pm').classList.add('hidden');
            }

            this._centerBox();
        },
        initMinutes: function () {
            this.currentView = 2;

            this.showTime(this.currentDate);

            this.initMeridienButtons();

            if (this.currentDate.hour() < 12) {
                this.dtpElement.querySelector('a.dtp-meridien-am').click();
            } else {
                this.dtpElement.querySelector('a.dtp-meridien-pm').click();
            }

            this.dtpElement.querySelector('.dtp-picker-year').classList.add('hidden');
            this.dtpElement.querySelector('.dtp-picker-calendar').classList.add('hidden');
            this.dtpElement.querySelector('.dtp-picker-datetime').classList.remove('hidden');

            var svgClockElement = this.createSVGClock(false);

            for (var i = 0; i < 60; i++) {
                var s = ((i % 5 === 0) ? 162 : 158);
                var r = ((i % 5 === 0) ? 30 : 20);

                var x = -(s * (Math.sin(-Math.PI * 2 * (i / 60))));
                var y = -(s * (Math.cos(-Math.PI * 2 * (i / 60))));

                var color = ((this.currentDate.format("m") == i) ? "#8BC34A" : 'transparent');

                var svgMinuteCircle = this.createSVGElement("circle", { 'id': 'm-' + i, 'class': 'dtp-select-minute', 'style': 'cursor:pointer', r: r, cx: x, cy: y, fill: color, 'data-minute': i });

                if (!this.toggleTime(i, false)) {
                    svgMinuteCircle.className.baseVal += " disabled";
                } else {
                    svgMinuteCircle.addEventListener('click', this._onSelectMinute.bind(this));
                }

                svgClockElement.appendChild(svgMinuteCircle)
            }

            for (var i = 0; i < 60; i++) {
                if ((i % 5) === 0) {
                    var x = -(162 * (Math.sin(-Math.PI * 2 * (i / 60))));
                    var y = -(162 * (Math.cos(-Math.PI * 2 * (i / 60))));

                    var color = ((this.currentDate.format("m") == i) ? "#fff" : '#000');

                    var svgMinuteText = this.createSVGElement("text", { 'id': 'tm-' + i, 'class': 'dtp-select-minute-text', 'text-anchor': 'middle', 'style': 'cursor:pointer', 'font-weight': 'bold', 'font-size': '20', x: x, y: y + 7, fill: color, 'data-minute': i });
                    svgMinuteText.textContent = i;

                    if (!this.toggleTime(i, false)) {
                        svgMinuteText.className.baseVal += " disabled";
                        svgMinuteText.setAttribute('fill', '#bdbdbd');
                    } else {
                        svgMinuteText.addEventListener('click', this._onSelectMinute.bind(this));
                    }

                    svgClockElement.appendChild(svgMinuteText)
                }
            }

            this._centerBox();
        },
        animateHands: function () {
            var H = this.currentDate.hour();
            var M = this.currentDate.minute();

            var hh = this.dtpElement.querySelector('.hour-hand');
            hh.setAttribute('transform', "rotate(" + 360 * H / 12 + ")");

            var mh = this.dtpElement.querySelector('.minute-hand');
            mh.setAttribute('transform', "rotate(" + 360 * M / 60 + ")");
        },
        createSVGClock: function (isHour) {
            var hl = ((this.params.shortTime) ? -120 : -90);

            var svgElement = this.createSVGElement("svg", { class: 'svg-clock', viewBox: '0,0,400,400' });
            var svgGElement = this.createSVGElement("g", { transform: 'translate(200,200) ' });
            var svgClockFace = this.createSVGElement("circle", { r: '192', fill: '#eee', stroke: '#bdbdbd', 'stroke-width': 2 });
            var svgClockCenter = this.createSVGElement("circle", { r: '15', fill: '#757575' });

            svgGElement.appendChild(svgClockFace)

            if (isHour) {
                var svgMinuteHand = this.createSVGElement("line", { class: 'minute-hand', x1: 0, y1: 0, x2: 0, y2: -150, stroke: '#bdbdbd', 'stroke-width': 2 });
                var svgHourHand = this.createSVGElement("line", { class: 'hour-hand', x1: 0, y1: 0, x2: 0, y2: hl, stroke: '#8BC34A', 'stroke-width': 8 });

                svgGElement.appendChild(svgMinuteHand);
                svgGElement.appendChild(svgHourHand);
            } else {
                var svgMinuteHand = this.createSVGElement("line", { class: 'minute-hand', x1: 0, y1: 0, x2: 0, y2: -150, stroke: '#8BC34A', 'stroke-width': 2 });
                var svgHourHand = this.createSVGElement("line", { class: 'hour-hand', x1: 0, y1: 0, x2: 0, y2: hl, stroke: '#bdbdbd', 'stroke-width': 8 });

                svgGElement.appendChild(svgHourHand);
                svgGElement.appendChild(svgMinuteHand);
            }

            svgGElement.appendChild(svgClockCenter)

            svgElement.appendChild(svgGElement)

            var clockContainer = this.dtpElement.querySelector("#dtp-svg-clock");
            clockContainer.innerHTML = "";
            clockContainer.appendChild(svgElement);

            this.animateHands();

            return svgGElement;
        },
        createSVGElement: function (tag, attrs) {
            var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
            for (var k in attrs) {
                el.setAttribute(k, attrs[k]);
            }
            return el;
        },
        isAfterMinDate: function (date, checkHour, checkMinute) {
            var _return = true;

            if (typeof (this.minDate) !== 'undefined' && this.minDate !== null) {
                var _minDate = moment(this.minDate);
                var _date = moment(date);

                if (!checkHour && !checkMinute) {
                    _minDate.hour(0);
                    _minDate.minute(0);

                    _date.hour(0);
                    _date.minute(0);
                }

                _minDate.second(0);
                _date.second(0);
                _minDate.millisecond(0);
                _date.millisecond(0);

                if (!checkMinute) {
                    _date.minute(0);
                    _minDate.minute(0);

                    _return = (parseInt(_date.format("X")) >= parseInt(_minDate.format("X")));
                } else {
                    _return = (parseInt(_date.format("X")) >= parseInt(_minDate.format("X")));
                }
            }

            return _return;
        },
        isBeforeMaxDate: function (date, checkTime, checkMinute) {
            var _return = true;

            if (typeof (this.maxDate) !== 'undefined' && this.maxDate !== null) {
                var _maxDate = moment(this.maxDate);
                var _date = moment(date);

                if (!checkTime && !checkMinute) {
                    _maxDate.hour(0);
                    _maxDate.minute(0);

                    _date.hour(0);
                    _date.minute(0);
                }

                _maxDate.second(0);
                _date.second(0);
                _maxDate.millisecond(0);
                _date.millisecond(0);

                if (!checkMinute) {
                    _date.minute(0);
                    _maxDate.minute(0);

                    _return = (parseInt(_date.format("X")) <= parseInt(_maxDate.format("X")));
                } else {
                    _return = (parseInt(_date.format("X")) <= parseInt(_maxDate.format("X")));
                }
            }

            return _return;
        },
        rotateElement: function (el, deg) {
            el.style.webkitTransform = 'rotate(' + deg + 'deg)';
            el.style.mozTransform = 'rotate(' + deg + 'deg)';
            el.style.transform = 'rotate(' + deg + 'deg)';
        },
        showDate: function (date) {
            if (date) {
                this.dtpElement.querySelector('.dtp-actual-day').innerHTML = date.locale(this.params.lang).format('dddd');
                this.dtpElement.querySelector('.dtp-actual-month').innerHTML = date.locale(this.params.lang).format('MMM').toUpperCase();
                this.dtpElement.querySelector('.dtp-actual-num').innerHTML = date.locale(this.params.lang).format('DD');
                this.dtpElement.querySelector('.dtp-actual-year').innerHTML = date.locale(this.params.lang).format('YYYY');
            }
        },
        showTime: function (date) {
            if (date) {
                var minutes = date.minute();
                var content = ((this.params.shortTime) ? date.format('hh') : date.format('HH')) + ':' + ((minutes.toString().length == 2) ? minutes : '0' + minutes) + ((this.params.shortTime) ? ' ' + date.format('A') : '');

                if (this.params.date)
                    this.dtpElement.querySelector('.dtp-actual-time').innerHTML = content;
                else {
                    if (this.params.shortTime)
                        this.dtpElement.querySelector('.dtp-actual-day').innerHTML = date.format('A');
                    else
                        this.dtpElement.querySelector('.dtp-actual-day').innerHTML = '&nbsp;';

                    this.dtpElement.querySelector('.dtp-actual-maxtime').innerHTML = content;
                }
            }
        },
        selectDate: function (date) {
            if (date) {
                this.currentDate.date(date);

                this.showDate(this.currentDate);
                this._triggerEvent('dateSelected', { date: this.currentDate });
            }
        },
        generateCalendar: function (date) {
            var _calendar = {};

            if (date !== null) {
                var startOfMonth = moment(date).locale(this.params.lang).startOf('month');
                var endOfMonth = moment(date).locale(this.params.lang).endOf('month');

                var iNumDay = startOfMonth.format('d');

                _calendar.week = this.days;
                _calendar.days = [];

                for (var i = startOfMonth.date(); i <= endOfMonth.date(); i++) {
                    if (i === startOfMonth.date()) {
                        var iWeek = _calendar.week.indexOf(iNumDay.toString());
                        if (iWeek > 0) {
                            for (var x = 0; x < iWeek; x++) {
                                _calendar.days.push(0);
                            }
                        }
                    }
                    _calendar.days.push(moment(startOfMonth).locale(this.params.lang).date(i));
                }
            }

            return _calendar;
        },
        constructHTMLCalendar: function (date, calendar) {
            var _template = "";

            _template += '<div class="dtp-picker-month">' + date.locale(this.params.lang).format('MMMM YYYY') + '</div>';
            _template += '<table class="table dtp-picker-days"><thead>';
            for (var i = 0; i < calendar.week.length; i++) {
                _template += '<th>' + moment(parseInt(calendar.week[i]), "d").locale(this.params.lang).format("dd").substring(0, 1) + '</th>';
            }

            _template += '</thead>';
            _template += '<tbody><tr>';

            for (var i = 0; i < calendar.days.length; i++) {
                if (i % 7 == 0)
                    _template += '</tr><tr>';
                _template += '<td data-date="' + moment(calendar.days[i]).locale(this.params.lang).format("D") + '">';
                if (calendar.days[i] != 0) {
                    if (this.isBeforeMaxDate(moment(calendar.days[i]), false, false) === false
                        || this.isAfterMinDate(moment(calendar.days[i]), false, false) === false
                        || this.params.disabledDays.indexOf(calendar.days[i].isoWeekday()) !== -1) {
                        _template += '<span class="dtp-select-day">' + moment(calendar.days[i]).locale(this.params.lang).format("DD") + '</span>';
                    } else {
                        if (moment(calendar.days[i]).locale(this.params.lang).format("DD") === moment(this.currentDate).locale(this.params.lang).format("DD")) {
                            _template += '<a href="javascript:void(0);" class="dtp-select-day selected">' + moment(calendar.days[i]).locale(this.params.lang).format("DD") + '</a>';
                        } else {
                            _template += '<a href="javascript:void(0);" class="dtp-select-day">' + moment(calendar.days[i]).locale(this.params.lang).format("DD") + '</a>';
                        }
                    }

                    _template += '</td>';
                }
            }
            _template += '</tr></tbody></table>';

            return _template;
        },
        setName: function () {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < 5; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }

            return text;
        },
        isPM: function () {
            return this.dtpElement.querySelector('a.dtp-meridien-pm').classList.contains('selected');
        },
        setElementValue: function () {
            this._triggerEvent('beforeChange', { date: this.currentDate });
            this.element.value = moment(this.currentDate).locale(this.params.lang).format(this.params.format);
            this._triggerEvent('change', { date: this.currentDate });
        },
        toggleButtons: function (date) {
            if (date && date.isValid()) {
                var startOfMonth = moment(date).locale(this.params.lang).startOf('month');
                var endOfMonth = moment(date).locale(this.params.lang).endOf('month');

                if (!this.isAfterMinDate(startOfMonth, false, false)) {
                    this.dtpElement.querySelector('a.dtp-select-month-before').classList.add('invisible');
                } else {
                    this.dtpElement.querySelector('a.dtp-select-month-before').classList.remove('invisible');
                }

                if (!this.isBeforeMaxDate(endOfMonth, false, false)) {
                    this.dtpElement.querySelector('a.dtp-select-month-after').classList.add('invisible');
                } else {
                    this.dtpElement.querySelector('a.dtp-select-month-after').classList.remove('invisible');
                }

                var startOfYear = moment(date).locale(this.params.lang).startOf('year');
                var endOfYear = moment(date).locale(this.params.lang).endOf('year');

                if (!this.isAfterMinDate(startOfYear, false, false)) {
                    this.dtpElement.querySelector('a.dtp-select-year-before').classList.add('invisible');
                } else {
                    this.dtpElement.querySelector('a.dtp-select-year-before').classList.remove('invisible');
                }

                if (!this.isBeforeMaxDate(endOfYear, false, false)) {
                    this.dtpElement.querySelector('a.dtp-select-year-after').classList.add('invisible');
                } else {
                    this.dtpElement.querySelector('a.dtp-select-year-after').classList.remove('invisible');
                }
            }
        },
        toggleTime: function (value, isHours) {
            var result = false;

            if (isHours) {
                var _date = moment(this.currentDate);
                _date.hour(this.convertHours(value)).minute(0).second(0);

                result = !(this.isAfterMinDate(_date, true, false) === false || this.isBeforeMaxDate(_date, true, false) === false);
            } else {
                var _date = moment(this.currentDate);
                _date.minute(value).second(0);

                result = !(this.isAfterMinDate(_date, true, true) === false || this.isBeforeMaxDate(_date, true, true) === false);
            }

            return result;
        },
        _attachEvent: function (el, ev, fn) {
            el.addEventListener(ev, fn);
            this._attachedEvents.push([el, ev, fn]);
        },
        _detachEvents: function () {
            for (var i = this._attachedEvents.length - 1; i >= 0; i--) {
                this._attachedEvents[i][0].removeEventListener(this._attachedEvents[i][1], this._attachedEvents[i][2]);
                this._attachedEvents.splice(i, 1);
            }
        },
        _triggerEvent: function (eventName, detail) {
            var event = new CustomEvent(eventName, { detail: detail });
            this.element.dispatchEvent(event);

            // For backward compatibility with jQuery listeners: $(el).on('change', ...)
            // We can assume users migrating might still use native addEventListener or jQuery's on if they include jQuery separately.
            // If jQuery is present, we could trigger it too, but we are removing jQuery dependency.
            // So plain JS events are the way.
        },
        _fireCalendar: function () {
            this.currentView = 0;
            this.element.blur();

            this.initDates();

            this.show();

            if (this.params.date) {
                this.dtpElement.querySelector('.dtp-date').classList.remove('hidden');
                this.initDate();
            } else {
                if (this.params.time) {
                    this.dtpElement.querySelector('.dtp-time').classList.remove('hidden');
                    this.initHours();
                }
            }
        },
        _onBackgroundClick: function (e) {
            e.stopPropagation();
            this.hide();
        },
        _onElementClick: function (e) {
            e.stopPropagation();
        },
        _onKeydown: function (e) {
            if (e.which === 27) {
                this.hide();
            }
        },
        _onCloseClick: function () {
            this.hide();
        },
        _onClearClick: function () {
            this.currentDate = null;
            this._triggerEvent('beforeChange', { date: this.currentDate });
            this.hide();
            this.element.value = '';
            this._triggerEvent('change', { date: this.currentDate });
        },
        _onNowClick: function () {
            this.currentDate = moment();

            if (this.params.date === true) {
                this.showDate(this.currentDate);

                if (this.currentView === 0) {
                    this.initDate();
                }
            }

            if (this.params.time === true) {
                this.showTime(this.currentDate);

                switch (this.currentView) {
                    case 1:
                        this.initHours();
                        break;
                    case 2:
                        this.initMinutes();
                        break;
                }

                this.animateHands();
            }
        },
        _onOKClick: function () {
            switch (this.currentView) {
                case 0:
                    if (this.params.time === true) {
                        this.initHours();
                    } else {
                        this.setElementValue();
                        this.hide();
                    }
                    break;
                case 1:
                    this.initMinutes();
                    break;
                case 2:
                    this.setElementValue();
                    this.hide();
                    break;
            }
        },
        _onCancelClick: function () {
            if (this.params.time) {
                switch (this.currentView) {
                    case 0:
                        this.hide();
                        break;
                    case 1:
                        if (this.params.date) {
                            this.initDate();
                        } else {
                            this.hide();
                        }
                        break;
                    case 2:
                        this.initHours();
                        break;
                }
            } else {
                this.hide();
            }
        },
        _onMonthBeforeClick: function () {
            this.currentDate.subtract(1, 'months');
            this.initDate(this.currentDate);
            this._closeYearPicker();
        },
        _onMonthAfterClick: function () {
            this.currentDate.add(1, 'months');
            this.initDate(this.currentDate);
            this._closeYearPicker();
        },
        _onYearBeforeClick: function () {
            this.currentDate.subtract(1, 'years');
            this.initDate(this.currentDate);
            this._closeYearPicker();
        },
        _onYearAfterClick: function () {
            this.currentDate.add(1, 'years');
            this.initDate(this.currentDate);
            this._closeYearPicker();
        },
        refreshYearItems: function () {
            var curYear = this.currentDate.year(), midYear = this.midYear;
            var minYear = 1850;
            if (typeof (this.minDate) !== 'undefined' && this.minDate !== null) {
                minYear = moment(this.minDate).year();
            }

            var maxYear = 2200;
            if (typeof (this.maxDate) !== 'undefined' && this.maxDate !== null) {
                maxYear = moment(this.maxDate).year();
            }

            var hiddenYears = this.dtpElement.querySelectorAll(".dtp-picker-year .invisible");
            for(var i=0; i<hiddenYears.length; i++) hiddenYears[i].classList.remove("invisible");

            var yearItems = this.dtpElement.querySelectorAll(".year-picker-item");
            for (var i = 0; i < yearItems.length; i++) {
                var el = yearItems[i];
                var newYear = midYear - 3 + i;
                el.setAttribute("data-year", newYear);
                el.innerText = newYear;
                // data("year") is jQuery, we use dataset or getAttribute, but since we use getAttribute to read it back...
                // we should be fine.

                if (curYear == newYear) {
                    el.classList.add("active");
                } else {
                    el.classList.remove("active");
                }
                if (newYear < minYear || newYear > maxYear) {
                    el.classList.add("invisible")
                }
            }

            if (minYear >= midYear - 3) {
                this.dtpElement.querySelector(".dtp-select-year-range.before").classList.add('invisible');
            }
            if (maxYear <= midYear + 3) {
                this.dtpElement.querySelector(".dtp-select-year-range.after").classList.add('invisible');
            }

            this.dtpElement.querySelector(".dtp-select-year-range").setAttribute("data-mid", midYear);
        },
        _onActualYearClick: function () {
            if (this.params.year) {
                if (this.dtpElement.querySelectorAll('.dtp-picker-year.hidden').length > 0) {
                    this.dtpElement.querySelector('.dtp-picker-datetime').classList.add("hidden");
                    this.dtpElement.querySelector('.dtp-picker-calendar').classList.add("hidden");
                    this.dtpElement.querySelector('.dtp-picker-year').classList.remove("hidden");
                    this.midYear = this.currentDate.year();
                    this.refreshYearItems();
                } else {
                    this._closeYearPicker();
                }
            }
        },
        _onYearRangeBeforeClick: function () {
            this.midYear -= 7;
            this.refreshYearItems();
        },
        _onYearRangeAfterClick: function () {
            this.midYear += 7;
            this.refreshYearItems();
        },
        _onYearItemClick: function (e) {
            var newYear = e.currentTarget.getAttribute('data-year');
            var oldYear = this.currentDate.year();
            var diff = newYear - oldYear;
            this.currentDate.add(diff, 'years');
            this.initDate(this.currentDate);

            this._closeYearPicker();
            this._triggerEvent("yearSelected", { date: this.currentDate });
        },
        _closeYearPicker: function () {
            this.dtpElement.querySelector('.dtp-picker-calendar').classList.remove("hidden");
            this.dtpElement.querySelector('.dtp-picker-year').classList.add("hidden");
        },
        enableYearPicker: function () {
            this.params.year = true;
            this.dtpElement.querySelector(".dtp-actual-year").classList.remove("disabled");
        },
        disableYearPicker: function () {
            this.params.year = false;
            this.dtpElement.querySelector(".dtp-actual-year").classList.add("disabled");
            this._closeYearPicker();
        },
        _onSelectDate: function (e) {
            var selected = this.dtpElement.querySelectorAll('a.dtp-select-day');
            for(var i=0; i<selected.length; i++) selected[i].classList.remove('selected');

            e.currentTarget.classList.add('selected');

            this.selectDate(e.currentTarget.parentNode.getAttribute("data-date"));

            if (this.params.switchOnClick === true && this.params.time === true)
                setTimeout(this.initHours.bind(this), 200);

            if (this.params.switchOnClick === true && this.params.time === false) {
                setTimeout(this._onOKClick.bind(this), 200);
            }
        },
        _onSelectHour: function (e) {
            if (!e.target.classList.contains('disabled')) {
                var value = e.target.getAttribute('data-hour');
                var parent = e.target.parentNode;

                var h = parent.querySelectorAll('.dtp-select-hour');
                for (var i = 0; i < h.length; i++) {
                    h[i].setAttribute('fill', 'transparent');
                }
                var th = parent.querySelectorAll('.dtp-select-hour-text');
                for (var i = 0; i < th.length; i++) {
                    th[i].setAttribute('fill', '#000');
                }

                parent.querySelector('#h-' + value).setAttribute('fill', '#8BC34A');
                parent.querySelector('#th-' + value).setAttribute('fill', '#fff');

                this.currentDate.hour(parseInt(value));

                if (this.params.shortTime === true && this.isPM()) {
                    this.currentDate.add(12, 'hours');
                }

                this.showTime(this.currentDate);

                this.animateHands();

                if (this.params.switchOnClick === true)
                    setTimeout(this.initMinutes.bind(this), 200);
            }
        },
        _onSelectMinute: function (e) {
            if (!e.target.classList.contains('disabled')) {
                var value = e.target.getAttribute('data-minute');
                var parent = e.target.parentNode;

                var m = parent.querySelectorAll('.dtp-select-minute');
                for (var i = 0; i < m.length; i++) {
                    m[i].setAttribute('fill', 'transparent');
                }
                var tm = parent.querySelectorAll('.dtp-select-minute-text');
                for (var i = 0; i < tm.length; i++) {
                    tm[i].setAttribute('fill', '#000');
                }

                parent.querySelector('#m-' + value).setAttribute('fill', '#8BC34A');
                parent.querySelector('#tm-' + value).setAttribute('fill', '#fff');

                this.currentDate.minute(parseInt(value));
                this.showTime(this.currentDate);

                this.animateHands();

                if (this.params.switchOnClick === true)
                    setTimeout(function () {
                        this.setElementValue();
                        this.hide();
                    }.bind(this), 200);
            }
        },
        _onSelectAM: function (e) {
            var links = this.dtpElement.querySelector('.dtp-actual-meridien').querySelectorAll('a');
            for(var i=0; i<links.length; i++) links[i].classList.remove('selected');
            e.currentTarget.classList.add('selected');

            if (this.currentDate.hour() >= 12) {
                if (this.currentDate.subtract(12, 'hours'))
                    this.showTime(this.currentDate);
            }
            this.toggleTime((this.currentView === 1));
        },
        _onSelectPM: function (e) {
            var links = this.dtpElement.querySelector('.dtp-actual-meridien').querySelectorAll('a');
            for(var i=0; i<links.length; i++) links[i].classList.remove('selected');
            e.currentTarget.classList.add('selected');

            if (this.currentDate.hour() < 12) {
                if (this.currentDate.add(12, 'hours'))
                    this.showTime(this.currentDate);
            }
            this.toggleTime((this.currentView === 1));
        },
        _hideCalendar: function () {
            this.dtpElement.querySelector('.dtp-picker-calendar').classList.add('hidden');
        },
        convertHours: function (h) {
            var _return = h;

            if (this.params.shortTime === true) {
                if ((h < 12) && this.isPM()) {
                    _return += 12;
                }
            }

            return _return;
        },
        setDate: function (date) {
            this.params.currentDate = date;
            this.initDates();
        },
        setMinDate: function (date) {
            this.params.minDate = date;
            this.initDates();
        },
        setMaxDate: function (date) {
            this.params.maxDate = date;
            this.initDates();
        },
        destroy: function () {
            this._detachEvents();
            this.dtpElement.remove();
        },
        show: function () {
            this.dtpElement.classList.remove('hidden');
            this._attachEvent(window, 'keydown', this._onKeydown.bind(this));
            this._centerBox();
            this._triggerEvent('open');
            if (this.params.monthPicker === true) {
                this._hideCalendar();
            }
        },
        hide: function () {
            window.removeEventListener('keydown', this._onKeydown.bind(this)); // This is tricky, see note in initButtons
            // Actually, we are using _attachEvent which pushes to _attachedEvents.
            // But _detachEvents clears ALL events.
            // When we hide, we only want to remove the keydown listener on window.
            // But our current implementation of _detachEvents removes everything attached during lifetime?
            // Wait, _detachEvents is called on destroy.
            // hide() should just remove the listeners it added.
            // Since we don't have a granular remove mechanism in _attachEvent easily,
            // we should probably just rely on the element being hidden and ignoring events?
            // No, window keydown needs to be removed.
            // Let's implement specific listener management or just ignore it for now as a minor leak if opened/closed many times?
            // No, we should fix it.
            // Let's change _attachEvent to return the function reference or just not use it for temporary listeners.

            // For now, I will not add 'keydown' to _attachedEvents array in show(), but manage it manually.

            this.dtpElement.classList.add('hidden');
            this._triggerEvent('close');
        },
        _centerBox: function () {
            var h = (this.dtpElement.offsetHeight - this.dtpElement.querySelector('.dtp-content').offsetHeight) / 2;
            this.dtpElement.querySelector('.dtp-content').style.marginLeft = -(this.dtpElement.querySelector('.dtp-content').offsetWidth / 2) + 'px';
            this.dtpElement.querySelector('.dtp-content').style.top = h + 'px';
        },
        enableDays: function () {
            var enableDays = this.params.enableDays;
            if (enableDays) {
                var tds = this.dtpElement.querySelectorAll(".dtp-picker-days tbody tr td");
                for(var i=0; i<tds.length; i++){
                    var td = tds[i];
                    // index of td in its row + previous rows...
                    // The original code used $(this).index() which is index among siblings.
                    var index = Array.prototype.indexOf.call(td.parentNode.children, td);

                    if (enableDays.indexOf(index) === -1) {
                         var a = td.querySelector('a');
                         if(a) {
                             a.style.background = "#e3e3e3";
                             a.style.cursor = "no-drop";
                             a.style.opacity = "0.5";
                             // removing event listener is hard without reference, but we can clone or just set pointer-events: none
                             a.style.pointerEvents = "none";
                         }
                    }
                }
            }
        }
    };

    // Fix show/hide listener issue
    var originalShow = BootstrapMaterialDatePicker.prototype.show;
    var originalHide = BootstrapMaterialDatePicker.prototype.hide;

    BootstrapMaterialDatePicker.prototype.show = function() {
        this._onKeydownBound = this._onKeydown.bind(this);
        window.addEventListener('keydown', this._onKeydownBound);
        originalShow.call(this);
    }

    BootstrapMaterialDatePicker.prototype.hide = function() {
        if(this._onKeydownBound) {
            window.removeEventListener('keydown', this._onKeydownBound);
        }
        this.dtpElement.classList.add('hidden');
        this._triggerEvent('close');
    }

    global.BootstrapMaterialDatePicker = BootstrapMaterialDatePicker;
})(window, moment);
