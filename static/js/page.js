
function ready(callback) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        callback();
    }
}

function initRandomQuote() {
    const quoteContainer = document.getElementById('randomQuoteContainer');
    const quoteContent = quoteContainer?.querySelector('[data-quote-content]');
    const previousQuoteButton = quoteContainer?.querySelector('[data-quote-prev]');
    const nextQuoteButton = quoteContainer?.querySelector('[data-quote-next]');
    if (!quoteContent || !previousQuoteButton || !nextQuoteButton) {
        return;
    }

    const quotes = [
        ['我们的生命太过短暂，就像朝露，转瞬即逝'],
        ['见过花就好了，又何必在意花属于谁'],
        ['有些鸟儿是永远关不住的', '因为它们的每一片羽毛都沾满了自由的光辉'],
        ['少年的喜欢是场哑剧', '等开口时台下早已无人'],
        ['爱意随风起，风止意难平', '与其追风去，不如等风来'],
        ['沉默成本不参与人生的重大决策'],
        ['不管心情有多糟糕，都要和爱的人好好说话'],
        ['永远不要把最坏的情绪留给最爱的人！'],
        ['人生没有那么多观众，不妨大胆一些'],
        ['生灵各会找到自己的出路'],
        ['三分爱人，七分爱己'],
        ['努力无数次，才知机会只现一两次'],
        ['尽人事，听天命'],
        ['君子论迹不论心，论心世上少完人'],
        ['爱就要大胆的表达出来'],
        ['尽已读不回是在细品 未读未回必有苦衷'],
        ['幸福=能力-欲望'],
        ['友情也好，爱情也罢，都是阶段性的，就像花开花落。四季轮替，每一段关系都有它的生命周期', '无论是多么亲密的一段关系，它都是你生命长河中的一个片段'],
        ['人与人之间的链接，就像流水，有聚有散'],
        ['学会爱，也学会放手'],
        ['阮姑娘可以这么问，我却不能这么想，所以不会有答案'],
        ['真的好羨慕好羡慕你们，可以和喜欢的人在一起'],
        ['如果你还能影响一个人的心情  请不要做让他心寒的事'],
        ['人一没病，二没灾，小小日子，悠哉悠哉'],
        ['万花丛中过，片叶不沾身'],
    ];

    let currentQuoteIndex = 0;

    function showQuote(index) {
        currentQuoteIndex = (index + quotes.length) % quotes.length;
        const selectedQuote = quotes[currentQuoteIndex];
        quoteContent.replaceChildren();
        selectedQuote.forEach((line) => {
            const div = document.createElement('div');
            div.className = 'left-des-item';
            div.textContent = line;
            quoteContent.appendChild(div);
        });
    }

    function showRandomQuote() {
        showQuote(Math.floor(Math.random() * quotes.length));
    }

    showRandomQuote();
    previousQuoteButton.addEventListener('click', () => showQuote(currentQuoteIndex - 1));
    nextQuoteButton.addEventListener('click', () => showQuote(currentQuoteIndex + 1));
    document.addEventListener('sidebar-opened', showRandomQuote);
}


function initCarousel() {
    const carousel = document.querySelector('.promo-track');
    const prevBtn = document.querySelector('.promo-prev');
    const nextBtn = document.querySelector('.promo-next');
    const items = document.querySelectorAll('.promo-track .projectItem');
    const indicators = document.querySelectorAll('.indicator');
    if (!carousel || !prevBtn || !nextBtn || items.length === 0) {
        return;
    }

    let currentIndex = 0;
    let intervalId = null;

    function goToIndex(index) {
        if (index < 0) {
            currentIndex = items.length - 1;
        } else if (index >= items.length) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }

        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === currentIndex);
        });
    }

    function startInterval() {
        intervalId = setInterval(() => {
            goToIndex(currentIndex + 1);
        }, 5000);
    }

    function resetInterval() {
        clearInterval(intervalId);
        startInterval();
    }

    prevBtn.addEventListener('click', () => {
        goToIndex(currentIndex - 1);
        resetInterval();
    });

    nextBtn.addEventListener('click', () => {
        goToIndex(currentIndex + 1);
        resetInterval();
    });

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToIndex(index);
            resetInterval();
        });
    });

    startInterval();
}

function initResourceCount() {
    const resourceCount = document.getElementById('resource-count');
    if (!resourceCount) {
        return;
    }

    const resourceTotal = document.querySelectorAll('.subTitle.link-item').length;
    resourceCount.textContent = resourceTotal.toLocaleString('zh-CN');
}

function initRecentUpdates() {
    fetch('./static/data/recent-updates.json', { cache: 'no-store' })
        .then((response) => response.ok ? response.json() : null)
        .then((data) => {
            const items = Array.isArray(data?.items) ? data.items : [];
            if (items.length === 0) {
                return;
            }

            const recentKeys = new Set(items.map((item) => {
                return `${String(item.title || '').trim()}\u0000${String(item.url || '').trim()}`;
            }));

            document.querySelectorAll('.link-item[data-open-url]').forEach((item) => {
                const url = item.getAttribute('data-open-url') || '';
                const title = (item.textContent || '').trim().replace(/\s+/g, ' ');
                if (!recentKeys.has(`${title}\u0000${url.trim()}`)) {
                    return;
                }

                item.classList.add('is-recently-updated');
                let folder = item.closest('.folder');
                while (folder) {
                    folder.querySelector(':scope > .title')?.classList.add('is-recently-updated');
                    folder = folder.parentElement?.closest('.folder');
                }
            });
        })
        .catch(() => {});
}

function initCounter() {
    const siteCounter = document.getElementById('site-counter');
    const monthCounter = document.getElementById('month-counter');
    if (!siteCounter || !monthCounter) {
        return;
    }

    fetch('/api/count', { cache: 'no-store' })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`统计接口错误: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            siteCounter.textContent = Number(data.total || 0).toLocaleString('zh-CN');
            monthCounter.textContent = Number(data.month_count || 0).toLocaleString('zh-CN');
        })
        .catch((error) => {
            console.error('访问统计加载失败:', error);
            siteCounter.textContent = '--';
            monthCounter.textContent = '--';
        });
}

function initSidebar() {
    const btn = document.getElementById('menuBtn');
    const panel = document.querySelector('.zyyo-left');
    if (!btn || !panel) {
        return;
    }

    const mask = document.createElement('div');
    mask.id = 'mask';
    mask.className = 'sidebar-mask';
    document.body.appendChild(mask);

    panel.classList.add('sidebar-panel');
    btn.classList.add('sidebar-toggle-button');

    let isOpen = false;
    let lastTouchY = 0;
    let touchStartY = 0;
    let touchMoved = false;
    let touchStartedOnMask = false;
    let activeTouchScrollArea = null;
    let suppressMaskClickUntil = 0;

    function scrollSidebar(deltaY) {
        panel.scrollTop += deltaY;
    }

    function getInnerScrollArea(target) {
        return target instanceof Element ? target.closest('#line, #announcementSidebarList') : null;
    }

    function isAtScrollBoundary(scrollArea, deltaY) {
        const atTop = scrollArea.scrollTop <= 0;
        const atBottom = scrollArea.scrollTop + scrollArea.clientHeight >= scrollArea.scrollHeight - 1;
        return (deltaY < 0 && atTop) || (deltaY > 0 && atBottom);
    }

    function getWheelDelta(event) {
        if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
            return event.deltaY * 16;
        }
        if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
            return event.deltaY * panel.clientHeight;
        }
        return event.deltaY;
    }

    function lockSidebarWheel(event) {
        if (!isOpen) {
            return;
        }

        const innerScrollArea = getInnerScrollArea(event.target);
        if (innerScrollArea) {
            if (isAtScrollBoundary(innerScrollArea, event.deltaY)) {
                event.preventDefault();
            }
            event.stopPropagation();
            return;
        }

        scrollSidebar(getWheelDelta(event));
        event.preventDefault();
        event.stopPropagation();
    }

    function rememberTouchStart(event) {
        lastTouchY = event.touches[0]?.clientY || 0;
        touchStartY = lastTouchY;
        touchMoved = false;
        touchStartedOnMask = event.target === mask;
        activeTouchScrollArea = isOpen ? getInnerScrollArea(event.target) : null;
    }

    function lockSidebarTouch(event) {
        if (!isOpen) {
            return;
        }

        const currentY = event.touches[0]?.clientY || lastTouchY;
        const deltaY = lastTouchY - currentY;
        lastTouchY = currentY;

        if (Math.abs(currentY - touchStartY) > 6) {
            touchMoved = true;
        }

        if (activeTouchScrollArea) {
            if (isAtScrollBoundary(activeTouchScrollArea, deltaY)) {
                event.preventDefault();
            }
            event.stopPropagation();
            return;
        }

        scrollSidebar(deltaY);
        event.preventDefault();
        event.stopPropagation();
    }

    function rememberTouchEnd() {
        if (touchMoved && touchStartedOnMask) {
            suppressMaskClickUntil = Date.now() + 400;
        }
        activeTouchScrollArea = null;
    }

    function toggleSidebar() {
        isOpen = !isOpen;
        panel.classList.add('is-ready');
        panel.classList.toggle('is-open', isOpen);
        mask.classList.toggle('is-visible', isOpen);
        btn.classList.toggle('is-open', isOpen);
        btn.setAttribute('aria-expanded', String(isOpen));
        btn.setAttribute('aria-label', isOpen ? '关闭侧边栏' : '打开侧边栏');
        document.body.classList.toggle('sidebar-open', isOpen);
        document.documentElement.classList.toggle('sidebar-open', isOpen);
        if (isOpen) {
            document.dispatchEvent(new Event('sidebar-opened'));
        }
    }

    btn.addEventListener('click', toggleSidebar);
    mask.addEventListener('click', (event) => {
        if (Date.now() < suppressMaskClickUntil) {
            event.preventDefault();
            return;
        }
        toggleSidebar();
    });
    document.addEventListener('wheel', lockSidebarWheel, { capture: true, passive: false });
    document.addEventListener('touchstart', rememberTouchStart, { capture: true, passive: true });
    document.addEventListener('touchmove', lockSidebarTouch, { capture: true, passive: false });
    document.addEventListener('touchend', rememberTouchEnd, { capture: true, passive: true });
}

function initSearch() {
    const searchBtn = document.getElementById('searchBtn');
    const searchContainer = document.getElementById('searchContainer');
    const searchInput = document.getElementById('searchInput');
    const prevResult = document.getElementById('prevResult');
    const nextResult = document.getElementById('nextResult');
    const closeSearch = document.getElementById('closeSearch');
    const searchCount = document.getElementById('searchCount');
    if (!searchBtn || !searchContainer || !searchInput || !prevResult || !nextResult || !closeSearch || !searchCount) {
        return;
    }

    let searchTerm = '';
    let matches = [];
    let currentMatchIndex = -1;

    function updateSearchCount() {
        searchCount.textContent = matches.length === 0 ? '' : `${currentMatchIndex + 1} / ${matches.length}`;
    }

    function expandAllFolders() {
        document.querySelectorAll('.folder').forEach((folder) => {
            folder.classList.add('open');
            const subWrap = folder.querySelector('.subWrap');
            if (subWrap) {
                subWrap.classList.remove('is-collapsed');
            }
        });
    }

    function collapseAllFolders() {
        document.querySelectorAll('.folder').forEach((folder) => {
            folder.classList.remove('open');
            const subWrap = folder.querySelector('.subWrap');
            if (subWrap) {
                subWrap.classList.add('is-collapsed');
            }
        });
    }

    function clearSearchHighlights() {
        document.querySelectorAll('.search-highlight').forEach((el) => {
            const parent = el.parentNode;
            if (parent) {
                parent.replaceChild(document.createTextNode(el.textContent), el);
                parent.normalize();
            }
        });
    }

    function fuzzySequenceMatch(text, search) {
        const target = text.toLowerCase();
        const keyword = search.toLowerCase().replace(/\s+/g, '');
        if (!keyword || target.indexOf(keyword[0]) === -1) {
            return false;
        }

        let textIndex = 0;
        let start = -1;
        for (const char of keyword) {
            const found = target.indexOf(char, textIndex);
            if (found === -1) {
                return false;
            }
            if (start === -1) {
                start = found;
            }
            textIndex = found + 1;
        }

        return [start, textIndex - 1];
    }

    function findMatch(text, keyword) {
        if (window.PinyinMatch && typeof window.PinyinMatch.match === 'function') {
            return window.PinyinMatch.match(text, keyword);
        }
        const index = text.toLowerCase().indexOf(keyword.toLowerCase());
        return index === -1 ? fuzzySequenceMatch(text, keyword) : [index, index + keyword.length - 1];
    }

    function scrollToCurrentMatch() {
        if (matches.length === 0) {
            return;
        }

        if (currentMatchIndex >= matches.length) currentMatchIndex = 0;
        if (currentMatchIndex < 0) currentMatchIndex = matches.length - 1;

        const el = matches[currentMatchIndex];
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        matches.forEach((match, index) => {
            match.style.backgroundColor = index === currentMatchIndex
                ? 'rgba(255, 215, 0, 0.6)'
                : 'rgba(255, 255, 0, 0.3)';
            match.style.boxShadow = index === currentMatchIndex ? '0 0 5px #666' : 'none';
        });
    }

    function highlightMatches() {
        clearSearchHighlights();
        searchTerm = searchInput.value.trim();

        if (!searchTerm) {
            matches = [];
            currentMatchIndex = -1;
            updateSearchCount();
            return;
        }

        const searchArea = document.querySelector('.zyyo-right') || document.body;
        const walker = document.createTreeWalker(searchArea, NodeFilter.SHOW_TEXT);
        const textNodes = [];
        let node = walker.nextNode();
        while (node) {
            const parent = node.parentNode;
            if (parent && !['SCRIPT', 'STYLE'].includes(parent.tagName) && node.textContent.trim()) {
                textNodes.push(node);
            }
            node = walker.nextNode();
        }

        matches = [];
        textNodes.forEach((textNode) => {
            let remainingText = textNode.textContent;
            let match = findMatch(remainingText, searchTerm);
            if (!match) {
                return;
            }

            const fragment = document.createDocumentFragment();
            while (match) {
                const [start, end] = match;
                if (start > 0) {
                    fragment.appendChild(document.createTextNode(remainingText.substring(0, start)));
                }

                const span = document.createElement('span');
                span.className = 'search-highlight';
                span.textContent = remainingText.substring(start, end + 1);
                fragment.appendChild(span);
                matches.push(span);

                remainingText = remainingText.substring(end + 1);
                match = remainingText ? findMatch(remainingText, searchTerm) : false;
            }

            if (remainingText) {
                fragment.appendChild(document.createTextNode(remainingText));
            }
            textNode.parentNode.replaceChild(fragment, textNode);
        });

        currentMatchIndex = matches.length > 0 ? 0 : -1;
        scrollToCurrentMatch();
        updateSearchCount();
    }

    searchBtn.addEventListener('click', () => {
        searchContainer.style.display = 'block';
        searchInput.focus();
        expandAllFolders();
    });

    closeSearch.addEventListener('click', () => {
        searchContainer.style.display = 'none';
        clearSearchHighlights();
        searchInput.value = '';
        matches = [];
        currentMatchIndex = -1;
        updateSearchCount();
        collapseAllFolders();
    });

    searchInput.addEventListener('input', highlightMatches);
    prevResult.addEventListener('click', () => {
        if (matches.length === 0) return;
        currentMatchIndex -= 1;
        scrollToCurrentMatch();
        updateSearchCount();
    });
    nextResult.addEventListener('click', () => {
        if (matches.length === 0) return;
        currentMatchIndex += 1;
        scrollToCurrentMatch();
        updateSearchCount();
    });
    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (matches.length > 0) {
                currentMatchIndex += 1;
                scrollToCurrentMatch();
                updateSearchCount();
            } else {
                highlightMatches();
            }
        }
        if (event.key === 'Escape') {
            closeSearch.click();
        }
    });
}

function initScrollProgress() {
    const scrollProgress = document.getElementById('scrollProgress');
    const progressHandle = document.getElementById('progressHandle');
    if (!scrollProgress || !progressHandle) {
        return;
    }

    const getScrollRange = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    function scrollToProgress(progress, behavior = 'auto') {
        window.scrollTo({
            top: Math.max(0, Math.min(1, progress)) * getScrollRange(),
            behavior,
        });
    }

    function updateScrollPosition() {
        const scrollRange = getScrollRange();
        const trackHeight = scrollProgress.clientHeight;
        if (trackHeight <= 0) {
            return;
        }

        const isScrollable = scrollRange > 1;
        scrollProgress.classList.toggle('is-hidden', !isScrollable);
        if (!isScrollable) {
            return;
        }

        const viewportRatio = window.innerHeight / document.documentElement.scrollHeight;
        const handleHeight = Math.min(trackHeight, Math.max(44, Math.round(trackHeight * viewportRatio)));
        const progress = Math.max(0, Math.min(1, window.scrollY / scrollRange));
        const position = progress * (trackHeight - handleHeight);
        const percent = Math.round(progress * 100);

        progressHandle.style.height = `${handleHeight}px`;
        progressHandle.style.top = `${position}px`;
        scrollProgress.setAttribute('aria-valuenow', String(percent));
        scrollProgress.setAttribute('aria-valuetext', percent === 0 ? '页面顶部' : percent === 100 ? '页面底部' : `已阅读 ${percent}%`);
    }

    let activePointerId = null;
    let dragOffset = 0;

    function updateFromPointer(event) {
        const rect = scrollProgress.getBoundingClientRect();
        const handleHeight = progressHandle.offsetHeight;
        const travelDistance = Math.max(1, rect.height - handleHeight);
        const position = Math.max(0, Math.min(travelDistance, event.clientY - rect.top - dragOffset));
        scrollToProgress(position / travelDistance);
    }

    scrollProgress.addEventListener('pointerdown', (event) => {
        if (event.button !== undefined && event.button !== 0) {
            return;
        }
        event.preventDefault();
        activePointerId = event.pointerId;
        const handleRect = progressHandle.getBoundingClientRect();
        dragOffset = event.target === progressHandle ? event.clientY - handleRect.top : handleRect.height / 2;
        scrollProgress.setPointerCapture(activePointerId);
        scrollProgress.classList.add('is-dragging');
        updateFromPointer(event);
    });

    scrollProgress.addEventListener('pointermove', (event) => {
        if (event.pointerId !== activePointerId) {
            return;
        }
        updateFromPointer(event);
    });

    function stopDragging(event) {
        if (event.pointerId !== activePointerId) {
            return;
        }
        if (scrollProgress.hasPointerCapture(activePointerId)) {
            scrollProgress.releasePointerCapture(activePointerId);
        }
        activePointerId = null;
        scrollProgress.classList.remove('is-dragging');
    }

    scrollProgress.addEventListener('pointerup', stopDragging);
    scrollProgress.addEventListener('pointercancel', stopDragging);
    scrollProgress.addEventListener('keydown', (event) => {
        const step = Math.max(80, window.innerHeight * 0.12);
        if (event.key === 'ArrowUp' || event.key === 'PageUp') {
            event.preventDefault();
            window.scrollBy({ top: -step, behavior: 'smooth' });
        } else if (event.key === 'ArrowDown' || event.key === 'PageDown') {
            event.preventDefault();
            window.scrollBy({ top: step, behavior: 'smooth' });
        } else if (event.key === 'Home') {
            event.preventDefault();
            scrollToProgress(0, 'smooth');
        } else if (event.key === 'End') {
            event.preventDefault();
            scrollToProgress(1, 'smooth');
        }
    });

    let framePending = false;
    function requestUpdate() {
        if (!framePending) {
            framePending = true;
            requestAnimationFrame(() => {
                framePending = false;
                updateScrollPosition();
            });
        }
    }

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', updateScrollPosition);
    new ResizeObserver(requestUpdate).observe(document.body);
    updateScrollPosition();
}

function initDynamicViewport() {
    const root = document.documentElement;

    function updateViewportHeight() {
        const viewport = window.visualViewport;
        const height = Math.max(window.innerHeight, viewport ? viewport.height + viewport.offsetTop : 0);
        root.style.setProperty('--app-viewport-height', `${Math.ceil(height)}px`);
    }

    updateViewportHeight();
    window.addEventListener('resize', updateViewportHeight);
    window.addEventListener('orientationchange', updateViewportHeight);
    window.visualViewport?.addEventListener('resize', updateViewportHeight);
    window.visualViewport?.addEventListener('scroll', updateViewportHeight);
}

function initFeature(name, initializer) {
    try {
        initializer();
    } catch (error) {
        console.error(`${name} 初始化失败:`, error);
    }
}

ready(() => {
    [
        ['动态视口', initDynamicViewport],
        ['随机语录', initRandomQuote],
        ['广告轮播', initCarousel],
        ['资源数量', initResourceCount],
        ['最近更新标记', initRecentUpdates],
        ['访问计数', initCounter],
        ['侧边栏', initSidebar],
        ['页面搜索', initSearch],
        ['滚动进度条', initScrollProgress],
    ].forEach(([name, initializer]) => {
        initFeature(name, initializer);
    });
});
