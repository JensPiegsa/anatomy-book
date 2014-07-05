// Generated by CoffeeScript 1.7.1
(function() {
  var BOOK_TEMPLATE, BookConfig, fa, jq, _base, _base1, _base2, _base3;

  BookConfig = window.Book || {};

  if (BookConfig.includes == null) {
    BookConfig.includes = {};
  }

  if ((_base = BookConfig.includes).jquery == null) {
    _base.jquery = '//code.jquery.com/jquery-1.11.1.min.js';
  }

  if ((_base1 = BookConfig.includes).fontawesome == null) {
    _base1.fontawesome = '//maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css';
  }

  if (BookConfig.urlFixer == null) {
    BookConfig.urlFixer = function(val) {
      return val;
    };
  }

  if (BookConfig.toc == null) {
    BookConfig.toc = {};
  }

  if ((_base2 = BookConfig.toc).url == null) {
    _base2.url = '../toc';
  }

  if ((_base3 = BookConfig.toc).selector == null) {
    _base3.selector = 'nav, ol, ul';
  }

  if (BookConfig.baseHref == null) {
    BookConfig.baseHref = null;
  }

  if (BookConfig.serverAddsTrailingSlash == null) {
    BookConfig.serverAddsTrailingSlash = false;
  }

  if (BookConfig.includes.jquery) {
    jq = document.createElement('script');
    jq.src = BookConfig.includes.jquery;
    document.head.appendChild(jq);
  }

  if (BookConfig.includes.fontawesome) {
    fa = document.createElement('link');
    fa.rel = 'stylesheet';
    fa.href = BookConfig.includes.fontawesome;
    document.head.appendChild(fa);
  }

  BOOK_TEMPLATE = '<div class="book without-animation with-summary font-size-2 font-family-1">\n\n  <div class="book-header">\n    <a href="#" class="btn pull-left toggle-summary" aria-label="Toggle summary"><i class="fa fa-align-justify"></i></a>\n    <h1><i class="fa fa-spinner fa-spin book-spinner"></i><span class="book-title"></span></h1>\n  </div>\n\n  <div class="book-summary">\n  </div>\n\n  <div class="book-body">\n    <div class="body-inner">\n      <div class="page-wrapper" tabindex="-1">\n        <div class="book-progress">\n        </div>\n        <div class="page-inner">\n          <section class="normal">\n            <!-- content -->\n          </section>\n        </div>\n      </div>\n    </div>\n  </div>\n\n</div>';

  $(function() {
    var $body, $book, $bookBody, $bookPage, $bookSummary, $bookTitle, $originalPage, $toggleSummary, TocHelper, addTrailingSlash, changePage, removeTrailingSlash, renderNextPrev, renderToc, tocHelper;
    $body = $('body');
    $originalPage = $body.contents();
    $body.contents().remove();
    $body.append(BOOK_TEMPLATE);
    $book = $body.find('.book');
    $toggleSummary = $book.find('.toggle-summary');
    $bookSummary = $book.find('.book-summary');
    $bookBody = $book.find('.book-body');
    $bookPage = $book.find('.page-inner > .normal');
    $bookTitle = $book.find('.book-title');
    $toggleSummary.on('click', function(evt) {
      $book.toggleClass('with-summary');
      return evt.preventDefault();
    });
    renderToc = function() {
      var $summary;
      $summary = $('<ul class="summary"></ul>');
      if (BookConfig.issuesUrl) {
        $summary.append("<li class='issues'><a href='" + BookConfig.issuesUrl + "'>Questions and Issues</a></li>");
      }
      $summary.append("<li class='edit-contribute'><a href='" + BookConfig.url + "'>Edit and Contribute</a></li>");
      $summary.append('<li class="divider"/>');
      $summary.append(tocHelper.$toc.children('li'));
      $bookSummary.contents().remove();
      $bookSummary.append($summary);
      return renderNextPrev();
    };
    renderNextPrev = function() {
      var $nextPage, $prevPage, current, next, prev;
      $bookBody.children('.navigation').remove();
      current = removeTrailingSlash(window.location.href);
      prev = tocHelper.prevPageHref(current);
      next = tocHelper.nextPageHref(current);
      if (prev) {
        prev = URI(addTrailingSlash(prev)).relativeTo(URI(window.location.href)).toString();
        $prevPage = $("<a class='navigation navigation-prev' href='" + prev + "'><i class='fa fa-chevron-left'></i></a>");
        $bookBody.append($prevPage);
      }
      if (next) {
        next = URI(addTrailingSlash(next)).relativeTo(URI(window.location.href)).toString();
        $nextPage = $("<a class='navigation navigation-next' href='" + next + "'><i class='fa fa-chevron-right'></i></a>");
        return $bookBody.append($nextPage);
      }
    };
    addTrailingSlash = function(href) {
      if (BookConfig.serverAddsTrailingSlash && href[href.length - 1] !== '/') {
        href += '/';
      }
      return href;
    };
    removeTrailingSlash = function(href) {
      if (BookConfig.serverAddsTrailingSlash && href[href.length - 1] === '/') {
        href = href.substring(0, href.length - 1);
      }
      return href;
    };
    tocHelper = new (TocHelper = (function() {
      function TocHelper() {}

      TocHelper.prototype._tocHref = null;

      TocHelper.prototype._tocList = [];

      TocHelper.prototype._tocTitles = {};

      TocHelper.prototype.loadToc = function(_tocHref, $toc, $title) {
        var $a, a, el, href, tocUrl, _i, _len, _ref;
        this._tocHref = _tocHref;
        this.$toc = $toc;
        this.$title = $title;
        tocUrl = URI(BookConfig.toc.url).absoluteTo(removeTrailingSlash(window.location.href));
        this._tocTitles = {};
        this._tocList = (function() {
          var _i, _len, _ref, _results;
          _ref = $toc.find('a[href]');
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            el = _ref[_i];
            href = URI(el.getAttribute('href')).absoluteTo(tocUrl).toString();
            this._tocTitles[href] = $(el).text();
            _results.push(href);
          }
          return _results;
        }).call(this);
        if (BookConfig.serverAddsTrailingSlash) {
          _ref = this.$toc.find('a');
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            a = _ref[_i];
            $a = $(a);
            href = $a.attr('href');
            href = '../' + href;
            $a.attr('href', href);
          }
        }
        return renderToc();
      };

      TocHelper.prototype._currentPageIndex = function(currentHref) {
        return this._tocList.indexOf(currentHref);
      };

      TocHelper.prototype.prevPageHref = function(currentHref) {
        var currentIndex;
        currentIndex = this._currentPageIndex(currentHref);
        return this._tocList[currentIndex - 1];
      };

      TocHelper.prototype.nextPageHref = function(currentHref) {
        var currentIndex;
        currentIndex = this._currentPageIndex(currentHref);
        return this._tocList[currentIndex + 1];
      };

      return TocHelper;

    })());
    $.ajax({
      url: BookConfig.urlFixer(BookConfig.toc.url),
      headers: {
        'Accept': 'application/xhtml+xml'
      },
      dataType: 'html'
    }).then(function(html) {
      var $root, $title, $toc;
      $root = $('<div>' + html + '</div>');
      $toc = $root.find(BookConfig.toc.selector).first();
      if ($toc[0].tagName.toLowerCase() === 'ul') {
        $title = $toc.children().first().contents();
        $toc = $toc.find('ul').first();
      } else {
        $title = $root.children('title').contents();
      }
      tocHelper.loadToc(BookConfig.toc.url, $toc, $title);
      return $bookTitle.html(tocHelper.$title);
    });
    if (BookConfig.baseHref) {
      $book.find('base').remove();
      $book.prepend("<base href='" + BookConfig.baseHref + "'/>");
    }
    $bookPage.append($originalPage);
    changePage = function(href) {
      $book.addClass('loading');
      return $.ajax({
        url: BookConfig.urlFixer(href),
        headers: {
          'Accept': 'application/xhtml+xml'
        },
        dataType: 'html'
      }).then(function(html) {
        var $html;
        $html = $("<div>" + html + "</div>");
        $html.children('meta, link, script, title').remove();
        $bookPage.contents().remove();
        if (BookConfig.baseHref) {
          $book.find('base').remove();
          $book.prepend("<base href='" + (BookConfig.urlFixer(href)) + "'/>");
        }
        $bookPage.append($html.children());
        return $book.removeClass('loading');
      });
    };
    return $('body').on('click', 'a[href]:not([href^="#"])', function(evt) {
      var href;
      href = addTrailingSlash($(this).attr('href'));
      href = URI(href).absoluteTo(URI(window.location.href)).toString();
      changePage(href).then(function() {
        if (!/https?:\/\//.test(href)) {
          href = "" + window.location.origin + href;
        }
        window.history.pushState(null, null, href);
        return renderNextPrev();
      });
      return evt.preventDefault();
    });
  });

}).call(this);
