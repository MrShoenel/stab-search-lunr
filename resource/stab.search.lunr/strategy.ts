/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/lunr/lunr.d.ts" />
/// <reference path="../../typings/stab/app.common.d.ts" />

module Blog.ArticleList {
	/**
	 * This is an advanced search strategy based on the Lunr-fulltext search
	 * engine. It can be used by the list-type 'search-lunr' on the article-list
	 * tag.
	 */
	export class LunrSearchStrategy extends Common.AListStrategy {
		private metaArts: Common.MetaArticle[];

		private static index: lunr.Index;

		private minCertainty: number = 0;

		public itemsList(source: Common.MetaArticle[]): Common.MetaArticle[] {
			const searchParam = <string>this.injected['locationSearch'];

			if (searchParam === undefined) {
				return [];
			}

			this.initializeIndex(source);

			const minCertainty = this.injected['scorer-min-certainty'] ?
				parseFloat(this.injected['scorer-min-certainty']) || 0 : 0;

			return LunrSearchStrategy.index.search(searchParam).map(result => {
				const metaArt = source.filter(ma => ma.urlName === result.ref)[0];
				metaArt.score = result.score;
				return metaArt;
			});
		};

		private initializeIndex(source: Common.MetaArticle[]): LunrSearchStrategy {
			if (angular.isArray(this.metaArts)) {
				return this;
			}

			this.metaArts = source || this.metaArts;

			LunrSearchStrategy.index = lunr(function() {
				this.field('author', 10);
				this.field('keywords', 20);
				this.field('description', 30);
				this.field('title', 40);
				this.field('subtitle', 50);
				this.field('teaser', 60);
				this.ref('urlName');
			});

			// Now we have to make sure these fields at least exist:
			['author', 'keywords', 'title', 'subtitle', 'description', 'teaser'].forEach(k => {
				source.forEach(ma => ma[k] = angular.isString(ma[k]) ? ma[k] : '');
			});

			this.metaArts.forEach(m => LunrSearchStrategy.index.add(m));
		};

		static canHandle(listType: string): boolean {
			return (listType + '').toLowerCase() === 'search-lunr';
		};
	};
};
