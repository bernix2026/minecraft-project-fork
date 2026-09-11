document.addEventListener('DOMContentLoaded', function() {
    // Check if page has scroll and adjust footer
    function adjustFooter() {
        const footer = document.querySelector('footer');
        if (document.body.scrollHeight <= window.innerHeight) {
            footer.style.position = 'fixed';
            footer.style.bottom = '0';
            footer.style.width = '100%';
        } else {
            footer.style.position = 'static';
        }
    }
    
    window.addEventListener('resize', adjustFooter);
    adjustFooter();
    
    // Scrolling Header Functionality
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});


/* ---------------------------------------------------------------------------
   Filter box for long lists.

   The block list runs to over a thousand entries. On a phone that is roughly
   fifty screens of scrolling, and the page's own advice - use the browser's
   find function - is awkward on mobile where that control is buried in a menu.
   Any list long enough to warrant it gets a search box that filters as you
   type.
--------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
    var MIN_ITEMS = 40;

    document.querySelectorAll('ul.block-list, ul.mob-list').forEach(function (list) {
        var items = Array.prototype.slice.call(list.children);
        if (items.length < MIN_ITEMS) return;

        var wrap = document.createElement('div');
        wrap.className = 'list-filter';

        var input = document.createElement('input');
        input.type = 'search';
        input.className = 'list-filter-input';
        input.placeholder = 'Filter these ' + items.length + ' entries…';
        input.setAttribute('aria-label', 'Filter the list below');

        var count = document.createElement('span');
        count.className = 'list-filter-count';
        count.setAttribute('aria-live', 'polite');
        count.textContent = items.length + ' shown';

        wrap.appendChild(input);
        wrap.appendChild(count);
        list.parentNode.insertBefore(wrap, list);

        var labels = items.map(function (li) {
            return (li.textContent || '').trim().toLowerCase();
        });

        function apply() {
            var q = input.value.trim().toLowerCase();
            var shown = 0;
            for (var i = 0; i < items.length; i++) {
                var hit = (!q || labels[i].indexOf(q) !== -1) && inFamily(i);
                items[i].hidden = !hit;
                if (hit) shown++;
            }
            count.textContent = (q || active.length)
                ? shown + ' of ' + items.length
                : items.length + ' shown';
            count.classList.toggle('is-empty', (q || active.length) && shown === 0);
        }


        /* Family chips. Each is a set of substrings matched against the entry
           name. Several can be on at once and they union, so Wood + Stone +
           Ore shows all three families together. The text box then narrows
           whatever the chips let through, so the Ore chip plus "deepslate"
           gives the deepslate ores only. */
        var FAMILIES = [
            ['Wood',     ['oak', 'spruce', 'birch', 'jungle', 'acacia', 'mangrove',
                          'cherry', 'poplar', 'bamboo', 'crimson', 'warped',
                          'plank', 'log', 'wood']],
            ['Stone',    ['stone', 'cobble', 'granite', 'diorite', 'andesite',
                          'deepslate', 'tuff', 'basalt', 'blackstone', 'calcite']],
            ['Ore',      ['ore', 'ancient debris', 'raw ']],
            ['Copper',   ['copper']],
            ['Concrete', ['concrete']],
            ['Wool',     ['wool', 'carpet']],
            ['Glass',    ['glass']],
            ['Redstone', ['redstone', 'piston', 'observer', 'repeater',
                          'comparator', 'hopper', 'dropper', 'dispenser',
                          'rail', 'lever', 'target', 'crafter']],
            ['Plants',   ['sapling', 'flower', 'tulip', 'rose', 'grass', 'fern',
                          'leaves', 'vine', 'moss', 'mushroom', 'wart', 'kelp',
                          'seagrass', 'bamboo', 'cactus', 'azalea', 'dripleaf',
                          'petal', 'orchid', 'allium', 'daisy', 'lilac',
                          'cornflower', 'poppy', 'dandelion', 'eyeblossom',
                          'wildflowers', 'pitcher', 'torchflower', 'sunflower',
                          'peony', 'lily', 'sprouts', 'roots', 'fungus']],
            ['Stairs',   ['stairs']],
            ['Slabs',    ['slab']]
        ];

        var chipRow = document.createElement('div');
        chipRow.className = 'list-chips';
        chipRow.setAttribute('role', 'group');
        chipRow.setAttribute('aria-label', 'Filter by family');

        var active = [];

        /* Membership is fixed once the list is built, so work it out here
           rather than re-scanning a thousand names on every keystroke. */
        var members = FAMILIES.map(function (fam) {
            var terms = fam[1];
            var hits = [];
            for (var i = 0; i < labels.length; i++) {
                var inIt = false;
                for (var t = 0; t < terms.length; t++) {
                    if (labels[i].indexOf(terms[t]) !== -1) { inIt = true; break; }
                }
                hits.push(inIt);
            }
            return hits;
        });

        FAMILIES.forEach(function (fam, famIndex) {
            var name = fam[0];
            var hits = members[famIndex];
            var n = 0;
            for (var i = 0; i < hits.length; i++) {
                if (hits[i]) n++;
            }
            if (!n) return;

            var chip = document.createElement('button');
            chip.type = 'button';
            chip.className = 'list-chip';
            chip.textContent = name + ' (' + n + ')';
            chip.setAttribute('aria-pressed', 'false');
            chip.addEventListener('click', function () {
                var at = active.indexOf(famIndex);
                if (at === -1) {
                    active.push(famIndex);
                    chip.classList.add('is-on');
                    chip.setAttribute('aria-pressed', 'true');
                } else {
                    active.splice(at, 1);
                    chip.classList.remove('is-on');
                    chip.setAttribute('aria-pressed', 'false');
                }
                syncClear();
                apply();
            });
            chipRow.appendChild(chip);
        });

        /* With several chips on at once, clearing them one by one is tedious. */
        var clear = document.createElement('button');
        clear.type = 'button';
        clear.className = 'list-chip list-chip-clear';
        clear.textContent = 'Clear';
        clear.hidden = true;
        clear.addEventListener('click', function () {
            active.length = 0;
            chipRow.querySelectorAll('.list-chip.is-on').forEach(function (c) {
                c.classList.remove('is-on');
                c.setAttribute('aria-pressed', 'false');
            });
            syncClear();
            apply();
        });

        function syncClear() {
            clear.hidden = active.length === 0;
        }

        if (chipRow.children.length) {
            chipRow.appendChild(clear);
            wrap.parentNode.insertBefore(chipRow, wrap.nextSibling);
        }

        function inFamily(i) {
            if (!active.length) return true;
            for (var a = 0; a < active.length; a++) {
                if (members[active[a]][i]) return true;
            }
            return false;
        }

        input.addEventListener('input', apply);
        input.addEventListener('search', apply);
    });
});
