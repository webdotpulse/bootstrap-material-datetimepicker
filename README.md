# bootstrap-material-datetimepicker
Material DateTimePicker

<p>Originaly designed for Bootstrap Material, the V2.0 is now completely standalone and responsive.</p>

(\*) File names have been changed

bootstrap-material-datepicker.js => bootstrap-material-date**time**picker.js

bootstrap-material-datepicker.css => bootstrap-material-date**time**picker.css

### Prerequisites

jquery [http://jquery.com/download/](http://jquery.com/download/)

momentjs [http://momentjs.com/](http://momentjs.com/)

Google Material Icon Font `<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">`

### Usage

	$('input').bootstrapMaterialDatePicker();

### bower

	bower install bootstrap-material-datetimepicker

### Parameters

| Name				| Type							| Description									|
| ----------------- | ----------------------------- | --------------------------------------------- |
| **format**		| String						| MomentJS Format								|
| **shortTime**		| Boolean						| true => Display 12 hours AM|PM 				|
| **minDate**		| (String\|Date\|Moment)		| Minimum selectable date						|
| **maxDate**		| (String\|Date\|Moment)		| Maximum selectable date						|
| **currentDate**	| (String\|Date\|Moment)		| Initial Date									|
| **year**			| Boolean						| true => Has Yearpicker						|
| **date**			| Boolean						| true => Has Datepicker						|
| **disabledDays**	| Array							| Array containing day indices (1-7) to disable	|
| **time**			| Boolean						| true => Has Timepicker						|
| **clearButton**	| Boolean						| true => Show Clear Button						|
| **nowButton**		| Boolean						| true => Show Now Button						|
| **switchOnClick**	| Boolean						| true => Switch view on click (default: false) |
| **cancelText**	| String						| Text for the cancel button (default: Cancel)	|
| **okText**		| String						| Text for the OK button (default: OK)			|
| **clearText**		| String						| Text for the Clear button (default: Clear)	|
| **nowText**		| String						| Text for the Now button (default: Now)		|
| **triggerEvent**		| String						| Event to fire the calendar (default: focus)		|
| **monthPicker**	| Boolean						| true => Act as monthpicker (hide calendar) (default: false) |
| **weekStart**	| Integer (0 -> 6)						| 1 => Set monday as first day of week (default: 0, sunday) |
| **lang**	| String						| 'fr' => Set language of calendar to french (default: 'en', english. Any available language included in Moment.js) |



### Events

| Name				| Parameters				| Description										|
| ----------------- | ------------------------- | ------------------------------------------------- |
| **beforeChange**	| event, date				| OK button is clicked								|
| **change**		| event, date				| OK button is clicked and input value is changed	|
| **yearSelected**	        | event, date			        | New year is selected								|
| **dateSelected**	| event, date				| New date is selected								|
| **open**	        | event				        | datepicker is opened								|
| **close**	        | event				        | datepicker is closed								|


### Methods

        $('input').bootstrapMaterialDatePicker('setDate', moment());

| Name				| Parameter					| Description					|
| ----------------- | ------------------------- | ----------------------------- |
| **setDate**		| (String\|Date\|Moment)	| Set initial date				|
| **setMinDate**	| (String\|Date\|Moment)	| Set minimum selectable date	|
| **setMaxDate**	| (String\|Date\|Moment)	| Set maximum selectable date	|
| **destroy**		| NULL						| Destroy the datepicker		|

