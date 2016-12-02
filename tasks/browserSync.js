'use strict';
/**
*Dépendances
*/
var gulp        = require('gulp');
var browserSync = require('browser-sync');
var _           = require('lodash');
var minimist    = require('minimist');
var gutil       = require('gulp-util');
/**
*Global Var
*/
var knownOptions = {
	//Défini les options possibles en ligne de commande
  string: ['sources', 'sites']
};
let defaultPort = 3301;
let uiPort = 3311;

// Prends les paramètres depuis la ligne de commande si knownOptions
var commandLineOptions = minimist(process.argv.slice(2), knownOptions);

gulp.task('live-reload', 'Live reload and sync browser on proxy adress', function() {
	/**
	* 
	* site par defaut : default.local avec watch sur /scr et /dist
	* sinon check argument passé en ligne de commande
	* sinon check fichier de configuration 
	* fallback : default.local
	*/
  var sites = [
    {
       "proxy": "default.local",
       "sources": ["/scr/*","/dist/*"]       
    }
  ];
  
  var projectRoot = gulp.task.configuration.projectRoot;    
  
  if (commandLineOptions.sites) {
    var params = _.split(commandLineOptions.sites, ',');
    sites = [];
      params.forEach(
        function(param) {
          param = _.split(param, ':');
          let proxy = param[0];
          let sources = _.tail(param); 
          let site =  {
            "proxy": proxy,
            "sources": sources
          };
          sites.push(site);
        }
      )
  }
  else if (_.has(gulp.task.configuration, 'tasks.live-reload.sites')) 
    {
      sites = gulp.task.configuration.tasks['live-reload'].sites;
      gutil.log(gutil.colors.blue('Read sites url from the configuration file: ' + sites));
  	}

  /**
  * Watchers
  */
  let setReload = {

    reload(site, server) {
      site.sources.forEach(
        function(source) {
          source = projectRoot + _.trimStart(source, '/');
          gutil.log(gutil.colors.blue('Watching files from : '+source+' for :'+site.proxy ));
          gulp.watch(source).on('change', server.reload);
        }
      )  
    }  
  }

  /**
  * Initialiser la tache
  */ 
  sites.forEach(
  	function(site) {
  		let server = browserSync.create(); 
  		server.init({
  			proxy: site.proxy,
  			port: defaultPort,
  			ui: {
  				port: uiPort
  			}
  		}),
  	defaultPort++;
  	uiPort++;
     /*fichiers à observer pour le livereload*/
     setReload.reload(site, server);
  })

    
},
{ options: {
    sources: 'The source files or folder to check for live reload. To add multiple sources use a \',\'.  ' +
     '--sources=controllers/**/*.php,Modules/**/*' ,
    sites: 'The site virtual host to charge on proxy. To add multiple sites use a \',\'.  ' +
     '--sites=default.local,app.local' ,  
  } 
});

//Fin 

/**
* Definir tache par défaut
*/
gulp.task('sync','Live reload on proxy using browserSync', ['live-reload']);