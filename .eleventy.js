module.exports = function(config) {
    config.addPassthroughCopy({ './src/_resources/': '.' });
    config.addWatchTarget('./src/_resources');

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
