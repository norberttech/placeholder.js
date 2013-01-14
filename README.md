# Introduction #

This **is not another jQuery** plugin ;)  
Simple library that provides [placeholder](http://www.w3schools.com/html5/att_input_placeholder.asp)
behavior to IE 7+.  
It should also works fine with older FF or Opera (not tested).

# Usage #

* Read section [When you should not use it?](#when-you-should-not-use-it) of this document.
* Download [library](https://raw.github.com/norzechowicz/placeholder.js/master/placeholder.min.js) and put it in your code.
* Execute ``window.initPlaceholder()`` method after window load.

**Important**

Its also possible to use ``initPlaceholder``` only at selected element. For example
when you are using ajax you can initialize placeholders after sending request only at
ajax container element.

``
    window.initPlaceholder(document.getElementById('ajax-container'));
``

You probably also want to make elements with placeholders italic style with gray color.  
This can be done because every single element with active placeholder gets ``.placeholder`` class.   
Those lines in css should do the job

```css
.placeholder {
    font-style: italic;
    color: #a2a2a2;
}
```

## When you should not use it? ##

1. First of all this is only a hack. Until developers will not stop using such scripts
old browsers will still be alive. So if there is any posibility to not use it (for
example by using ``label`` elements in html) do it!

2. If you are using jQuery, mootls, yui or any other library you should't use
this script because there are many placeholder simulators based on different libraries.

## Demo ##

[Check it out!](http://norzechowicz.github.com/placeholder.js)

## Contributing ##

If you can see any typos, errors or potential improvements you are welcome to fork
this project and create pull request :)
