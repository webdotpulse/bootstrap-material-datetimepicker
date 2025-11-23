# Bootstrap Material DateTimePicker (BS5 - Vanilla JS)

Originaly designed for Bootstrap Material, this V2.0 is now completely standalone, responsive, and works with **Bootstrap 5** and **Vanilla JavaScript** (no jQuery required).

### Prerequisites

- **Bootstrap 5** (CSS & JS Bundle)
- **Moment.js**
- **Google Material Icons** (Font)

```html
<!-- Bootstrap 5 CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- Google Fonts & Icons -->
<link href="https://fonts.googleapis.com/css?family=Roboto:400,500" rel="stylesheet" type="text/css">
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

<!-- Bootstrap Bundle JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<!-- Moment.js -->
<script type="text/javascript" src="https://momentjs.com/downloads/moment-with-locales.min.js"></script>
```

### Installation

Include the `bootstrap-material-datetimepicker.css` and `bootstrap-material-datetimepicker.js` files in your project.

```html
<link rel="stylesheet" href="./bootstrap-material-datetimepicker.css" />
<script type="text/javascript" src="./bootstrap-material-datetimepicker.js"></script>
```

### Usage

Initialize the picker on an input element using `new BootstrapMaterialDatePicker(element, options)`.

```javascript
const inputElement = document.getElementById('date');
const picker = new BootstrapMaterialDatePicker(inputElement, {
    weekStart : 0,
    time: false
});
```

### Parameters

| Name            | Type                       | Description                                                                 |
| --------------- | -------------------------- | --------------------------------------------------------------------------- |
| **format**      | String                     | MomentJS Format (default: 'YYYY-MM-DD')                                     |
| **shortTime**   | Boolean                    | true => Display 12 hours AM\|PM (default: false)                            |
| **minDate**     | (String\|Date\|Moment)     | Minimum selectable date (default: null)                                     |
| **maxDate**     | (String\|Date\|Moment)     | Maximum selectable date (default: null)                                     |
| **currentDate** | (String\|Date\|Moment)     | Initial Date (default: null)                                                |
| **year**        | Boolean                    | true => Has Yearpicker (default: true)                                      |
| **date**        | Boolean                    | true => Has Datepicker (default: true)                                      |
| **time**        | Boolean                    | true => Has Timepicker (default: true)                                      |
| **disabledDays**| Array                      | Array containing day indices to disable                                     |
| **clearButton** | Boolean                    | true => Show Clear Button (default: false)                                  |
| **nowButton**   | Boolean                    | true => Show Now Button (default: false)                                    |
| **switchOnClick**| Boolean                   | true => Switch view on click (default: false)                               |
| **cancelText**  | String                     | Text for the cancel button (default: 'Cancel')                              |
| **okText**      | String                     | Text for the OK button (default: 'OK')                                      |
| **clearText**   | String                     | Text for the Clear button (default: 'Clear')                                |
| **nowText**     | String                     | Text for the Now button (default: 'Now')                                    |
| **triggerEvent**| String                     | Event to fire the calendar (default: 'focus')                               |
| **monthPicker** | Boolean                    | true => Act as monthpicker (hide calendar) (default: false)                 |
| **weekStart**   | Integer (0 -> 6)           | 0 => Sunday, 1 => Monday, etc. (default: 0)                                 |
| **lang**        | String                     | Language code for Moment.js (default: 'en')                                 |

### Events

Events are dispatched on the input element. You can listen to them using `addEventListener`.

```javascript
const input = document.getElementById('date-end');
const dateEnd = new BootstrapMaterialDatePicker(input, { weekStart : 0 });

input.addEventListener('change', function(e) {
    // Accessed via e.detail.date
    console.log(e.detail.date);
});
```

| Name             | Detail Property | Description                                      |
| ---------------- | --------------- | ------------------------------------------------ |
| **beforeChange** | `date`          | OK button is clicked                             |
| **change**       | `date`          | OK button is clicked and input value is changed  |
| **dateSelected** | `date`          | New date is selected                             |
| **yearSelected** | `date`          | New year is selected                             |
| **open**         | -               | Datepicker is opened                             |
| **close**        | -               | Datepicker is closed                             |

### Methods

You can call methods on the instance returned by the constructor.

```javascript
var dtp = new BootstrapMaterialDatePicker(document.getElementById('date'), {});
dtp.setDate(moment());
```

| Name           | Parameter                  | Description                   |
| -------------- | -------------------------- | ----------------------------- |
| **setDate**    | (String\|Date\|Moment)     | Set initial date              |
| **setMinDate** | (String\|Date\|Moment)     | Set minimum selectable date   |
| **setMaxDate** | (String\|Date\|Moment)     | Set maximum selectable date   |
| **destroy**    | NULL                       | Destroy the datepicker        |
