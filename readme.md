#stab-search-lunr

This is a new *list-strategy* for [***Stab***](https://github.com/MrShoenel/stab) that allows ***fulltext***-search using [**lunr.js**](https://github.com/olivernn/lunr.js).


## Download and/or build

There is a [**release branch**](https://github.com/MrShoenel/stab-search-lunr/tree/release) which always holds the latest version, since the whole system consists only of ***one*** file! If you want to build it yourself or make other changes to it, you need to check out the latest version from *master* and run these commands:

	npm install
	grunt

By default it builds a concatenated and uglified version of this strategy (the default, because we want to keep the memory- and bandwidth-footprint low).


## Installation in Stab

Obtain a copy of *stab-search-lunr*. It is recommended to use an *optimized* build (contains only one files: the compressed/combined JavaScript) and the *Stab*-feature ***MyDeps***.

The installation is as easy as:

* **copy** the file *stab.search.lunr.strategy.js* into /content/mydeps
	* If you like, you may go ahead and create a sub-directory within your *mydeps*-folder to put this file in. This may help you organizing the structure a little better but it is not required!
* **rebuild** and deploy your *Stab*-content (your articles) as this will also re-deploy the new strategy!


## Usage

To use the new strategy, you need to place tags of the **ArticleList**-directive with **list-type** being **search-lunr** into your templates. This tag may look like the following:


&lt;**article-list** list-type="***search-lunr***" inject="scorer-min-certainty=.25"&gt;&lt;/**article-list**&gt;

Self-explanatory, isn't it?

## Requirements

This strategy requires [***Stab v1.7.x+***](https://github.com/MrShoenel/stab).
