$(document).ready(function(){

  //////////
  // Global variables
  //////////

  var _window = $(window);
  var _document = $(document);

  // BREAKPOINT SETTINGS
  var bp = {
    mobileS: 375,
    mobile: 568,
    tablet: 768,
    desktop: 992,
    wide: 1336,
    hd: 1680
  }

  var easingSwing = [.02, .01, .47, 1]; // default jQuery easing for anime.js

  ////////////
  // READY - triggered when PJAX DONE
  ////////////
  function pageReady(){
    legacySupport();
    updateHeaderActiveClass();
    initHeaderScroll();

    initPopups();
    initSliders();
    initScrollMonitor();
    initMasks();
    initValidations();
    // initLazyLoad();

    // development helper
    _window.on('resize', debounce(setBreakpoint, 200))
  }

  // this is a master function which should have all functionality
  pageReady();


  // some plugins work best with onload triggers
  _window.on('load', function(){
    // your functions
  })


  //////////
  // COMMON
  //////////

  function legacySupport(){
    // svg support for laggy browsers
    svg4everybody();

    // Viewport units buggyfill
    window.viewportUnitsBuggyfill.init({
      force: true,
      refreshDebounceWait: 150,
      appendToBody: true
    });
  }


  // Prevent # behavior
	_document
    .on('click', '[href="#"]', function(e) {
  		e.preventDefault();
  	})
    .on('click', 'a[href^="#section"]', function() { // section scroll
      var el = $(this).attr('href');
      $('body, html').animate({
          scrollTop: $(el).offset().top}, 1000);
      return false;
    })


  // HEADER SCROLL
  // add .header-static for .page or body
  // to disable sticky header
  function initHeaderScroll(){
    _window.on('scroll', throttle(function(e) {
      var vScroll = _window.scrollTop();
      var header = $('.header').not('.header--static');
      var headerHeight = header.height();
      var firstSection = _document.find('.page__content div:first-child()').height() - headerHeight;
      var visibleWhen = Math.round(_document.height() / _window.height()) >  2.5;

      if (visibleWhen){
        // vScroll > headerHeight
        if ( vScroll > headerHeight ){
          header.addClass('is-fixed');
        } else {
          header.removeClass('is-fixed');
        }
        if ( vScroll > firstSection ){
          header.addClass('is-fixed-visible');
        } else {
          header.removeClass('is-fixed-visible');
        }
      }
    }, 10));
  }


  // HAMBURGER TOGGLER
  _document.on('click', '[js-hamburger]', function(){
    $("html").addClass('is-activeMenu');
    $("#menu").addClass("slideInLeft").removeClass("fadeOut");
  });
  _document.on('click', '[js-backMenu], .menu__row a', function(){
    $("html").removeClass('is-activeMenu');
    $("#menu").removeClass("slideInLeft").addClass("fadeOut");
  });
  _document.on('click', '.menu__logo', function(){
    $("html").removeClass('is-activeMenu');
    $("#menu").removeClass("slideInLeft").addClass("fadeOut");
  });
  _document.on('click', '[js-order]', function(){
    $("html").addClass('is-activeOrder');
  });
  _document.on('keyup', function(e){
    if (e.keyCode === 27) {
      $("html").removeClass('is-activeMenu is-activeOrder');
    }
  });
  _document.on("click", ".order", function(e) {
    if(!$(e.target).closest(".order__block").length) {
      $("html").removeClass('is-activeMenu is-activeOrder');
    }
  });

  _document.on('click', "[js-chooseLabel]", function (e) {
    var el = $(e.target).closest(".modal__form-field");
    var data = el.attr("data-count");

    $("[js-count]").text(data);

    $("[js-chooseLabel]").removeClass('is-choose');
    el.addClass("is-choose");

    $(this).closest('.modal').find('input[name="people"]').val(data);
  });
  _document.on('click', ".js-chooseModal", function (e) {
    $(".modal__form-choose").removeClass('is-active');
    $(".modal__form-data").addClass('is-active');
  });

  _document.on('click', ".order__form-social a", function (e) {
    var value = $(this).attr('title');
    $(this).parent().find('input[type=hidden]').val(value);

    $(this).siblings().removeClass('is-active');
    $(this).addClass('is-active');
  });

  function closeMobileMenu(){
    $('[js-hamburger]').removeClass('is-active');
    $('.mobile-navi').removeClass('is-active');
  }

  // SET ACTIVE CLASS IN HEADER
  // * could be removed in production and server side rendering when header is inside barba-container
  function updateHeaderActiveClass(){
    $('.header__menu li').each(function(i,val){
      if ( $(val).find('a').attr('href') == window.location.pathname.split('/').pop() ){
        $(val).addClass('is-active');
      } else {
        $(val).removeClass('is-active')
      }
    });
  }

  //////////
  // SLIDERS
  //////////

  function initSliders(){
    var slickPrevArrow = '<div class="slick-prev"><i class="icon-prev"></div>';
    var slickNextArrow = '<div class="slick-next"><i class="icon-next"></div>';

    // General purpose sliders
    $('[js-slider]').each(function(i, slider){
      var self = $(slider);

      // set data attributes on slick instance to control
      if (self && self !== undefined) {
        self.slick({
          autoplay: self.data('slick-autoplay') !== undefined ? true : false,
          dots: self.data('slick-dots') !== undefined ? true : false,
          arrows: self.data('slick-arrows') !== undefined ? true : false,
          prevArrow: slickNextArrow,
          nextArrow: slickPrevArrow,
          infinite: self.data('slick-infinite') !== undefined ? true : true,
          speed: 300,
          slidesToShow: 1,
          accessibility: false,
          adaptiveHeight: true,
          draggable: self.data('slick-no-controls') !== undefined ? false : true,
          swipe: self.data('slick-no-controls') !== undefined ? false : true,
          swipeToSlide: self.data('slick-no-controls') !== undefined ? false : true,
          touchMove: self.data('slick-no-controls') !== undefined ? false : true
        });
      }

    })

    // other individual sliders goes here
    if($('.js-myCustomSlider')) {
      $('.js-myCustomSlider').not('.slick-initialized').slick({
        dots: true,
        prevArrow: false,
        nextArrow: false,
        infinite: true,
        speed: 550,
        pauseOnDotsHover: true,
        fade: true,
        slidesToShow: 1,
        autoplay: true,
        customPaging: function(slick,index) {

          var sliderName = $(".js-myCustomSlider"),
            arrNum = sliderName.data('num'),
            arrText = sliderName.data('text');

          return '<div>' +
            '<p>' + arrNum[index] + '</p>' +
            '<p>' + arrText[index] + '</p>' +
            '</div>';
        }
      });
    }

    // other individual sliders goes here
    if ($('.js-programSuitSlider')) {
      $('.js-programSuitSlider').not('.slick-initialized').slick({
        dots: true,
        pauseOnDotsHover: true,
        prevArrow: false,
        nextArrow: false,
        speed: 550,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 3,
        customPaging: function() {
          return '<div></div>';
        }
      });
    }

    // Reviews
    if ($('.js-reviews')) {
      $('.js-reviews').not('.slick-initialized').slick({
        dots: false,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 5000,
        prevArrow: slickPrevArrow,
        nextArrow: slickNextArrow,
        speed: 550,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1
      });
    }
  }

  //////////
  // MODALS
  //////////

  function initPopups(){
    // Magnific Popup

    var startWindowScroll = 0;

    $('.js-popup').magnificPopup({
      type: 'inline',
      fixedContentPos: true,
      fixedBgPos: true,
      overflowY: 'auto',
      closeBtnInside: true,
      preloader: false,
      midClick: true,
      removalDelay: 300,
      mainClass: 'show',
      callbacks: {
        beforeOpen: function() {
          startWindowScroll = _window.scrollTop();
          // $('html').addClass('mfp-helper');
        },
        close: function() {
          // $('html').removeClass('mfp-helper');
          _window.scrollTop(startWindowScroll);

          $(".modal__form-choose").addClass('is-active');
          $(".modal__form-data").removeClass('is-active');
        }
      }
    });

    $('.js-order').magnificPopup({
      type: 'inline',
      fixedContentPos: true,
      fixedBgPos: true,
      overflowY: 'auto',
      closeBtnInside: true,
      preloader: false,
      midClick: true,
      removalDelay: 300,
      mainClass: 'show',
      callbacks: {
        beforeOpen: function() {
          startWindowScroll = _window.scrollTop();
          // $('html').addClass('mfp-helper');
        },
        open: function(){
          var mfp = $.magnificPopup.instance;
          var parentBlock = mfp.currItem.el.closest('.programs__block');
          var programName = parentBlock.find('.programs__block-header h4').html();

          mfp.content.find('span').html(programName);
          mfp.content.find('input[name="programm"]').val(programName)
        },
        close: function() {
          // $('html').removeClass('mfp-helper');
          _window.scrollTop(startWindowScroll);

          $(".modal__form-choose").addClass('is-active');
          $(".modal__form-data").removeClass('is-active');
        }
      }
    });

    $('.js-play').magnificPopup({
      type: 'inline',
      fixedContentPos: true,
      fixedBgPos: true,
      overflowY: 'auto',
      closeBtnInside: false,
      preloader: false,
      midClick: true,
      removalDelay: 300,
      mainClass: 'show',
      callbacks: {
        beforeOpen: function() {
          startWindowScroll = _window.scrollTop();
          // $('html').addClass('mfp-helper');

          var slickNextArrow = '<div class="slick-prev"><i class="icon-prev"></div>';
          var slickPrevArrow = '<div class="slick-next"><i class="icon-next"></div>';

          $('.js-gallerySlider').not('.slick-initialized').slick({
            dots: false,
            prevArrow: slickNextArrow,
            nextArrow: slickPrevArrow,
            speed: 550,
            infinite: true,
            slidesToShow: 1,
            adaptiveHeight: true,
            slidesToScroll: 1,
            fade: true,
            cssEase: 'linear',
            lazyLoad: 'ondemand'
          }).on('init');
        },
        close: function() {
          // $('html').removeClass('mfp-helper');
          _window.scrollTop(startWindowScroll);
        }
      }
    });

    $('[js-popup-gallery]').magnificPopup({
  		delegate: 'a',
  		type: 'image',
  		tLoading: 'Загрузка #%curr%...',
  		mainClass: 'popup-buble',
  		gallery: {
  			enabled: true,
  			navigateByImgClick: true,
  			preload: [0,1]
  		},
  		image: {
  			tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
  		}
  	});
  }

  _document.on('click', '.js-close-modal', function(){
    closeMfp();
  })

  function closeMfp(){
    $.magnificPopup.close();
  }

  ////////////
  // UI
  ////////////

  // textarea autoExpand
  _document
    .one('focus.autoExpand', '.ui-group textarea', function(){
        var savedValue = this.value;
        this.value = '';
        this.baseScrollHeight = this.scrollHeight;
        this.value = savedValue;
    })
    .on('input.autoExpand', '.ui-group textarea', function(){
        var minRows = this.getAttribute('data-min-rows')|0, rows;
        this.rows = minRows;
        rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 17);
        this.rows = minRows + rows;
    });

  // Masked input
  function initMasks(){
    $("[js-dateMask]").mask("99.99.99",{placeholder:"ДД.ММ.ГГ"});
    $("input[type='tel']").mask("+7 (000) 000-0000", {placeholder: "+7 (___) ___-____"});
  }


  ////////////
  // SCROLLMONITOR - WOW LIKE
  ////////////
  function initScrollMonitor(){
    $('.wow').each(function(i, el){

      var elWatcher = scrollMonitor.create( $(el) );

      var delay;
      if ( $(window).width() < 768 ){
        delay = 0
      } else {
        delay = $(el).data('animation-delay');
      }

      var animationClass = $(el).data('animation-class') || "wowFadeUp";

      var animationName = $(el).data('animation-name') || "wowFade";

      elWatcher.enterViewport(throttle(function() {
        $(el).addClass(animationClass);
        $(el).css({
          'animation-name': animationName,
          'animation-delay': delay,
          'visibility': 'visible'
        });
      }, 100, {
        'leading': true
      }));
      // elWatcher.exitViewport(throttle(function() {
      //   $(el).removeClass(animationClass);
      //   $(el).css({
      //     'animation-name': 'none',
      //     'animation-delay': 0,
      //     'visibility': 'hidden'
      //   });
      // }, 100));
    });

  }

  //////////
  // BARBA PJAX
  //////////

  Barba.Pjax.Dom.containerClass = "page";

  var FadeTransition = Barba.BaseTransition.extend({
    start: function() {
      Promise
        .all([this.newContainerLoading, this.fadeOut()])
        .then(this.fadeIn.bind(this));
    },

    fadeOut: function() {
      var deferred = Barba.Utils.deferred();

      anime({
        targets: this.oldContainer,
        opacity : .5,
        easing: easingSwing, // swing
        duration: 300,
        complete: function(anim){
          deferred.resolve();
        }
      })

      return deferred.promise
    },

    fadeIn: function() {
      var _this = this;
      var $el = $(this.newContainer);

      $(this.oldContainer).hide();

      $el.css({
        visibility : 'visible',
        opacity : .5
      });

      anime({
        targets: "html, body",
        scrollTop: 0,
        easing: easingSwing, // swing
        duration: 150
      });

      anime({
        targets: this.newContainer,
        opacity: 1,
        easing: easingSwing, // swing
        duration: 300,
        complete: function(anim) {
          triggerBody();
          _this.done();
        }
      });
    }
  });

  // set barba transition
  Barba.Pjax.getTransition = function() {
    return FadeTransition;
  };

  Barba.Prefetch.init();
  Barba.Pjax.start();

  Barba.Dispatcher.on('newPageReady', function(currentStatus, oldStatus, container, newPageRawHTML) {

    pageReady();
    closeMobileMenu();

    $('.header').removeClass('is-fixed');

    _window.scrollTop(1);
  });

  // some plugins get bindings onNewPage only that way
  function triggerBody(){
    $(window).scroll();
    $(window).resize();
  }

  //////////
  // DEVELOPMENT HELPER
  //////////
  function setBreakpoint(){
    var wHost = window.location.host.toLowerCase()
    var displayCondition = wHost.indexOf("localhost") >= 0 || wHost.indexOf("surge") >= 0
    if (displayCondition){
      console.log(displayCondition)
      var wWidth = _window.width();

      var content = "<div class='dev-bp-debug'>"+wWidth+"</div>";

      $('.page').append(content);
      setTimeout(function(){
        $('.dev-bp-debug').fadeOut();
      },1000);
      setTimeout(function(){
        $('.dev-bp-debug').remove();
      },1500)
    }
  }

  // alert(jQuery.fn.jquery);

  // FORM VALIDATIONS
  ////////////////

  function initValidations(){

    // jQuery validate plugin
    // https://jqueryvalidation.org

    var validateErrorPlacement = function(error, element) {
      error.addClass('ui-input__validation');
      error.appendTo(element.parent("div"));
    }
    var validateHighlight = function(element) {
      $(element).parent('div').addClass("has-error");
    }
    var validateUnhighlight = function(element) {
      $(element).parent('div').removeClass("has-error");
    }

    var validatePhone = {
      required: true,
      normalizer: function(value) {
          var PHONE_MASK = '+X (XXX) XXX-XXXX';
          if (!value || value === PHONE_MASK) {
              return value;
          } else {
              return value.replace(/[^\d]/g, '');
          }
      },
      minlength: 11,
      digits: true
    };

    jQuery.validator.addMethod("dateITA", function(value, element) {
        var check = false;
        var re = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
        if( re.test(value)) {
            var adata = value.split('/');
            var gg = parseInt(adata[0],10);
            var mm = parseInt(adata[1],10);
            var aaaa = parseInt(adata[2],10);
            var xdata = new Date(aaaa,mm-1,gg);
            var currentdata = new Date();

            if ( xdata.getFullYear() >= currentdata.getFullYear() + 2 ) {
                check = false;
            }
            else if ( ( xdata.getFullYear() === aaaa ) && ( xdata.getMonth() === mm - 1 ) && ( xdata.getDate() === gg ) ){
                check = true;
            } else {
                check = false;
            }
        } else {
            check = false;
        }
        return this.optional(element) || check;
    }, "Please enter a correct date");

    // ORDER
    ////////////////////
    $("[js-registrationOrder]").validate({
      errorPlacement: validateErrorPlacement,
      highlight: validateHighlight,
      unhighlight: validateUnhighlight,
      submitHandler: function(form) {
        $(form).addClass('loading');
        $.ajax({
          type: "POST",
          url: 'php/order.php',
          data: $(form).serialize(),
          success: function(response) {
            $(form).removeClass('loading');
            var data = $.parseJSON(response);
            if (data.success == true) {
              // blank all values
              $(form).find('input').val('');
              // hide form
              $("html").removeClass('is-activeOrder');

              // paste sucess message
              $('#thanks').find('[data-message]').html(data.message);

              // show modal
              $.magnificPopup.open({
                items: {
                  src: '#thanks'
                },
                type: 'inline',
                fixedContentPos: true,
                fixedBgPos: true,
                overflowY: 'auto',
                closeBtnInside: true,
                preloader: false,
                midClick: true,
                removalDelay: 300,
                mainClass: 'show',
                callbacks: {
                  close: function() {
                    // $('html').removeClass('mfp-helper');
                    $(".modal__form-choose").addClass('is-active');
                    $(".modal__form-data").removeClass('is-active');
                  }
                }
              });
            } else {
              $(form).find('[data-message]').html(data.message).show();
            }
          }
        })

      },
      rules: {
        name: "required",
        email: {
          required: true,
          email: true
        },
        date: {
          required: true,
          // date: dateValidator,
          dateITA: true
        },
        phone: validatePhone
      },
      messages: {
        name: "Заполните это поле",
        email: {
          required: "Заполните это поле",
          email: "Email содержит неправильный формат"
        },
        date: {
          required: "Заполните это поле",
          dateITA: "Введите дату в формате dd/mm/yyyy"
        },
        phone: {
          required: "Заполните это поле",
          minlength: "Введите не менее 11 символов",
          phone: "Введите корректный телефон"
        }
      }
    });

    $("#date").mask("99/99/9999");

    // CONTACTS
    ////////////////////
    $("[js-contacts]").validate({
      errorPlacement: validateErrorPlacement,
      highlight: validateHighlight,
      unhighlight: validateUnhighlight,
      submitHandler: function(form) {
        $(form).addClass('loading');
        $.ajax({
          type: "POST",
          url: 'php/contacts.php',
          data: $(form).serialize(),
          success: function(response) {
            $(form).removeClass('loading');
            var data = $.parseJSON(response);
            if (data.success == true) {
              // blank all values
              $(form).find('input').val('');

              // paste sucess message
              $('#thanks').find('[data-message]').html(data.message);

              // show modal
              $.magnificPopup.open({
                items: {
                  src: '#thanks'
                },
                type: 'inline',
                fixedContentPos: true,
                fixedBgPos: true,
                overflowY: 'auto',
                closeBtnInside: true,
                preloader: false,
                midClick: true,
                removalDelay: 300,
                mainClass: 'show',
                callbacks: {
                  close: function() {
                    // $('html').removeClass('mfp-helper');
                    $(".modal__form-choose").addClass('is-active');
                    $(".modal__form-data").removeClass('is-active');
                  }
                }
              });
            } else {
              $(form).find('[data-message]').html(data.message).show();
            }
          }
        })
      },
      rules: {
        name: "required",
        email: {
          required: true,
          email: true
        },
        phone: validatePhone
      },
      messages: {
        name: "Заполните это поле",
        email: {
          required: "Заполните это поле",
          email: "Email содержит неправильный формат"
        },
        phone: {
          required: "Заполните это поле",
          minlength: "Введите не менее 11 символов",
          phone: "Введите корректный телефон"
        }
      }
    });



    /// modal
    $("[js-modal]").validate({
      errorPlacement: validateErrorPlacement,
      highlight: validateHighlight,
      unhighlight: validateUnhighlight,
      submitHandler: function(form) {
        $(form).addClass('loading');
        $.ajax({
          type: "POST",
          url: 'php/call.php',
          data: $(form).serialize(),
          success: function(response) {
            $(form).removeClass('loading');
            var data = $.parseJSON(response);
            if (data.success == true) {
              // blank all values
              $(form).find('input').val('');

              // paste sucess message
              $('#thanks').find('[data-message]').html(data.message);

              // show modal
              $.magnificPopup.open({
                items: {
                  src: '#thanks'
                },
                type: 'inline',
                fixedContentPos: true,
                fixedBgPos: true,
                overflowY: 'auto',
                closeBtnInside: true,
                preloader: false,
                midClick: true,
                removalDelay: 300,
                mainClass: 'show',
                callbacks: {
                  close: function() {
                    // $('html').removeClass('mfp-helper');
                    $(".modal__form-choose").addClass('is-active');
                    $(".modal__form-data").removeClass('is-active');
                  }
                }
              });
            } else {
              $(form).find('[data-message]').html(data.message).show();
            }
          }
        })
      },
      rules: {
        name: "required",
        email: {
          required: true,
          email: true
        },
        phone: validatePhone
      },
      messages: {
        name: "Заполните это поле",
        email: {
          required: "Заполните это поле",
          email: "Email содержит неправильный формат"
        },
        phone: {
          required: "Заполните это поле",
          minlength: "Введите не менее 11 символов",
          phone: "Введите корректный телефон"
        }
      }
    });

  }

});
function setViewport(){
  var metaTag = '<meta name="viewport" content="width=device-width, initial-scale=1">';

  if($(window).width() < '1024') {
    $('head meta[name="viewport"]').remove();
  } else {
    if($('head meta[name="viewport"]').length === 0) {
      $('head').append(metaTag);
    } else {
    }
  }
}

$(window).on("load ready", setViewport);
$(window).on("resize", debounce(setViewport, 200));
