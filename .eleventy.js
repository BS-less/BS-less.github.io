const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');

module.exports = function(config) {
    config.addPassthroughCopy({ './src/_resources/': '.' });
    config.addWatchTarget('./src/_resources');

    const markdownLib = markdownIt({ html: true })
    .use(markdownItAnchor, {
	level: 2,
	permalink: markdownItAnchor.permalink.headerLink({ safariReaderFix: true }),
    });
    config.setLibrary('md', markdownLib);

    // gets the navbar items
    config.addFilter('getNavItems', (collections, url) => {
	let currentUrl = url.split('/')[1];

	const links = [{
	    rootUrl: '/',
	    name: 'home',
	    selected: !(currentUrl in collections) }
	];
	for (const key in collections) {
	    // ignore this collection
	    if (key === 'all' || key == 'home') continue;

	    links.push({ rootUrl: `/${key}/about/`, name: key, selected: currentUrl === key });
	}

	// sort the links while leaving 'home' first
	return links.toSorted((a, b) => {
	    if (a.name === 'home') return -1;
	    if (b.name === 'home') return 1;
	    if (a.name > b.name) return 1;
	    if (a.name < b.name) return -1;
	    return 0;
	});
    });

    // gets all the sidebar links and filters them based on the current url
    config.addFilter('sidebarFilter', (arr, url, collections) => {
	// since the home subdir is shown as root in the
	// url, we need to check if this page is part of
	// the home dir or not
	const inHomeDir = !(url.split('/')[1] in collections);

	const links = arr.filter(page => {
	    const linkUrl = page.url.split('/')[1];
	    const currentUrl = url.split('/')[1];

	    

	    // if we're in the same subdir, yay
	    if (linkUrl === currentUrl) return true;
	    // if we're in the home subdir then yay (if it's not another subdir)
	    if (
		inHomeDir &&
		!(linkUrl in collections)
	    ) return true;
	    // otherwise remove it
	    return false;
	});

	// simply sorts the links
	return links.toSorted((a, b) => {
	    if (a.fileSlug > b.fileSlug) return 1;
	    if (a.fileSlug < b.fileSlug) return -1;
	    return 0;
	});
    });

    return {
	dir: {
	    input: './src',
	    output: './build',
	},
    };
}
