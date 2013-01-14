(function (window) {
    "use strict";
    var doc = window.document,
        placeholderTestElm = doc.createElement('input'),
        isSupported = !!((undefined !== placeholderTestElm.placeholder)),
        placeholderApi = {
            passwordElmNum : 0,
            hasClass : function (element, className) {
                return element.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
            },
            addClass : function (element, className) {
                if (!this.hasClass(element, className)) {
                    element.className += (element.className.length)
                        ? " " + className
                        : className;
                }
            },
            removeClass : function (element, className) {
                if (this.hasClass(element, className)) {
                    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
                    element.className = element.className.replace(reg, '');
                }
            },
            addListener : function (element, eventName, handler) {
                if (doc.addEventListener) {
                    element.addEventListener(eventName, handler, false);
                } else if (doc.attachEvent) {
                    element.attachEvent('on' + eventName, handler);
                } else {
                    element['on' + eventName] = handler;
                }
            },
            getTargetElements : function (containerParameter) {
                var container = (containerParameter !== undefined) ? containerParameter : doc,
                    inputs,
                    textareas,
                    elements,
                    index = 0,
                    i;

                if (!container) {
                    return [];
                }

                inputs = container.getElementsByTagName('input');
                textareas = container.getElementsByTagName('textarea');
                elements = new Array(inputs.length + textareas.length);

                for (i = 0; i < inputs.length; i += 1) {
                    elements[index] = inputs[i];
                    index += 1;
                }

                for (i = 0; i < textareas.length; i += 1) {
                    elements[index] = textareas[i];
                    index += 1;
                }

                return elements;
            },
            unsetPlaceholder : function (input) {
                var placeholder = input.getAttribute('placeholder'),
                    value = input.getAttribute('value'),
                    type = input.getAttribute('type');

                if (input.tagName === 'TEXTAREA') {
                    value = input.innerHTML;
                }

                if (placeholder) {
                    if (value && (placeholder === value)) {
                        if (typeof input.originalInput === 'object') {
                            input.style.display = 'none';
                            input.originalInput.style.display = '';
                            input.originalInput.focus();
                            return;
                        }

                        this.removeClass(input, 'placeholder');
                        if (input.tagName === 'TEXTAREA') {
                            input.innerHTML = '';
                            return;
                        }

                        input.setAttribute('value', '');
                    }
                }
            },
            setPlaceholder : function (input) {
                var placeholder = input.getAttribute('placeholder'),
                    value = input.getAttribute('value'),
                    type = input.getAttribute('type'),
                    inputParent = input.parentElement,
                    fakeElement = null;

                if (input.tagName === 'TEXTAREA') {
                    value = input.innerHTML;
                }

                if (placeholder) {
                    if (!value && !this.hasClass(input, 'placeholder')) {
                        if (type && type === 'password') {
                            fakeElement = doc.getElementById('fake' +
                                    ((input.getAttribute('name')) ? input.getAttribute('name') : '') +
                                    ((input.id) ? '_' + input.id : '') +
                                    ((input.getAttribute('placeholder')) ? '_' + input.getAttribute('placeholder') : 'placeholder')
                                );

                            if (!fakeElement) {
                                fakeElement = doc.createElement('input');
                                fakeElement.setAttribute('type', 'text');
                                fakeElement.setAttribute('id', 'fake' +
                                        ((input.getAttribute('name')) ? input.getAttribute('name') : '') +
                                        ((input.id) ? '_' + input.id : '') +
                                        ((input.getAttribute('placeholder')) ? '_' + input.getAttribute('placeholder') : 'placeholder')
                                    );
                                fakeElement.setAttribute('value', placeholder);
                                fakeElement.setAttribute('placeholder', placeholder);
                                fakeElement.setAttribute('class', input.className);
                                fakeElement.setAttribute('readonly', 'readonly');
                                fakeElement.originalInput = input;

                                if (!this.hasClass(fakeElement, 'placeholder')) {
                                    this.addClass(fakeElement, 'placeholder');
                                }

                                inputParent.insertBefore(fakeElement, input);

                                fakeElement.onfocus = function () {
                                    placeholderApi.unsetPlaceholder(this);
                                };
                            }

                            input.style.display = 'none';
                            fakeElement.style.display = '';
                            return;
                        }

                        this.addClass(input, 'placeholder');
                        if (input.tagName === 'TEXTAREA') {
                            input.innerHTML = placeholder;
                            return;
                        }

                        input.setAttribute('value', placeholder);
                    }
                }
            },
            removeChildrenPlaceholders : function (form) {
                var elements = placeholderApi.getTargetElements(form),
                    placeholder,
                    value,
                    i;

                for (i = 0; i < elements.length; i += 1) {
                    placeholder = elements[i].getAttribute('placeholder');
                    value = elements[i].getAttribute('value');

                    if (elements[i].tagName === 'TEXTAREA') {
                        value = elements[i].innerHTML;
                    }

                    if (placeholder && value && (placeholder === value)) {
                        if (elements[i].tagName === 'TEXTAREA') {
                            elements[i].innerHTML = '';
                            continue;
                        }
                        elements[i].setAttribute('value', '');
                    }
                }

                form.submit();
            },
            handlePlaceholderEvents : function (event) {
                event = event || window.event;
                var element = event.target || event.srcElement;

                if (typeof event.stopPropagation === "function") {
                    event.stopPropagation();
                }

                event.cancelBubble = true;
                if (typeof event.preventDefault === "function") {
                    event.preventDefault();
                }

                event.returnValue = false;
                switch (event.type) {
                case 'focus':
                    placeholderApi.unsetPlaceholder(element);
                    break;
                case 'blur':
                    placeholderApi.setPlaceholder(element);
                    break;
                case 'submit':
                    placeholderApi.removeChildrenPlaceholders(element);
                    break;
                }
            },
            initPlaceholder : function (container) {
                if (!isSupported) {
                    var forms = doc.getElementsByTagName('form'),
                        elements = placeholderApi.getTargetElements(container),
                        i;

                    if (elements.length) {
                        for (i = 0; i < elements.length; i += 1) {
                            placeholderApi.addListener(elements[i], 'focus', placeholderApi.handlePlaceholderEvents);
                            placeholderApi.addListener(elements[i], 'blur', placeholderApi.handlePlaceholderEvents);
                            placeholderApi.setPlaceholder(elements[i]);
                        }
                    }

                    for (i = 0; i < forms.length; i += 1) {
                        placeholderApi.addListener(forms[i], 'submit', placeholderApi.handlePlaceholderEvents);
                    }
                }
            }
        };

    window.initPlaceholder = placeholderApi.initPlaceholder;

}(this));
