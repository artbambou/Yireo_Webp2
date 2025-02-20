define([
    'jquery',
    './has-webp',
    "domReady!"
], function ($, hasWebP) {
    'use strict';

    return function (widget) {
        $.widget('mage.SwatchRenderer', widget, {
            _init: function () {
                this._super();
                if (hasWebP()) {
                    $.each(this.options.jsonConfig.images, (function (key, imagesData) {
                        $.each(imagesData, (function (key, imageData) {
                            this._replaceImageData(imageData);
                        }).bind(this));
                    }).bind(this));
                }
            },

            _ProductMediaCallback: function ($this, response, isInProductView) {
                if (hasWebP()) {
                    this._replaceImageData(response);
                    if (response.gallery) {
                        $.each(response.gallery, (function (key, galleryImage) {
                            this._replaceImageData(galleryImage);
                        }).bind(this));
                    }
                }

                this._super($this, response, isInProductView);

                var swatchOptId = this._getSwatchOptIdFromElement($this);
                let $pictureTag = $('.product-image-container-' + swatchOptId + ' picture');
                $pictureTag.find('source').remove();
            },

            _replaceImageData: function (imageData) {
                if (_.isEmpty(imageData)) {
                    return imageData;
                }

                for (const [key, value] of Object.entries(imageData)) {
                    if (imageData[key + '_webp']) {
                        imageData[key] = imageData[key + '_webp'];
                    }
                }

                return imageData;
            },

            _getSwatchOptIdFromElement: function ($element) {
                const swatchOptRegex = /swatch-opt-([0-9]+)/;
                var swatchOptClass = $element.attr('class').split(' ').find(function(className) {
                    return swatchOptRegex.test(className);
                });

                var swatchOptMatch = swatchOptClass.match(swatchOptRegex);
                return swatchOptMatch[1];
            }
        });

        return $.mage.SwatchRenderer;
    }
});
